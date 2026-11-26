open Js_of_ocaml

let write text =
  ignore (Js.Unsafe.fun_call (Js.Unsafe.get Js.Unsafe.global "tpOcamlWrite")
    [|Js.Unsafe.inject (Js.string text)|])

let execute (source : Js.js_string Js.t) (print : bool Js.t) =
  let buffer = Buffer.create 256 in
  let formatter = Format.formatter_of_buffer buffer in
  let ok = Js_of_ocaml_toplevel.Direct.use ~print_outcome:(Js.to_bool print) formatter (Js.to_string source) in
  Format.pp_print_flush formatter ();
  Js.Unsafe.obj [|
    "ok", Js.Unsafe.inject (Js.bool ok);
    "output", Js.Unsafe.inject (Js.string (Buffer.contents buffer))
  |]

let file (name : Js.js_string Js.t) (content : Js.js_string Js.t) =
  let name = Js.to_string name and content = Js.to_string content in
  if Sys.file_exists name then Sys_js.update_file ~name ~content
  else Sys_js.create_file ~name ~content

let () =
  Sys_js.set_channel_flusher stdout write;
  Sys_js.set_channel_flusher stderr write;
  Js_of_ocaml_toplevel.Direct.initialize ();
  Sys.chdir "/";
  Topdirs.dir_directory "/";
  Js.export "tpOcaml" (Js.Unsafe.obj [|
    "version", Js.Unsafe.inject (Js.string Sys.ocaml_version);
    "compilerVersion", Js.Unsafe.inject (Js.string Sys_js.js_of_ocaml_version);
    "execute", Js.Unsafe.inject (Js.wrap_callback execute);
    "file", Js.Unsafe.inject (Js.wrap_callback file)
  |])
