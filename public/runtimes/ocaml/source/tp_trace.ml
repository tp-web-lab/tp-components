(* Execution observation for the real OCaml toplevel. No source expression is
   evaluated twice. Locations refer to the original UTF-8 source. *)
open Js_of_ocaml
open Asttypes
open Parsetree
open Ast_helper

type shape = Int | Bool | Float | String | Char | Unit | Function
  | List of shape | Array of shape | Ref of shape | Tuple of shape list | Unknown
let str s = Js.Unsafe.inject (Js.string s)
let arr xs = Js.Unsafe.inject (Js.array (Array.of_list xs))
let obj xs = Js.Unsafe.obj (Array.of_list xs)
let number n = Js.Unsafe.inject n
let call_js name args = Js.Unsafe.fun_call (Js.Unsafe.get Js.Unsafe.global name) args
let globals : (string * shape * (unit -> Obj.t)) list ref = ref []
let stack : (int * string * (string * shape * Obj.t) list) list ref = ref []
let identities : (Obj.t * int) list ref = ref []
let captures : (Obj.t * (string * shape * Obj.t) list) list ref = ref []
let next_id = ref 0
let next_frame = ref 0
let events = ref 0
exception Limit
let identity value = match List.find_opt (fun (v,_) -> v == value) !identities with
 | Some (_,id) -> id
 | None -> incr next_id; identities := (value,!next_id)::!identities; !next_id
let snapshot event first last line env returned error =
 if !events >= 1000 then raise Limit;
 incr events;
 (match !stack with (id,name,_)::rest -> stack := (id,name,env)::rest | [] -> ());
 let heap = ref [] and seen = Hashtbl.create 32 in
 let rec encode depth shape value =
  if depth > 30 then str "<depth limit>" else
  match shape with
  | Bool -> Js.Unsafe.inject (Js.bool (Obj.obj value))
  | Unit -> arr [str "SPECIAL";str "()"]
  | Char -> str (String.make 1 (Obj.obj value))
  | String -> str (Obj.obj value)
  | Int -> number (Obj.obj value : int)
  | Float -> number (Obj.obj value : float)
  | List _ when Obj.is_int value -> str "[]"
  | _ when Obj.is_int value -> number (Obj.obj value : int)
  | _ when Obj.tag value = Obj.string_tag -> str (Obj.obj value)
  | _ when Obj.tag value = Obj.double_tag -> number (Obj.obj value : float)
  | _ ->
   let id = identity value in
   if not (Hashtbl.mem seen id) then begin
    Hashtbl.add seen id ();
    let child t v = encode (depth+1) t v in
    let field i t = child t (Obj.field value i) in
    let contents = match shape with
     | Function -> arr [str "FUNCTION";str "OCaml function";str ""]
     | Ref t -> arr [str "INSTANCE";str "ref";arr [str "contents";field 0 t]]
     | List t -> arr [str "PAIR";arr [str "head";field 0 t];arr [str "tail";(if Obj.is_int (Obj.field value 1) then str "[]" else field 1 (List t))]]
     | Array t -> arr (str "ARRAY" :: List.init (Obj.size value) (fun i -> if Obj.tag value = Obj.double_array_tag then number (Obj.double_field value i) else field i t))
     | Tuple ts -> arr (str "TUPLE" :: List.mapi (fun i t -> field i t) ts)
     | _ when Obj.tag value = Obj.closure_tag || Obj.tag value = Obj.infix_tag -> arr [str "FUNCTION";str "OCaml function";str ""]
     | _ when Obj.tag value >= Obj.no_scan_tag -> arr [str "SPECIAL";str "<abstract OCaml value>"]
     | _ -> arr (str "INSTANCE" :: str ("block (tag "^string_of_int (Obj.tag value)^")") :: List.init (min 50 (Obj.size value)) (fun i -> arr [str (string_of_int i);field i Unknown]))
    in heap := (string_of_int id,contents)::!heap
   end;
   arr [str "REF";number id]
 in
 let values env = obj (List.map (fun (name,t,v) -> name,encode 0 t v) env) in
 let names env = arr (List.map (fun (n,_,_) -> str n) env) in
 let global_values = List.map (fun (n,t,get) -> n,t,get ()) !globals in
 let global_obj = values global_values in
 let expression = match returned with Some (shape,value) when event="result" -> Some (obj ["value",encode 0 shape value]) | _ -> None in
 let frames = List.rev_map (fun (id,name,locals) ->
  let locals = match !stack with (top,_,_)::_ when top=id -> env | _ -> locals in
  let locals = match returned,!stack with Some (t,v),(top,_,_)::_ when top=id -> locals@["__return__",t,v] | _ -> locals in
  obj ["frame_id",number id;"func_name",str name;"encoded_locals",values locals;"ordered_varnames",names locals]) !stack in
 (* Retained closures expose their captured bindings while reachable. *)
 let frames = frames @ List.filter_map (fun (fn,env) ->
  let id = identity fn in
  if Hashtbl.mem seen id && env<>[] then Some (obj ["frame_id",str ("closure-"^string_of_int id);"func_name",str "Captured environment";"encoded_locals",values env;"ordered_varnames",names env]) else None) !captures in
 let fields = ["event",str event;"line",number line;"source_range",obj ["start",number first;"end",number last];"globals",global_obj;"ordered_globals",names global_values;"stack_to_render",arr frames;"heap",obj !heap] in
 let fields = match expression with None -> fields | Some value -> ("expression",value)::fields in
 let fields = match error with None -> fields | Some e -> ("exception_msg",str e)::fields in
 ignore (call_js "tpOcamlSnapshot" [|obj fields|])
let observe first last line shape env thunk =
 snapshot "step_line" first last line env None None;
 try let value=thunk () in
  if shape=Function && not(List.exists(fun(fn,_)->fn == Obj.repr value)!captures) then captures := (Obj.repr value,env)::!captures;
  snapshot "result" first last line env (Some (shape,Obj.repr value)) None;
  value
 with Limit -> raise Limit | e -> snapshot "exception" first last line env None (Some (Printexc.to_string e));raise e
let invoke name first last line shape env thunk =
 incr next_frame;
 let id = !next_frame in
 stack := (id,name,env)::!stack;
 snapshot "call" first last line env None None;
 match thunk () with
 | result -> snapshot "return" first last line env (Some (shape,Obj.repr result)) None;stack:=List.tl !stack; result
 | exception e -> if e<>Limit then snapshot "exception" first last line env None (Some (Printexc.to_string e));stack:=List.tl !stack;raise e
let add_global name shape getter = globals := List.filter (fun (n,_,_) -> n<>name) !globals @ [name,shape,getter]

let lid text = match Longident.unflatten (String.split_on_char '.' text) with Some path -> path | None -> invalid_arg "Empty identifier"
let identifier text = Exp.ident (Location.mknoloc (lid text))
let apply name args = Exp.apply (identifier name) (List.map (fun e -> Nolabel,e) args)
let constant n = Exp.constant (Const.int n)
let literal s = Exp.constant (Const.string s)
let rec list = function [] -> Exp.construct (Location.mknoloc (Longident.Lident "[]")) None | x::xs -> Exp.construct (Location.mknoloc (Longident.Lident "::")) (Some (Exp.tuple [None,x;None,list xs]))
let thunk e = Exp.function_ [ {pparam_loc=Location.none;pparam_desc=Pparam_val(Nolabel,None,Pat.construct (Location.mknoloc (Longident.Lident "()")) None)} ] None (Pfunction_body e)
let rec shape_of_type depth t =
 if depth>12 then Unknown else match Types.get_desc t with
 | Types.Tarrow _ -> Function
 | Types.Ttuple ts -> Tuple (List.map (fun (_,t)->shape_of_type (depth+1) t) ts)
 | Types.Tconstr (p,args,_) -> let child ()=match args with t::_ -> shape_of_type (depth+1) t | _ -> Unknown in
  (match List.hd(List.rev(String.split_on_char '.' (Path.name p))) with "int"->Int|"bool"->Bool|"float"->Float|"string"->String|"char"->Char|"unit"->Unit|"list"->List(child())|"array"->Array(child())|"ref"->Ref(child())|_->Unknown)
 | _ -> Unknown
let rec shape_expr = function
 | Int->Exp.construct (Location.mknoloc (lid "Tp_trace.Int")) None | Bool->Exp.construct (Location.mknoloc (lid "Tp_trace.Bool")) None | Float->Exp.construct (Location.mknoloc (lid "Tp_trace.Float")) None | String->Exp.construct (Location.mknoloc (lid "Tp_trace.String")) None | Char->Exp.construct (Location.mknoloc (lid "Tp_trace.Char")) None | Unit->Exp.construct (Location.mknoloc (lid "Tp_trace.Unit")) None | Function->Exp.construct (Location.mknoloc (lid "Tp_trace.Function")) None | Unknown->Exp.construct (Location.mknoloc (lid "Tp_trace.Unknown")) None
 | List t -> Exp.construct (Location.mknoloc(lid "Tp_trace.List")) (Some(shape_expr t))
 | Array t -> Exp.construct (Location.mknoloc(lid "Tp_trace.Array")) (Some(shape_expr t))
 | Ref t -> Exp.construct (Location.mknoloc(lid "Tp_trace.Ref")) (Some(shape_expr t))
 | Tuple ts -> Exp.construct (Location.mknoloc(lid "Tp_trace.Tuple")) (Some(list(List.map shape_expr ts)))
let record source =
 globals:=[];stack:=[];identities:=[];captures:=[];next_id:=0;next_frame:=0;events:=0;
 let lexbuf=Lexing.from_string source in Location.init lexbuf "program.ml";
 let formatter=Format.str_formatter in
 let shapes=Hashtbl.create 256 and pattern_shapes=Hashtbl.create 128 in
 let key loc=loc.Location.loc_start.Lexing.pos_cnum,loc.Location.loc_end.Lexing.pos_cnum in
 let expr_shape e=Option.value (Hashtbl.find_opt shapes (key e.pexp_loc)) ~default:Unknown in
 let bindings pattern =
  let names=ref [] in
  let iterator={Ast_iterator.default_iterator with pat=(fun self p ->
   (match p.ppat_desc with Ppat_effect _ -> failwith "Effect handlers are outside OCaml tracing." | _ -> ());
   (match p.ppat_desc with Ppat_var name | Ppat_alias (_,name) -> names := (name.txt,Option.value (Hashtbl.find_opt pattern_shapes (key p.ppat_loc)) ~default:Unknown)::!names | _->());Ast_iterator.default_iterator.pat self p)} in
  iterator.pat iterator pattern;List.rev !names in
 let merge env additions = List.filter (fun (n,_) -> not(List.mem_assoc n additions)) env @ additions in
 let env_expr env = list(List.map(fun(n,t)->Exp.tuple[None,literal n;None,shape_expr t;None,apply "Obj.repr" [identifier n]]) env) in
 let wrap name e env transformed =
  let l=e.pexp_loc in
  apply name [constant l.loc_start.pos_cnum;constant l.loc_end.pos_cnum;constant l.loc_start.pos_lnum;shape_expr(expr_shape e);env_expr env;thunk transformed] in
 let rec mapper env : Ast_mapper.mapper = {Ast_mapper.default_mapper with expr=(fun self e ->
  let transformed=match e.pexp_desc with
  | Pexp_let (recursive,vs,body) ->
    let extended=merge env (List.concat_map(fun v->bindings v.pvb_pat)vs) in
    let vs=List.map(fun v->{v with pvb_expr=map_value (if recursive=Recursive then extended else env) v.pvb_pat v.pvb_expr})vs in
    {e with pexp_desc=Pexp_let(recursive,vs,(mapper extended).expr (mapper extended) body)}
  | Pexp_function(params,constraint_,body) ->
    let extended=merge env (List.concat_map(fun p->match p.pparam_desc with Pparam_val(_,_,p)->bindings p | _->[])params) in
    let invoke_body locals b =
      let local_mapper=mapper locals and loc=b.pexp_loc in
      apply "Tp_trace.invoke" [literal "anonymous";constant loc.loc_start.pos_cnum;constant loc.loc_end.pos_cnum;constant loc.loc_start.pos_lnum;shape_expr(expr_shape b);env_expr locals;thunk(local_mapper.expr local_mapper b)] in
    let body=match body with
     | Pfunction_body b->Pfunction_body(invoke_body extended b)
     | Pfunction_cases(cs,l,a)->Pfunction_cases(List.map(fun c->
       let locals=merge extended(bindings c.pc_lhs) in let mm=mapper locals in
       {c with pc_guard=Option.map(mm.expr mm)c.pc_guard;pc_rhs=invoke_body locals c.pc_rhs})cs,l,a) in
    {e with pexp_desc=Pexp_function(params,constraint_,body)}
  | Pexp_construct(path,Some ({pexp_desc=Pexp_tuple parts;_} as tuple)) ->
    let tuple={tuple with pexp_desc=Pexp_tuple(List.map(fun(label,value)->label,self.expr self value)parts)} in
    {e with pexp_desc=Pexp_construct(path,Some tuple)}
  | Pexp_match(value,cases) -> {e with pexp_desc=Pexp_match(self.expr self value,List.map(map_case env)cases)}
  | Pexp_try(value,cases) -> {e with pexp_desc=Pexp_try(self.expr self value,List.map(map_case env)cases)}
  | Pexp_for(p,a,b,d,body) -> let m=mapper(merge env (bindings p)) in {e with pexp_desc=Pexp_for(p,self.expr self a,self.expr self b,d,m.expr m body)}
  | Pexp_object _ | Pexp_pack _ | Pexp_struct_item _ | Pexp_extension _ -> failwith "Objects, local modules, local exceptions and extensions are outside OCaml tracing."
  | _ -> Ast_mapper.default_mapper.expr self e
  in match e.pexp_desc with
  | Pexp_ident _ | Pexp_constant _ -> transformed
  | _ -> wrap "Tp_trace.observe" e env transformed)
 }
 and map_case env c = let m=mapper(merge env(bindings c.pc_lhs)) in {c with pc_guard=Option.map(m.expr m)c.pc_guard;pc_rhs=m.expr m c.pc_rhs}
 and map_value env pattern e =
  let m=mapper env in
  match e.pexp_desc with
  | Pexp_function(params,constraint_,body) ->
   let extended=merge env (List.concat_map(fun p->match p.pparam_desc with Pparam_val(_,_,p)->bindings p|_->[])params) in
   let mm=mapper extended in
   let name=match bindings pattern with (name,_)::_->name|_->"function" in
   let body_expr b = let l=b.pexp_loc in apply "Tp_trace.invoke" [literal name;constant l.loc_start.pos_cnum;constant l.loc_end.pos_cnum;constant l.loc_start.pos_lnum;shape_expr(expr_shape b);env_expr extended;thunk(mm.expr mm b)] in
   let body=match body with Pfunction_body b->Pfunction_body(body_expr b)|Pfunction_cases(cs,l,a)->Pfunction_cases(List.map(fun c->
     let locals=merge extended(bindings c.pc_lhs) in
     let m=mapper locals in
     let b=c.pc_rhs and loc=c.pc_rhs.pexp_loc in
     let rhs=apply "Tp_trace.invoke" [literal name;constant loc.loc_start.pos_cnum;constant loc.loc_end.pos_cnum;constant loc.loc_start.pos_lnum;shape_expr(expr_shape b);env_expr locals;thunk(m.expr m b)] in
     {c with pc_guard=Option.map(m.expr m)c.pc_guard;pc_rhs=rhs})cs,l,a) in
   {e with pexp_desc=Pexp_function(params,constraint_,body)}
  | _ -> m.expr m e
 in
 try
  let phrases=Parse.use_file lexbuf in
  List.iter(fun phrase->match phrase with
   | Ptop_dir _ -> failwith "Toplevel directives are not supported by the recorder."
   | Ptop_def structure ->
    let typed,_,_,_,_=Typemod.type_toplevel_phrase !Toploop.toplevel_env structure in
    let it={Tast_iterator.default_iterator with expr=(fun self e->Hashtbl.replace shapes(key e.Typedtree.exp_loc)(shape_of_type 0 e.exp_type);Tast_iterator.default_iterator.expr self e);pat=(fun (type k) self (p:k Typedtree.general_pattern)->Hashtbl.replace pattern_shapes(key p.pat_loc)(shape_of_type 0 p.pat_type);Tast_iterator.default_iterator.pat self p)} in
    it.structure it typed;
    let visible_env=ref (List.map(fun(n,t,_)->n,t)!globals) in
    let mapped=List.concat_map(fun item->match item.pstr_desc with
     | Pstr_value(recursive,vs) ->
      let env = !visible_env in
      let added=List.concat_map(fun v->bindings v.pvb_pat)vs in
      visible_env := merge env added;
      let mapped={item with pstr_desc=Pstr_value(recursive,List.map(fun v->{v with pvb_expr=map_value (if recursive=Recursive then merge env added else env) v.pvb_pat v.pvb_expr})vs)} in
      mapped :: List.map(fun(n,t)->Str.eval(apply "Tp_trace.add_global" [literal n;shape_expr t;thunk(apply "Obj.repr" [identifier n])]))added
     | Pstr_eval(e,a)->let m=mapper !visible_env in [{item with pstr_desc=Pstr_eval(m.expr m e,a)}]
     | Pstr_type _ | Pstr_exception _ -> [item]
     | _ -> failwith "Modules, classes and external declarations are outside OCaml tracing.")structure in
    if not(Toploop.execute_phrase false formatter (Ptop_def mapped)) then failwith (Format.flush_str_formatter());
    let loc=(List.hd(List.rev structure)).pstr_loc in
    snapshot "step_line" loc.loc_start.pos_cnum loc.loc_end.pos_cnum loc.loc_start.pos_lnum [] None None
  )phrases;
  ignore(call_js "tpOcamlTraceDone" [||])
 with
 | Limit -> ignore(call_js "tpOcamlTraceError" [|str "Instruction limit reached (1000 events)."|])
 | e when !events >= 1000 -> ignore(call_js "tpOcamlTraceError" [|str "Instruction limit reached (1000 events)."|])
 | e -> (try Location.report_exception formatter e with _ -> Format.fprintf formatter "%s" (Printexc.to_string e));ignore(call_js "tpOcamlTraceError" [|str(Format.flush_str_formatter())|])
let () = Js.export "tpOcamlTrace" (Js.wrap_callback(fun source -> record(Js.to_string source)))
