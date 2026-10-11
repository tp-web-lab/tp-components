import { o as e, r as t, t as n } from "./rolldown-runtime.js";
import { t as r } from "./base.js";
//#region ../node_modules/.pnpm/jstat@1.9.6/node_modules/jstat/dist/jstat.js
var i = /* @__PURE__ */ n(((e, t) => {
	(function(n, r) {
		typeof e == "object" ? t.exports = r() : typeof define == "function" && define.amd ? define(r) : n.jStat = r();
	})(e, function() {
		var e = function(e, t) {
			var n = Array.prototype.concat, r = Array.prototype.slice, i = Object.prototype.toString;
			function a(t, n) {
				var r = t > n ? t : n;
				return e.pow(10, 17 - ~~(e.log(r > 0 ? r : -r) * e.LOG10E));
			}
			var o = Array.isArray || function(e) {
				return i.call(e) === "[object Array]";
			};
			function s(e) {
				return i.call(e) === "[object Function]";
			}
			function c(e) {
				return typeof e == "number" && e - e === 0;
			}
			function l(e) {
				return n.apply([], e);
			}
			function u() {
				return new u._init(arguments);
			}
			u.fn = u.prototype, u._init = function(e) {
				if (o(e[0])) if (o(e[0][0])) {
					s(e[1]) && (e[0] = u.map(e[0], e[1]));
					for (var t = 0; t < e[0].length; t++) this[t] = e[0][t];
					this.length = e[0].length;
				} else this[0] = s(e[1]) ? u.map(e[0], e[1]) : e[0], this.length = 1;
				else if (c(e[0])) this[0] = u.seq.apply(null, e), this.length = 1;
				else if (e[0] instanceof u) return u(e[0].toArray());
				else this[0] = [], this.length = 1;
				return this;
			}, u._init.prototype = u.prototype, u._init.constructor = u, u.utils = {
				calcRdx: a,
				isArray: o,
				isFunction: s,
				isNumber: c,
				toVector: l
			}, u._random_fn = e.random, u.setRandom = function(e) {
				if (typeof e != "function") throw TypeError("fn is not a function");
				u._random_fn = e;
			}, u.extend = function(e) {
				var t, n;
				if (arguments.length === 1) {
					for (n in e) u[n] = e[n];
					return this;
				}
				for (t = 1; t < arguments.length; t++) for (n in arguments[t]) e[n] = arguments[t][n];
				return e;
			}, u.rows = function(e) {
				return e.length || 1;
			}, u.cols = function(e) {
				return e[0].length || 1;
			}, u.dimensions = function(e) {
				return {
					rows: u.rows(e),
					cols: u.cols(e)
				};
			}, u.row = function(e, t) {
				return o(t) ? t.map(function(t) {
					return u.row(e, t);
				}) : e[t];
			}, u.rowa = function(e, t) {
				return u.row(e, t);
			}, u.col = function(e, t) {
				if (o(t)) {
					var n = u.arange(e.length).map(function() {
						return Array(t.length);
					});
					return t.forEach(function(t, r) {
						u.arange(e.length).forEach(function(i) {
							n[i][r] = e[i][t];
						});
					}), n;
				}
				for (var r = Array(e.length), i = 0; i < e.length; i++) r[i] = [e[i][t]];
				return r;
			}, u.cola = function(e, t) {
				return u.col(e, t).map(function(e) {
					return e[0];
				});
			}, u.diag = function(e) {
				for (var t = u.rows(e), n = Array(t), r = 0; r < t; r++) n[r] = [e[r][r]];
				return n;
			}, u.antidiag = function(e) {
				for (var t = u.rows(e) - 1, n = Array(t), r = 0; t >= 0; t--, r++) n[r] = [e[r][t]];
				return n;
			}, u.transpose = function(e) {
				var t = [], n, r, i, a, s;
				for (o(e[0]) || (e = [e]), r = e.length, i = e[0].length, s = 0; s < i; s++) {
					for (n = Array(r), a = 0; a < r; a++) n[a] = e[a][s];
					t.push(n);
				}
				return t.length === 1 ? t[0] : t;
			}, u.map = function(e, t, n) {
				var r, i, a, s, c;
				for (o(e[0]) || (e = [e]), i = e.length, a = e[0].length, s = n ? e : Array(i), r = 0; r < i; r++) for (s[r] || (s[r] = Array(a)), c = 0; c < a; c++) s[r][c] = t(e[r][c], r, c);
				return s.length === 1 ? s[0] : s;
			}, u.cumreduce = function(e, t, n) {
				var r, i, a, s, c;
				for (o(e[0]) || (e = [e]), i = e.length, a = e[0].length, s = n ? e : Array(i), r = 0; r < i; r++) for (s[r] || (s[r] = Array(a)), a > 0 && (s[r][0] = e[r][0]), c = 1; c < a; c++) s[r][c] = t(s[r][c - 1], e[r][c]);
				return s.length === 1 ? s[0] : s;
			}, u.alter = function(e, t) {
				return u.map(e, t, !0);
			}, u.create = function(e, t, n) {
				var r = Array(e), i, a;
				for (s(t) && (n = t, t = e), i = 0; i < e; i++) for (r[i] = Array(t), a = 0; a < t; a++) r[i][a] = n(i, a);
				return r;
			};
			function d() {
				return 0;
			}
			u.zeros = function(e, t) {
				return c(t) || (t = e), u.create(e, t, d);
			};
			function f() {
				return 1;
			}
			u.ones = function(e, t) {
				return c(t) || (t = e), u.create(e, t, f);
			}, u.rand = function(e, t) {
				return c(t) || (t = e), u.create(e, t, u._random_fn);
			};
			function p(e, t) {
				return +(e === t);
			}
			u.identity = function(e, t) {
				return c(t) || (t = e), u.create(e, t, p);
			}, u.symmetric = function(e) {
				var t = e.length, n, r;
				if (e.length !== e[0].length) return !1;
				for (n = 0; n < t; n++) for (r = 0; r < t; r++) if (e[r][n] !== e[n][r]) return !1;
				return !0;
			}, u.clear = function(e) {
				return u.alter(e, d);
			}, u.seq = function(e, t, n, r) {
				s(r) || (r = !1);
				var i = [], o = a(e, t), c = (t * o - e * o) / ((n - 1) * o), l = e, u;
				for (u = 0; l <= t && u < n; u++, l = (e * o + c * o * u) / o) i.push(r ? r(l, u) : l);
				return i;
			}, u.arange = function(e, n, r) {
				var i = [], a;
				if (r ||= 1, n === t && (n = e, e = 0), e === n || r === 0 || e < n && r < 0 || e > n && r > 0) return [];
				if (r > 0) for (a = e; a < n; a += r) i.push(a);
				else for (a = e; a > n; a += r) i.push(a);
				return i;
			}, u.slice = function() {
				function e(e, n, r, i) {
					var a, o = [], s = e.length;
					if (n === t && r === t && i === t) return u.copy(e);
					if (n ||= 0, r ||= e.length, n = n >= 0 ? n : s + n, r = r >= 0 ? r : s + r, i ||= 1, n === r || i === 0 || n < r && i < 0 || n > r && i > 0) return [];
					if (i > 0) for (a = n; a < r; a += i) o.push(e[a]);
					else for (a = n; a > r; a += i) o.push(e[a]);
					return o;
				}
				function n(t, n) {
					var r, i;
					if (n ||= {}, c(n.row)) {
						if (c(n.col)) return t[n.row][n.col];
						var a = u.rowa(t, n.row);
						return r = n.col || {}, e(a, r.start, r.end, r.step);
					}
					if (c(n.col)) {
						var o = u.cola(t, n.col);
						return i = n.row || {}, e(o, i.start, i.end, i.step);
					}
					return i = n.row || {}, r = n.col || {}, e(t, i.start, i.end, i.step).map(function(t) {
						return e(t, r.start, r.end, r.step);
					});
				}
				return n;
			}(), u.sliceAssign = function(n, r, i) {
				var a, o;
				if (c(r.row)) {
					if (c(r.col)) return n[r.row][r.col] = i;
					r.col = r.col || {}, r.col.start = r.col.start || 0, r.col.end = r.col.end || n[0].length, r.col.step = r.col.step || 1, a = u.arange(r.col.start, e.min(n.length, r.col.end), r.col.step);
					var s = r.row;
					return a.forEach(function(e, t) {
						n[s][e] = i[t];
					}), n;
				}
				if (c(r.col)) {
					r.row = r.row || {}, r.row.start = r.row.start || 0, r.row.end = r.row.end || n.length, r.row.step = r.row.step || 1, o = u.arange(r.row.start, e.min(n[0].length, r.row.end), r.row.step);
					var l = r.col;
					return o.forEach(function(e, t) {
						n[e][l] = i[t];
					}), n;
				}
				return i[0].length === t && (i = [i]), r.row.start = r.row.start || 0, r.row.end = r.row.end || n.length, r.row.step = r.row.step || 1, r.col.start = r.col.start || 0, r.col.end = r.col.end || n[0].length, r.col.step = r.col.step || 1, o = u.arange(r.row.start, e.min(n.length, r.row.end), r.row.step), a = u.arange(r.col.start, e.min(n[0].length, r.col.end), r.col.step), o.forEach(function(e, t) {
					a.forEach(function(r, a) {
						n[e][r] = i[t][a];
					});
				}), n;
			}, u.diagonal = function(e) {
				var t = u.zeros(e.length, e.length);
				return e.forEach(function(e, n) {
					t[n][n] = e;
				}), t;
			}, u.copy = function(e) {
				return e.map(function(e) {
					return c(e) ? e : e.map(function(e) {
						return e;
					});
				});
			};
			var m = u.prototype;
			return m.length = 0, m.push = Array.prototype.push, m.sort = Array.prototype.sort, m.splice = Array.prototype.splice, m.slice = Array.prototype.slice, m.toArray = function() {
				return this.length > 1 ? r.call(this) : r.call(this)[0];
			}, m.map = function(e, t) {
				return u(u.map(this, e, t));
			}, m.cumreduce = function(e, t) {
				return u(u.cumreduce(this, e, t));
			}, m.alter = function(e) {
				return u.alter(this, e), this;
			}, (function(e) {
				for (var t = 0; t < e.length; t++) (function(e) {
					m[e] = function(t) {
						var n = this, r;
						return t ? (setTimeout(function() {
							t.call(n, m[e].call(n));
						}), this) : (r = u[e](this), o(r) ? u(r) : r);
					};
				})(e[t]);
			})("transpose clear symmetric rows cols dimensions diag antidiag".split(" ")), (function(e) {
				for (var t = 0; t < e.length; t++) (function(e) {
					m[e] = function(t, n) {
						var r = this;
						return n ? (setTimeout(function() {
							n.call(r, m[e].call(r, t));
						}), this) : u(u[e](this, t));
					};
				})(e[t]);
			})("row col".split(" ")), (function(e) {
				for (var t = 0; t < e.length; t++) (function(e) {
					m[e] = function() {
						return u(u[e].apply(null, arguments));
					};
				})(e[t]);
			})("create zeros ones rand identity".split(" ")), u;
		}(Math);
		return (function(e, t) {
			var n = e.utils.isFunction;
			function r(e, t) {
				return e - t;
			}
			function i(e, n, r) {
				return t.max(n, t.min(e, r));
			}
			e.sum = function(e) {
				for (var t = 0, n = e.length; --n >= 0;) t += e[n];
				return t;
			}, e.sumsqrd = function(e) {
				for (var t = 0, n = e.length; --n >= 0;) t += e[n] * e[n];
				return t;
			}, e.sumsqerr = function(t) {
				for (var n = e.mean(t), r = 0, i = t.length, a; --i >= 0;) a = t[i] - n, r += a * a;
				return r;
			}, e.sumrow = function(e) {
				for (var t = 0, n = e.length; --n >= 0;) t += e[n];
				return t;
			}, e.product = function(e) {
				for (var t = 1, n = e.length; --n >= 0;) t *= e[n];
				return t;
			}, e.min = function(e) {
				for (var t = e[0], n = 0; ++n < e.length;) e[n] < t && (t = e[n]);
				return t;
			}, e.max = function(e) {
				for (var t = e[0], n = 0; ++n < e.length;) e[n] > t && (t = e[n]);
				return t;
			}, e.unique = function(e) {
				for (var t = {}, n = [], r = 0; r < e.length; r++) t[e[r]] || (t[e[r]] = !0, n.push(e[r]));
				return n;
			}, e.mean = function(t) {
				return e.sum(t) / t.length;
			}, e.meansqerr = function(t) {
				return e.sumsqerr(t) / t.length;
			}, e.geomean = function(n) {
				var r = n.map(t.log), i = e.mean(r);
				return t.exp(i);
			}, e.median = function(e) {
				var t = e.length, n = e.slice().sort(r);
				return t & 1 ? n[t / 2 | 0] : (n[t / 2 - 1] + n[t / 2]) / 2;
			}, e.cumsum = function(t) {
				return e.cumreduce(t, function(e, t) {
					return e + t;
				});
			}, e.cumprod = function(t) {
				return e.cumreduce(t, function(e, t) {
					return e * t;
				});
			}, e.diff = function(e) {
				var t = [], n = e.length, r;
				for (r = 1; r < n; r++) t.push(e[r] - e[r - 1]);
				return t;
			}, e.rank = function(e) {
				var t, n = [], i = {};
				for (t = 0; t < e.length; t++) {
					var a = e[t];
					i[a] ? i[a]++ : (i[a] = 1, n.push(a));
				}
				var o = n.sort(r), s = {}, c = 1;
				for (t = 0; t < o.length; t++) {
					var a = o[t], l = i[a];
					s[a] = (c + (c + l - 1)) / 2, c += l;
				}
				return e.map(function(e) {
					return s[e];
				});
			}, e.mode = function(e) {
				var t = e.length, n = e.slice().sort(r), i = 1, a = 0, o = 0, s = [], c;
				for (c = 0; c < t; c++) n[c] === n[c + 1] ? i++ : (i > a ? (s = [n[c]], a = i, o = 0) : i === a && (s.push(n[c]), o++), i = 1);
				return o === 0 ? s[0] : s;
			}, e.range = function(t) {
				return e.max(t) - e.min(t);
			}, e.variance = function(t, n) {
				return e.sumsqerr(t) / (t.length - +!!n);
			}, e.pooledvariance = function(t) {
				return t.reduce(function(t, n) {
					return t + e.sumsqerr(n);
				}, 0) / (t.reduce(function(e, t) {
					return e + t.length;
				}, 0) - t.length);
			}, e.deviation = function(t) {
				for (var n = e.mean(t), r = t.length, i = Array(r), a = 0; a < r; a++) i[a] = t[a] - n;
				return i;
			}, e.stdev = function(n, r) {
				return t.sqrt(e.variance(n, r));
			}, e.pooledstdev = function(n) {
				return t.sqrt(e.pooledvariance(n));
			}, e.meandev = function(n) {
				for (var r = e.mean(n), i = [], a = n.length - 1; a >= 0; a--) i.push(t.abs(n[a] - r));
				return e.mean(i);
			}, e.meddev = function(n) {
				for (var r = e.median(n), i = [], a = n.length - 1; a >= 0; a--) i.push(t.abs(n[a] - r));
				return e.median(i);
			}, e.coeffvar = function(t) {
				return e.stdev(t) / e.mean(t);
			}, e.quartiles = function(e) {
				var n = e.length, i = e.slice().sort(r);
				return [
					i[t.round(n / 4) - 1],
					i[t.round(n / 2) - 1],
					i[t.round(n * 3 / 4) - 1]
				];
			}, e.quantiles = function(e, n, a, o) {
				var s = e.slice().sort(r), c = [n.length], l = e.length, u, d, f, p, m, h;
				for (a === void 0 && (a = 3 / 8), o === void 0 && (o = 3 / 8), u = 0; u < n.length; u++) d = n[u], f = a + d * (1 - a - o), p = l * d + f, m = t.floor(i(p, 1, l - 1)), h = i(p - m, 0, 1), c[u] = (1 - h) * s[m - 1] + h * s[m];
				return c;
			}, e.percentile = function(e, t, n) {
				var i = e.slice().sort(r), a = t * (i.length + (n ? 1 : -1)) + +!n, o = parseInt(a), s = a - o;
				return o + 1 < i.length ? i[o - 1] + s * (i[o] - i[o - 1]) : i[o - 1];
			}, e.percentileOfScore = function(e, t, n) {
				var r = 0, i = e.length, a = !1, o, s;
				for (n === "strict" && (a = !0), s = 0; s < i; s++) o = e[s], (a && o < t || !a && o <= t) && r++;
				return r / i;
			}, e.histogram = function(n, r) {
				r ||= 4;
				var i = e.min(n), a = (e.max(n) - i) / r, o = n.length, s = [], c;
				for (c = 0; c < r; c++) s[c] = 0;
				for (c = 0; c < o; c++) s[t.min(t.floor((n[c] - i) / a), r - 1)] += 1;
				return s;
			}, e.covariance = function(t, n) {
				var r = e.mean(t), i = e.mean(n), a = t.length, o = Array(a), s;
				for (s = 0; s < a; s++) o[s] = (t[s] - r) * (n[s] - i);
				return e.sum(o) / (a - 1);
			}, e.corrcoeff = function(t, n) {
				return e.covariance(t, n) / e.stdev(t, 1) / e.stdev(n, 1);
			}, e.spearmancoeff = function(t, n) {
				return t = e.rank(t), n = e.rank(n), e.corrcoeff(t, n);
			}, e.stanMoment = function(n, r) {
				for (var i = e.mean(n), a = e.stdev(n), o = n.length, s = 0, c = 0; c < o; c++) s += t.pow((n[c] - i) / a, r);
				return s / n.length;
			}, e.skewness = function(t) {
				return e.stanMoment(t, 3);
			}, e.kurtosis = function(t) {
				return e.stanMoment(t, 4) - 3;
			};
			var a = e.prototype;
			(function(t) {
				for (var r = 0; r < t.length; r++) (function(t) {
					a[t] = function(r, i) {
						var o = [], s = 0, c = this;
						if (n(r) && (i = r, r = !1), i) return setTimeout(function() {
							i.call(c, a[t].call(c, r));
						}), this;
						if (this.length > 1) {
							for (c = r === !0 ? this : this.transpose(); s < c.length; s++) o[s] = e[t](c[s]);
							return o;
						}
						return e[t](this[0], r);
					};
				})(t[r]);
			})("cumsum cumprod".split(" ")), (function(t) {
				for (var r = 0; r < t.length; r++) (function(t) {
					a[t] = function(r, i) {
						var o = [], s = 0, c = this;
						if (n(r) && (i = r, r = !1), i) return setTimeout(function() {
							i.call(c, a[t].call(c, r));
						}), this;
						if (this.length > 1) {
							for (t !== "sumrow" && (c = r === !0 ? this : this.transpose()); s < c.length; s++) o[s] = e[t](c[s]);
							return r === !0 ? e[t](e.utils.toVector(o)) : o;
						}
						return e[t](this[0], r);
					};
				})(t[r]);
			})("sum sumsqrd sumsqerr sumrow product min max unique mean meansqerr geomean median diff rank mode range variance deviation stdev meandev meddev coeffvar quartiles histogram skewness kurtosis".split(" ")), (function(t) {
				for (var r = 0; r < t.length; r++) (function(t) {
					a[t] = function() {
						var r = [], i = 0, o = this, s = Array.prototype.slice.call(arguments), c;
						if (n(s[s.length - 1])) {
							c = s[s.length - 1];
							var l = s.slice(0, s.length - 1);
							return setTimeout(function() {
								c.call(o, a[t].apply(o, l));
							}), this;
						} else {
							c = void 0;
							var u = function(n) {
								return e[t].apply(o, [n].concat(s));
							};
						}
						if (this.length > 1) {
							for (o = o.transpose(); i < o.length; i++) r[i] = u(o[i]);
							return r;
						}
						return u(this[0]);
					};
				})(t[r]);
			})("quantiles percentileOfScore".split(" "));
		})(e, Math), (function(e, t) {
			e.gammaln = function(e) {
				var n = 0, r = [
					76.18009172947146,
					-86.50532032941678,
					24.01409824083091,
					-1.231739572450155,
					.001208650973866179,
					-5395239384953e-18
				], i = 1.000000000190015, a, o, s = (o = a = e) + 5.5;
				for (s -= (a + .5) * t.log(s); n < 6; n++) i += r[n] / ++o;
				return t.log(2.5066282746310007 * i / a) - s;
			}, e.loggam = function(e) {
				var n, r, i, a, o, s, c, l = [
					.08333333333333333,
					-.002777777777777778,
					.0007936507936507937,
					-.0005952380952380952,
					.0008417508417508418,
					-.001917526917526918,
					.00641025641025641,
					-.02955065359477124,
					.1796443723688307,
					-1.3924322169059
				];
				if (n = e, c = 0, e == 1 || e == 2) return 0;
				for (e <= 7 && (c = t.floor(7 - e), n = e + c), r = 1 / (n * n), i = 2 * t.PI, o = l[9], s = 8; s >= 0; s--) o *= r, o += l[s];
				if (a = o / n + .5 * t.log(i) + (n - .5) * t.log(n) - n, e <= 7) for (s = 1; s <= c; s++) a -= t.log(n - 1), --n;
				return a;
			}, e.gammafn = function(e) {
				var n = [
					-1.716185138865495,
					24.76565080557592,
					-379.80425647094563,
					629.3311553128184,
					866.9662027904133,
					-31451.272968848367,
					-36144.413418691176,
					66456.14382024054
				], r = [
					-30.8402300119739,
					315.35062697960416,
					-1015.1563674902192,
					-3107.771671572311,
					22538.11842098015,
					4755.846277527881,
					-134659.9598649693,
					-115132.2596755535
				], i = !1, a = 0, o = 0, s = 0, c = e, l, u, d, f;
				if (e > 171.6243769536076) return Infinity;
				if (c <= 0) if (f = c % 1 + 36e-17, f) i = (c & 1 ? -1 : 1) * t.PI / t.sin(t.PI * f), c = 1 - c;
				else return Infinity;
				for (d = c, u = c < 1 ? c++ : (c -= a = (c | 0) - 1) - 1, l = 0; l < 8; ++l) s = (s + n[l]) * u, o = o * u + r[l];
				if (f = s / o + 1, d < c) f /= d;
				else if (d > c) for (l = 0; l < a; ++l) f *= c, c++;
				return i && (f = i / f), f;
			}, e.gammap = function(t, n) {
				return e.lowRegGamma(t, n) * e.gammafn(t);
			}, e.lowRegGamma = function(n, r) {
				var i = e.gammaln(n), a = n, o = 1 / n, s = o, c = r + 1 - n, l = 1 / 1e-30, u = 1 / c, d = u, f = 1, p = -~(t.log(n >= 1 ? n : 1 / n) * 8.5 + n * .4 + 17), m;
				if (r < 0 || n <= 0) return NaN;
				if (r < n + 1) {
					for (; f <= p; f++) o += s *= r / ++a;
					return o * t.exp(-r + n * t.log(r) - i);
				}
				for (; f <= p; f++) m = -f * (f - n), c += 2, u = m * u + c, l = c + m / l, u = 1 / u, d *= u * l;
				return 1 - d * t.exp(-r + n * t.log(r) - i);
			}, e.factorialln = function(t) {
				return t < 0 ? NaN : e.gammaln(t + 1);
			}, e.factorial = function(t) {
				return t < 0 ? NaN : e.gammafn(t + 1);
			}, e.combination = function(n, r) {
				return n > 170 || r > 170 ? t.exp(e.combinationln(n, r)) : e.factorial(n) / e.factorial(r) / e.factorial(n - r);
			}, e.combinationln = function(t, n) {
				return e.factorialln(t) - e.factorialln(n) - e.factorialln(t - n);
			}, e.permutation = function(t, n) {
				return e.factorial(t) / e.factorial(t - n);
			}, e.betafn = function(n, r) {
				if (!(n <= 0 || r <= 0)) return n + r > 170 ? t.exp(e.betaln(n, r)) : e.gammafn(n) * e.gammafn(r) / e.gammafn(n + r);
			}, e.betaln = function(t, n) {
				return e.gammaln(t) + e.gammaln(n) - e.gammaln(t + n);
			}, e.betacf = function(e, n, r) {
				var i = 1e-30, a = 1, o = n + r, s = n + 1, c = n - 1, l = 1, u = 1 - o * e / s, d, f, p, m;
				for (t.abs(u) < i && (u = i), u = 1 / u, m = u; a <= 100 && (d = 2 * a, f = a * (r - a) * e / ((c + d) * (n + d)), u = 1 + f * u, t.abs(u) < i && (u = i), l = 1 + f / l, t.abs(l) < i && (l = i), u = 1 / u, m *= u * l, f = -(n + a) * (o + a) * e / ((n + d) * (s + d)), u = 1 + f * u, t.abs(u) < i && (u = i), l = 1 + f / l, t.abs(l) < i && (l = i), u = 1 / u, p = u * l, m *= p, !(t.abs(p - 1) < 3e-7)); a++);
				return m;
			}, e.gammapinv = function(n, r) {
				var i = 0, a = r - 1, o = 1e-8, s = e.gammaln(r), c, l, u, d, f, p, m;
				if (n >= 1) return t.max(100, r + 100 * t.sqrt(r));
				if (n <= 0) return 0;
				for (r > 1 ? (p = t.log(a), m = t.exp(a * (p - 1) - s), f = n < .5 ? n : 1 - n, u = t.sqrt(-2 * t.log(f)), c = (2.30753 + u * .27061) / (1 + u * (.99229 + u * .04481)) - u, n < .5 && (c = -c), c = t.max(.001, r * t.pow(1 - 1 / (9 * r) - c / (3 * t.sqrt(r)), 3))) : (u = 1 - r * (.253 + r * .12), c = n < u ? t.pow(n / u, 1 / r) : 1 - t.log(1 - (n - u) / (1 - u))); i < 12; i++) {
					if (c <= 0) return 0;
					if (l = e.lowRegGamma(r, c) - n, u = r > 1 ? m * t.exp(-(c - a) + a * (t.log(c) - p)) : t.exp(-c + a * t.log(c) - s), d = l / u, c -= u = d / (1 - .5 * t.min(1, d * ((r - 1) / c - 1))), c <= 0 && (c = .5 * (c + u)), t.abs(u) < o * c) break;
				}
				return c;
			}, e.erf = function(e) {
				var n = [
					-1.3026537197817094,
					.6419697923564902,
					.019476473204185836,
					-.00956151478680863,
					-.000946595344482036,
					.000366839497852761,
					42523324806907e-18,
					-20278578112534e-18,
					-1624290004647e-18,
					130365583558e-17,
					1.5626441722e-8,
					-8.5238095915e-8,
					6.529054439e-9,
					5.059343495e-9,
					-991364156e-18,
					-227365122e-18,
					96467911e-18,
					2394038e-18,
					-6886027e-18,
					894487e-18,
					313092e-18,
					-112708e-18,
					381e-18,
					7106e-18,
					-1523e-18,
					-94e-18,
					121e-18,
					-28e-18
				], r = n.length - 1, i = !1, a = 0, o = 0, s, c, l, u;
				for (e < 0 && (e = -e, i = !0), s = 2 / (2 + e), c = 4 * s - 2; r > 0; r--) l = a, a = c * a - o + n[r], o = l;
				return u = s * t.exp(-e * e + .5 * (n[0] + c * a) - o), i ? u - 1 : 1 - u;
			}, e.erfc = function(t) {
				return 1 - e.erf(t);
			}, e.erfcinv = function(n) {
				var r = 0, i, a, o, s;
				if (n >= 2) return -100;
				if (n <= 0) return 100;
				for (s = n < 1 ? n : 2 - n, o = t.sqrt(-2 * t.log(s / 2)), i = -.70711 * ((2.30753 + o * .27061) / (1 + o * (.99229 + o * .04481)) - o); r < 2; r++) a = e.erfc(i) - s, i += a / (1.1283791670955126 * t.exp(-i * i) - i * a);
				return n < 1 ? i : -i;
			}, e.ibetainv = function(n, r, i) {
				var a = 1e-8, o = r - 1, s = i - 1, c = 0, l, u, d, f, p, m, h, g, _, v, y;
				if (n <= 0) return 0;
				if (n >= 1) return 1;
				for (r >= 1 && i >= 1 ? (d = n < .5 ? n : 1 - n, f = t.sqrt(-2 * t.log(d)), h = (2.30753 + f * .27061) / (1 + f * (.99229 + f * .04481)) - f, n < .5 && (h = -h), g = (h * h - 3) / 6, _ = 2 / (1 / (2 * r - 1) + 1 / (2 * i - 1)), v = h * t.sqrt(g + _) / _ - (1 / (2 * i - 1) - 1 / (2 * r - 1)) * (g + 5 / 6 - 2 / (3 * _)), h = r / (r + i * t.exp(2 * v))) : (l = t.log(r / (r + i)), u = t.log(i / (r + i)), f = t.exp(r * l) / r, p = t.exp(i * u) / i, v = f + p, h = n < f / v ? t.pow(r * v * n, 1 / r) : 1 - t.pow(i * v * (1 - n), 1 / i)), y = -e.gammaln(r) - e.gammaln(i) + e.gammaln(r + i); c < 10; c++) {
					if (h === 0 || h === 1) return h;
					if (m = e.ibeta(h, r, i) - n, f = t.exp(o * t.log(h) + s * t.log(1 - h) + y), p = m / f, h -= f = p / (1 - .5 * t.min(1, p * (o / h - s / (1 - h)))), h <= 0 && (h = .5 * (h + f)), h >= 1 && (h = .5 * (h + f + 1)), t.abs(f) < a * h && c > 0) break;
				}
				return h;
			}, e.ibeta = function(n, r, i) {
				var a = n === 0 || n === 1 ? 0 : t.exp(e.gammaln(r + i) - e.gammaln(r) - e.gammaln(i) + r * t.log(n) + i * t.log(1 - n));
				return n < 0 || n > 1 ? !1 : n < (r + 1) / (r + i + 2) ? a * e.betacf(n, r, i) / r : 1 - a * e.betacf(1 - n, i, r) / i;
			}, e.randn = function(n, r) {
				var i, a, o, s, c;
				if (r ||= n, n) return e.create(n, r, function() {
					return e.randn();
				});
				do
					i = e._random_fn(), a = 1.7156 * (e._random_fn() - .5), o = i - .449871, s = t.abs(a) + .386595, c = o * o + s * (.196 * s - .25472 * o);
				while (c > .27597 && (c > .27846 || a * a > -4 * t.log(i) * i * i));
				return a / i;
			}, e.randg = function(n, r, i) {
				var a = n, o, s, c, l, u, d;
				if (i ||= r, n ||= 1, r) return d = e.zeros(r, i), d.alter(function() {
					return e.randg(n);
				}), d;
				n < 1 && (n += 1), o = n - 1 / 3, s = 1 / t.sqrt(9 * o);
				do {
					do
						u = e.randn(), l = 1 + s * u;
					while (l <= 0);
					l = l * l * l, c = e._random_fn();
				} while (c > 1 - .331 * t.pow(u, 4) && t.log(c) > .5 * u * u + o * (1 - l + t.log(l)));
				if (n == a) return o * l;
				do
					c = e._random_fn();
				while (c === 0);
				return t.pow(c, 1 / a) * o * l;
			}, (function(t) {
				for (var n = 0; n < t.length; n++) (function(t) {
					e.fn[t] = function() {
						return e(e.map(this, function(n) {
							return e[t](n);
						}));
					};
				})(t[n]);
			})("gammaln gammafn factorial factorialln".split(" ")), (function(t) {
				for (var n = 0; n < t.length; n++) (function(t) {
					e.fn[t] = function() {
						return e(e[t].apply(null, arguments));
					};
				})(t[n]);
			})("randn".split(" "));
		})(e, Math), (function(e, t) {
			(function(t) {
				for (var n = 0; n < t.length; n++) (function(t) {
					e[t] = function e(t, n, r) {
						return this instanceof e ? (this._a = t, this._b = n, this._c = r, this) : new e(t, n, r);
					}, e.fn[t] = function(n, r, i) {
						var a = e[t](n, r, i);
						return a.data = this, a;
					}, e[t].prototype.sample = function(n) {
						var r = this._a, i = this._b, a = this._c;
						return n ? e.alter(n, function() {
							return e[t].sample(r, i, a);
						}) : e[t].sample(r, i, a);
					}, (function(n) {
						for (var r = 0; r < n.length; r++) (function(n) {
							e[t].prototype[n] = function(r) {
								var i = this._a, a = this._b, o = this._c;
								return !r && r !== 0 && (r = this.data), typeof r == "number" ? e[t][n](r, i, a, o) : e.fn.map.call(r, function(r) {
									return e[t][n](r, i, a, o);
								});
							};
						})(n[r]);
					})("pdf cdf inv".split(" ")), (function(n) {
						for (var r = 0; r < n.length; r++) (function(n) {
							e[t].prototype[n] = function() {
								return e[t][n](this._a, this._b, this._c);
							};
						})(n[r]);
					})("mean median mode variance".split(" "));
				})(t[n]);
			})("beta centralF cauchy chisquare exponential gamma invgamma kumaraswamy laplace lognormal noncentralt normal pareto studentt weibull uniform binomial negbin hypgeom poisson triangular tukey arcsine".split(" ")), e.extend(e.beta, {
				pdf: function(n, r, i) {
					return n > 1 || n < 0 ? 0 : r == 1 && i == 1 ? 1 : r < 512 && i < 512 ? t.pow(n, r - 1) * t.pow(1 - n, i - 1) / e.betafn(r, i) : t.exp((r - 1) * t.log(n) + (i - 1) * t.log(1 - n) - e.betaln(r, i));
				},
				cdf: function(t, n, r) {
					return t > 1 || t < 0 ? (t > 1) * 1 : e.ibeta(t, n, r);
				},
				inv: function(t, n, r) {
					return e.ibetainv(t, n, r);
				},
				mean: function(e, t) {
					return e / (e + t);
				},
				median: function(t, n) {
					return e.ibetainv(.5, t, n);
				},
				mode: function(e, t) {
					return (e - 1) / (e + t - 2);
				},
				sample: function(t, n) {
					var r = e.randg(t);
					return r / (r + e.randg(n));
				},
				variance: function(e, n) {
					return e * n / (t.pow(e + n, 2) * (e + n + 1));
				}
			}), e.extend(e.centralF, {
				pdf: function(n, r, i) {
					var a, o, s;
					return n < 0 ? 0 : r <= 2 ? n === 0 && r < 2 ? Infinity : n === 0 && r === 2 ? 1 : 1 / e.betafn(r / 2, i / 2) * t.pow(r / i, r / 2) * t.pow(n, r / 2 - 1) * t.pow(1 + r / i * n, -(r + i) / 2) : (a = r * n / (i + n * r), o = i / (i + n * r), s = r * o / 2, s * e.binomial.pdf((r - 2) / 2, (r + i - 2) / 2, a));
				},
				cdf: function(t, n, r) {
					return t < 0 ? 0 : e.ibeta(n * t / (n * t + r), n / 2, r / 2);
				},
				inv: function(t, n, r) {
					return r / (n * (1 / e.ibetainv(t, n / 2, r / 2) - 1));
				},
				mean: function(e, t) {
					return t > 2 ? t / (t - 2) : void 0;
				},
				mode: function(e, t) {
					return e > 2 ? t * (e - 2) / (e * (t + 2)) : void 0;
				},
				sample: function(t, n) {
					var r = e.randg(t / 2) * 2, i = e.randg(n / 2) * 2;
					return r / t / (i / n);
				},
				variance: function(e, t) {
					if (!(t <= 4)) return 2 * t * t * (e + t - 2) / (e * (t - 2) * (t - 2) * (t - 4));
				}
			}), e.extend(e.cauchy, {
				pdf: function(e, n, r) {
					return r < 0 ? 0 : r / (t.pow(e - n, 2) + t.pow(r, 2)) / t.PI;
				},
				cdf: function(e, n, r) {
					return t.atan((e - n) / r) / t.PI + .5;
				},
				inv: function(e, n, r) {
					return n + r * t.tan(t.PI * (e - .5));
				},
				median: function(e) {
					return e;
				},
				mode: function(e) {
					return e;
				},
				sample: function(n, r) {
					return e.randn() * t.sqrt(1 / (2 * e.randg(.5))) * r + n;
				}
			}), e.extend(e.chisquare, {
				pdf: function(n, r) {
					return n < 0 ? 0 : n === 0 && r === 2 ? .5 : t.exp((r / 2 - 1) * t.log(n) - n / 2 - r / 2 * t.log(2) - e.gammaln(r / 2));
				},
				cdf: function(t, n) {
					return t < 0 ? 0 : e.lowRegGamma(n / 2, t / 2);
				},
				inv: function(t, n) {
					return 2 * e.gammapinv(t, .5 * n);
				},
				mean: function(e) {
					return e;
				},
				median: function(e) {
					return e * t.pow(1 - 2 / (9 * e), 3);
				},
				mode: function(e) {
					return e - 2 > 0 ? e - 2 : 0;
				},
				sample: function(t) {
					return e.randg(t / 2) * 2;
				},
				variance: function(e) {
					return 2 * e;
				}
			}), e.extend(e.exponential, {
				pdf: function(e, n) {
					return e < 0 ? 0 : n * t.exp(-n * e);
				},
				cdf: function(e, n) {
					return e < 0 ? 0 : 1 - t.exp(-n * e);
				},
				inv: function(e, n) {
					return -t.log(1 - e) / n;
				},
				mean: function(e) {
					return 1 / e;
				},
				median: function(e) {
					return 1 / e * t.log(2);
				},
				mode: function() {
					return 0;
				},
				sample: function(n) {
					return -1 / n * t.log(e._random_fn());
				},
				variance: function(e) {
					return t.pow(e, -2);
				}
			}), e.extend(e.gamma, {
				pdf: function(n, r, i) {
					return n < 0 ? 0 : n === 0 && r === 1 ? 1 / i : t.exp((r - 1) * t.log(n) - n / i - e.gammaln(r) - r * t.log(i));
				},
				cdf: function(t, n, r) {
					return t < 0 ? 0 : e.lowRegGamma(n, t / r);
				},
				inv: function(t, n, r) {
					return e.gammapinv(t, n) * r;
				},
				mean: function(e, t) {
					return e * t;
				},
				mode: function(e, t) {
					if (e > 1) return (e - 1) * t;
				},
				sample: function(t, n) {
					return e.randg(t) * n;
				},
				variance: function(e, t) {
					return e * t * t;
				}
			}), e.extend(e.invgamma, {
				pdf: function(n, r, i) {
					return n <= 0 ? 0 : t.exp(-(r + 1) * t.log(n) - i / n - e.gammaln(r) + r * t.log(i));
				},
				cdf: function(t, n, r) {
					return t <= 0 ? 0 : 1 - e.lowRegGamma(n, r / t);
				},
				inv: function(t, n, r) {
					return r / e.gammapinv(1 - t, n);
				},
				mean: function(e, t) {
					return e > 1 ? t / (e - 1) : void 0;
				},
				mode: function(e, t) {
					return t / (e + 1);
				},
				sample: function(t, n) {
					return n / e.randg(t);
				},
				variance: function(e, t) {
					if (!(e <= 2)) return t * t / ((e - 1) * (e - 1) * (e - 2));
				}
			}), e.extend(e.kumaraswamy, {
				pdf: function(e, n, r) {
					return e === 0 && n === 1 ? r : e === 1 && r === 1 ? n : t.exp(t.log(n) + t.log(r) + (n - 1) * t.log(e) + (r - 1) * t.log(1 - t.pow(e, n)));
				},
				cdf: function(e, n, r) {
					return e < 0 ? 0 : e > 1 ? 1 : 1 - t.pow(1 - t.pow(e, n), r);
				},
				inv: function(e, n, r) {
					return t.pow(1 - t.pow(1 - e, 1 / r), 1 / n);
				},
				mean: function(t, n) {
					return n * e.gammafn(1 + 1 / t) * e.gammafn(n) / e.gammafn(1 + 1 / t + n);
				},
				median: function(e, n) {
					return t.pow(1 - t.pow(2, -1 / n), 1 / e);
				},
				mode: function(e, n) {
					if (e >= 1 && n >= 1 && e !== 1 && n !== 1) return t.pow((e - 1) / (e * n - 1), 1 / e);
				},
				variance: function() {
					throw Error("variance not yet implemented");
				}
			}), e.extend(e.lognormal, {
				pdf: function(e, n, r) {
					return e <= 0 ? 0 : t.exp(-t.log(e) - .5 * t.log(2 * t.PI) - t.log(r) - t.pow(t.log(e) - n, 2) / (2 * r * r));
				},
				cdf: function(n, r, i) {
					return n < 0 ? 0 : .5 + .5 * e.erf((t.log(n) - r) / t.sqrt(2 * i * i));
				},
				inv: function(n, r, i) {
					return t.exp(-1.4142135623730951 * i * e.erfcinv(2 * n) + r);
				},
				mean: function(e, n) {
					return t.exp(e + n * n / 2);
				},
				median: function(e) {
					return t.exp(e);
				},
				mode: function(e, n) {
					return t.exp(e - n * n);
				},
				sample: function(n, r) {
					return t.exp(e.randn() * r + n);
				},
				variance: function(e, n) {
					return (t.exp(n * n) - 1) * t.exp(2 * e + n * n);
				}
			}), e.extend(e.noncentralt, {
				pdf: function(n, r, i) {
					var a = 1e-14;
					return t.abs(i) < a ? e.studentt.pdf(n, r) : t.abs(n) < a ? t.exp(e.gammaln((r + 1) / 2) - i * i / 2 - .5 * t.log(t.PI * r) - e.gammaln(r / 2)) : r / n * (e.noncentralt.cdf(n * t.sqrt(1 + 2 / r), r + 2, i) - e.noncentralt.cdf(n, r, i));
				},
				cdf: function(n, r, i) {
					var a = 1e-14, o = 200;
					if (t.abs(i) < a) return e.studentt.cdf(n, r);
					var s = !1;
					n < 0 && (s = !0, i = -i);
					for (var c = e.normal.cdf(-i, 0, 1), l = a + 1, u = l, d = n * n / (n * n + r), f = 0, p = t.exp(-i * i / 2), m = t.exp(-i * i / 2 - .5 * t.log(2) - e.gammaln(3 / 2)) * i; f < o || u > a || l > a;) u = l, f > 0 && (p *= i * i / (2 * f), m *= i * i / (2 * (f + 1 / 2))), l = p * e.beta.cdf(d, f + .5, r / 2) + m * e.beta.cdf(d, f + 1, r / 2), c += .5 * l, f++;
					return s ? 1 - c : c;
				}
			}), e.extend(e.normal, {
				pdf: function(e, n, r) {
					return t.exp(-.5 * t.log(2 * t.PI) - t.log(r) - t.pow(e - n, 2) / (2 * r * r));
				},
				cdf: function(n, r, i) {
					return .5 * (1 + e.erf((n - r) / t.sqrt(2 * i * i)));
				},
				inv: function(t, n, r) {
					return -1.4142135623730951 * r * e.erfcinv(2 * t) + n;
				},
				mean: function(e) {
					return e;
				},
				median: function(e) {
					return e;
				},
				mode: function(e) {
					return e;
				},
				sample: function(t, n) {
					return e.randn() * n + t;
				},
				variance: function(e, t) {
					return t * t;
				}
			}), e.extend(e.pareto, {
				pdf: function(e, n, r) {
					return e < n ? 0 : r * t.pow(n, r) / t.pow(e, r + 1);
				},
				cdf: function(e, n, r) {
					return e < n ? 0 : 1 - t.pow(n / e, r);
				},
				inv: function(e, n, r) {
					return n / t.pow(1 - e, 1 / r);
				},
				mean: function(e, n) {
					if (!(n <= 1)) return n * t.pow(e, n) / (n - 1);
				},
				median: function(e, n) {
					return e * (n * t.SQRT2);
				},
				mode: function(e) {
					return e;
				},
				variance: function(e, n) {
					if (!(n <= 2)) return e * e * n / (t.pow(n - 1, 2) * (n - 2));
				}
			}), e.extend(e.studentt, {
				pdf: function(n, r) {
					return r = r > 1e100 ? 1e100 : r, 1 / (t.sqrt(r) * e.betafn(.5, r / 2)) * t.pow(1 + n * n / r, -((r + 1) / 2));
				},
				cdf: function(n, r) {
					var i = r / 2;
					return e.ibeta((n + t.sqrt(n * n + r)) / (2 * t.sqrt(n * n + r)), i, i);
				},
				inv: function(n, r) {
					var i = e.ibetainv(2 * t.min(n, 1 - n), .5 * r, .5);
					return i = t.sqrt(r * (1 - i) / i), n > .5 ? i : -i;
				},
				mean: function(e) {
					return e > 1 ? 0 : void 0;
				},
				median: function() {
					return 0;
				},
				mode: function() {
					return 0;
				},
				sample: function(n) {
					return e.randn() * t.sqrt(n / (2 * e.randg(n / 2)));
				},
				variance: function(e) {
					return e > 2 ? e / (e - 2) : e > 1 ? Infinity : void 0;
				}
			}), e.extend(e.weibull, {
				pdf: function(e, n, r) {
					return e < 0 || n < 0 || r < 0 ? 0 : r / n * t.pow(e / n, r - 1) * t.exp(-t.pow(e / n, r));
				},
				cdf: function(e, n, r) {
					return e < 0 ? 0 : 1 - t.exp(-t.pow(e / n, r));
				},
				inv: function(e, n, r) {
					return n * t.pow(-t.log(1 - e), 1 / r);
				},
				mean: function(t, n) {
					return t * e.gammafn(1 + 1 / n);
				},
				median: function(e, n) {
					return e * t.pow(t.log(2), 1 / n);
				},
				mode: function(e, n) {
					return n <= 1 ? 0 : e * t.pow((n - 1) / n, 1 / n);
				},
				sample: function(n, r) {
					return n * t.pow(-t.log(e._random_fn()), 1 / r);
				},
				variance: function(n, r) {
					return n * n * e.gammafn(1 + 2 / r) - t.pow(e.weibull.mean(n, r), 2);
				}
			}), e.extend(e.uniform, {
				pdf: function(e, t, n) {
					return e < t || e > n ? 0 : 1 / (n - t);
				},
				cdf: function(e, t, n) {
					return e < t ? 0 : e < n ? (e - t) / (n - t) : 1;
				},
				inv: function(e, t, n) {
					return t + e * (n - t);
				},
				mean: function(e, t) {
					return .5 * (e + t);
				},
				median: function(t, n) {
					return e.mean(t, n);
				},
				mode: function() {
					throw Error("mode is not yet implemented");
				},
				sample: function(t, n) {
					return t / 2 + n / 2 + (n / 2 - t / 2) * (2 * e._random_fn() - 1);
				},
				variance: function(e, n) {
					return t.pow(n - e, 2) / 12;
				}
			});
			function n(e, n, r, i) {
				for (var a = 0, o = 1, s = 1, c = 1, l = 0, u = 0, d; t.abs((s - u) / s) > i;) u = s, d = -(n + l) * (n + r + l) * e / (n + 2 * l) / (n + 2 * l + 1), a = s + d * a, o = c + d * o, l += 1, d = l * (r - l) * e / (n + 2 * l - 1) / (n + 2 * l), s = a + d * s, c = o + d * c, a /= c, o /= c, s /= c, c = 1;
				return s / n;
			}
			e.extend(e.binomial, {
				pdf: function(n, r, i) {
					return i === 0 || i === 1 ? +(r * i === n) : e.combination(r, n) * t.pow(i, n) * t.pow(1 - i, r - n);
				},
				cdf: function(r, i, a) {
					var o, s = 1e-10;
					if (r < 0) return 0;
					if (r >= i) return 1;
					if (a < 0 || a > 1 || i <= 0) return NaN;
					r = t.floor(r);
					var c = a, l = r + 1, u = i - r, d = l + u, f = t.exp(e.gammaln(d) - e.gammaln(u) - e.gammaln(l) + l * t.log(c) + u * t.log(1 - c));
					return o = c < (l + 1) / (d + 2) ? f * n(c, l, u, s) : 1 - f * n(1 - c, u, l, s), t.round((1 - o) * (1 / s)) / (1 / s);
				}
			}), e.extend(e.negbin, {
				pdf: function(n, r, i) {
					return n === n >>> 0 ? n < 0 ? 0 : e.combination(n + r - 1, r - 1) * t.pow(1 - i, n) * t.pow(i, r) : !1;
				},
				cdf: function(t, n, r) {
					var i = 0, a = 0;
					if (t < 0) return 0;
					for (; a <= t; a++) i += e.negbin.pdf(a, n, r);
					return i;
				}
			}), e.extend(e.hypgeom, {
				pdf: function(n, r, i, a) {
					if (n !== n | 0) return !1;
					if (n < 0 || n < i - (r - a) || n > a || n > i) return 0;
					if (i * 2 > r) return a * 2 > r ? e.hypgeom.pdf(r - i - a + n, r, r - i, r - a) : e.hypgeom.pdf(a - n, r, r - i, a);
					if (a * 2 > r) return e.hypgeom.pdf(i - n, r, i, r - a);
					if (i < a) return e.hypgeom.pdf(n, r, a, i);
					for (var o = 1, s = 0, c = 0; c < n; c++) {
						for (; o > 1 && s < a;) o *= 1 - i / (r - s), s++;
						o *= (a - c) * (i - c) / ((c + 1) * (r - i - a + c + 1));
					}
					for (; s < a; s++) o *= 1 - i / (r - s);
					return t.min(1, t.max(0, o));
				},
				cdf: function(n, r, i, a) {
					if (n < 0 || n < i - (r - a)) return 0;
					if (n >= a || n >= i) return 1;
					if (i * 2 > r) return a * 2 > r ? e.hypgeom.cdf(r - i - a + n, r, r - i, r - a) : 1 - e.hypgeom.cdf(a - n - 1, r, r - i, a);
					if (a * 2 > r) return 1 - e.hypgeom.cdf(i - n - 1, r, i, r - a);
					if (i < a) return e.hypgeom.cdf(n, r, a, i);
					for (var o = 1, s = 1, c = 0, l = 0; l < n; l++) {
						for (; o > 1 && c < a;) {
							var u = 1 - i / (r - c);
							s *= u, o *= u, c++;
						}
						s *= (a - l) * (i - l) / ((l + 1) * (r - i - a + l + 1)), o += s;
					}
					for (; c < a; c++) o *= 1 - i / (r - c);
					return t.min(1, t.max(0, o));
				}
			}), e.extend(e.poisson, {
				pdf: function(n, r) {
					return r < 0 || n % 1 != 0 || n < 0 ? 0 : t.pow(r, n) * t.exp(-r) / e.factorial(n);
				},
				cdf: function(t, n) {
					var r = [], i = 0;
					if (t < 0) return 0;
					for (; i <= t; i++) r.push(e.poisson.pdf(i, n));
					return e.sum(r);
				},
				mean: function(e) {
					return e;
				},
				variance: function(e) {
					return e;
				},
				sampleSmall: function(n) {
					var r = 1, i = 0, a = t.exp(-n);
					do
						i++, r *= e._random_fn();
					while (r > a);
					return i - 1;
				},
				sampleLarge: function(n) {
					var r = n, i, a, o, s = t.sqrt(r), c = t.log(r), l, u = .931 + 2.53 * s, d, f, p;
					for (l = -.059 + .02483 * u, d = 1.1239 + 1.1328 / (u - 3.4), f = .9277 - 3.6224 / (u - 2);;) if (a = t.random() - .5, o = t.random(), p = .5 - t.abs(a), i = t.floor((2 * l / p + u) * a + r + .43), p >= .07 && o <= f || !(i < 0 || p < .013 && o > p) && t.log(o) + t.log(d) - t.log(l / (p * p) + u) <= -r + i * c - e.loggam(i + 1)) return i;
				},
				sample: function(e) {
					return e < 10 ? this.sampleSmall(e) : this.sampleLarge(e);
				}
			}), e.extend(e.triangular, {
				pdf: function(e, t, n, r) {
					return n <= t || r < t || r > n ? NaN : e < t || e > n ? 0 : e < r ? 2 * (e - t) / ((n - t) * (r - t)) : e === r ? 2 / (n - t) : 2 * (n - e) / ((n - t) * (n - r));
				},
				cdf: function(e, n, r, i) {
					return r <= n || i < n || i > r ? NaN : e <= n ? 0 : e >= r ? 1 : e <= i ? t.pow(e - n, 2) / ((r - n) * (i - n)) : 1 - t.pow(r - e, 2) / ((r - n) * (r - i));
				},
				inv: function(e, n, r, i) {
					return r <= n || i < n || i > r ? NaN : e <= (i - n) / (r - n) ? n + (r - n) * t.sqrt(e * ((i - n) / (r - n))) : n + (r - n) * (1 - t.sqrt((1 - e) * (1 - (i - n) / (r - n))));
				},
				mean: function(e, t, n) {
					return (e + t + n) / 3;
				},
				median: function(e, n, r) {
					if (r <= (e + n) / 2) return n - t.sqrt((n - e) * (n - r)) / t.sqrt(2);
					if (r > (e + n) / 2) return e + t.sqrt((n - e) * (r - e)) / t.sqrt(2);
				},
				mode: function(e, t, n) {
					return n;
				},
				sample: function(n, r, i) {
					var a = e._random_fn();
					return a < (i - n) / (r - n) ? n + t.sqrt(a * (r - n) * (i - n)) : r - t.sqrt((1 - a) * (r - n) * (r - i));
				},
				variance: function(e, t, n) {
					return (e * e + t * t + n * n - e * t - e * n - t * n) / 18;
				}
			}), e.extend(e.arcsine, {
				pdf: function(e, n, r) {
					return r <= n ? NaN : e <= n || e >= r ? 0 : 2 / t.PI * t.pow(t.pow(r - n, 2) - t.pow(2 * e - n - r, 2), -.5);
				},
				cdf: function(e, n, r) {
					return e < n ? 0 : e < r ? 2 / t.PI * t.asin(t.sqrt((e - n) / (r - n))) : 1;
				},
				inv: function(e, n, r) {
					return n + (.5 - .5 * t.cos(t.PI * e)) * (r - n);
				},
				mean: function(e, t) {
					return t <= e ? NaN : (e + t) / 2;
				},
				median: function(e, t) {
					return t <= e ? NaN : (e + t) / 2;
				},
				mode: function() {
					throw Error("mode is not yet implemented");
				},
				sample: function(n, r) {
					return (n + r) / 2 + (r - n) / 2 * t.sin(2 * t.PI * e.uniform.sample(0, 1));
				},
				variance: function(e, n) {
					return n <= e ? NaN : t.pow(n - e, 2) / 8;
				}
			});
			function r(e) {
				return e / t.abs(e);
			}
			e.extend(e.laplace, {
				pdf: function(e, n, r) {
					return r <= 0 ? 0 : t.exp(-t.abs(e - n) / r) / (2 * r);
				},
				cdf: function(e, n, r) {
					return r <= 0 ? 0 : e < n ? .5 * t.exp((e - n) / r) : 1 - .5 * t.exp(-(e - n) / r);
				},
				mean: function(e) {
					return e;
				},
				median: function(e) {
					return e;
				},
				mode: function(e) {
					return e;
				},
				variance: function(e, t) {
					return 2 * t * t;
				},
				sample: function(n, i) {
					var a = e._random_fn() - .5;
					return n - i * r(a) * t.log(1 - 2 * t.abs(a));
				}
			});
			function i(n, r, i) {
				var a = 12, o = 6, s = -30, c = -50, l = 60, u = 8, d = 3, f = 2, p = 3, m = [
					.9815606342467192,
					.9041172563704749,
					.7699026741943047,
					.5873179542866175,
					.3678314989981802,
					.1252334085114689
				], h = [
					.04717533638651183,
					.10693932599531843,
					.16007832854334622,
					.20316742672306592,
					.2334925365383548,
					.24914704581340277
				], g = n * .5;
				if (g >= u) return 1;
				var _ = 2 * e.normal.cdf(g, 0, 1, 1, 0) - 1;
				_ = _ >= t.exp(c / i) ? t.pow(_, i) : 0;
				for (var v = n > d ? f : p, y = g, b = (u - g) / v, x = y + b, S = 0, ee = i - 1, C = 1; C <= v; C++) {
					for (var te = 0, w = .5 * (x + y), ne = .5 * (x - y), T = 1; T <= a; T++) {
						var E, D;
						o < T ? (E = a - T + 1, D = m[E - 1]) : (E = T, D = -m[E - 1]);
						var O = w + ne * D, k = O * O;
						if (k > l) break;
						var A = 2 * e.normal.cdf(O, 0, 1, 1, 0), re = 2 * e.normal.cdf(O, n, 1, 1, 0), ie = A * .5 - re * .5;
						ie >= t.exp(s / ee) && (ie = h[E - 1] * t.exp(-(.5 * k)) * t.pow(ie, ee), te += ie);
					}
					te *= 2 * ne * i / t.sqrt(2 * t.PI), S += te, y = x, x += b;
				}
				return _ += S, _ <= t.exp(s / r) ? 0 : (_ = t.pow(_, r), _ >= 1 ? 1 : _);
			}
			function a(e, n, r) {
				var i = .322232421088, a = .099348462606, o = -1, s = .588581570495, c = -.342242088547, l = .531103462366, u = -.204231210125, d = .10353775285, f = -453642210148e-16, p = .0038560700634, m = .8832, h = .2368, g = 1.214, _ = 1.208, v = 1.4142, y = 120, b = .5 - .5 * e, x = t.sqrt(t.log(1 / (b * b))), S = x + ((((x * f + u) * x + c) * x + o) * x + i) / ((((x * p + d) * x + l) * x + s) * x + a);
				r < y && (S += (S * S * S + S) / r / 4);
				var ee = m - h * S;
				return r < y && (ee += -g / r + _ * S / r), S * (ee * t.log(n - 1) + v);
			}
			e.extend(e.tukey, {
				cdf: function(n, r, a) {
					var o = 1, s = r, c = 16, l = 8, u = -30, d = 1e-14, f = 100, p = 800, m = 5e3, h = 25e3, g = 1, _ = .5, v = .25, y = .125, b = [
						.9894009349916499,
						.9445750230732326,
						.8656312023878318,
						.755404408355003,
						.6178762444026438,
						.45801677765722737,
						.2816035507792589,
						.09501250983763744
					], x = [
						.027152459411754096,
						.062253523938647894,
						.09515851168249279,
						.12462897125553388,
						.14959598881657674,
						.16915651939500254,
						.18260341504492358,
						.1894506104550685
					];
					if (n <= 0) return 0;
					if (a < 2 || o < 1 || s < 2) return NaN;
					if (!Number.isFinite(n)) return 1;
					if (a > h) return i(n, o, s);
					var S = a * .5, ee = S * t.log(a) - a * t.log(2) - e.gammaln(S), C = S - 1, te = a * .25, w = a <= f ? g : a <= p ? _ : a <= m ? v : y;
					ee += t.log(w);
					for (var ne = 0, T = 1; T <= 50; T++) {
						for (var E = 0, D = (2 * T - 1) * w, O = 1; O <= c; O++) {
							var k, A;
							l < O ? (k = O - l - 1, A = ee + C * t.log(D + b[k] * w) - (b[k] * w + D) * te) : (k = O - 1, A = ee + C * t.log(D - b[k] * w) + (b[k] * w - D) * te);
							var re;
							if (A >= u) {
								re = l < O ? n * t.sqrt((b[k] * w + D) * .5) : n * t.sqrt((-(b[k] * w) + D) * .5);
								var ie = i(re, o, s) * x[k] * t.exp(A);
								E += ie;
							}
						}
						if (T * w >= 1 && E <= d) break;
						ne += E;
					}
					if (E > d) throw Error("tukey.cdf failed to converge");
					return ne > 1 && (ne = 1), ne;
				},
				inv: function(n, r, i) {
					var o = 1, s = r, c = 1e-4, l = 50;
					if (i < 2 || o < 1 || s < 2 || n < 0 || n > 1) return NaN;
					if (n === 0) return 0;
					if (n === 1) return Infinity;
					for (var u = a(n, s, i), d = e.tukey.cdf(u, r, i) - n, f = d > 0 ? t.max(0, u - 1) : u + 1, p = e.tukey.cdf(f, r, i) - n, m, h = 1; h < l; h++) if (m = f - p * (f - u) / (p - d), d = p, u = f, m < 0 && (m = 0, p = -n), p = e.tukey.cdf(m, r, i) - n, f = m, t.abs(f - u) < c) return m;
					throw Error("tukey.inv failed to converge");
				}
			});
		})(e, Math), (function(e, t) {
			var n = Array.prototype.push, r = e.utils.isArray;
			function i(t) {
				return r(t) || t instanceof e;
			}
			e.extend({
				add: function(t, n) {
					return i(n) ? (i(n[0]) || (n = [n]), e.map(t, function(e, t, r) {
						return e + n[t][r];
					})) : e.map(t, function(e) {
						return e + n;
					});
				},
				subtract: function(t, n) {
					return i(n) ? (i(n[0]) || (n = [n]), e.map(t, function(e, t, r) {
						return e - n[t][r] || 0;
					})) : e.map(t, function(e) {
						return e - n;
					});
				},
				divide: function(t, n) {
					return i(n) ? (i(n[0]) || (n = [n]), e.multiply(t, e.inv(n))) : e.map(t, function(e) {
						return e / n;
					});
				},
				multiply: function(t, n) {
					var r, a, o, s, c, l, u, d;
					if (t.length === void 0 && n.length === void 0) return t * n;
					if (c = t.length, l = t[0].length, u = e.zeros(c, o = i(n) ? n[0].length : l), d = 0, i(n)) {
						for (; d < o; d++) for (r = 0; r < c; r++) {
							for (s = 0, a = 0; a < l; a++) s += t[r][a] * n[a][d];
							u[r][d] = s;
						}
						return c === 1 && d === 1 ? u[0][0] : u;
					}
					return e.map(t, function(e) {
						return e * n;
					});
				},
				outer: function(t, n) {
					return e.multiply(t.map(function(e) {
						return [e];
					}), [n]);
				},
				dot: function(t, n) {
					i(t[0]) || (t = [t]), i(n[0]) || (n = [n]);
					for (var r = t[0].length === 1 && t.length !== 1 ? e.transpose(t) : t, a = n[0].length === 1 && n.length !== 1 ? e.transpose(n) : n, o = [], s = 0, c = r.length, l = r[0].length, u, d; s < c; s++) {
						for (o[s] = [], u = 0, d = 0; d < l; d++) u += r[s][d] * a[s][d];
						o[s] = u;
					}
					return o.length === 1 ? o[0] : o;
				},
				pow: function(n, r) {
					return e.map(n, function(e) {
						return t.pow(e, r);
					});
				},
				exp: function(n) {
					return e.map(n, function(e) {
						return t.exp(e);
					});
				},
				log: function(n) {
					return e.map(n, function(e) {
						return t.log(e);
					});
				},
				abs: function(n) {
					return e.map(n, function(e) {
						return t.abs(e);
					});
				},
				norm: function(e, n) {
					var r = 0, a = 0;
					for (isNaN(n) && (n = 2), i(e[0]) && (e = e[0]); a < e.length; a++) r += t.pow(t.abs(e[a]), n);
					return t.pow(r, 1 / n);
				},
				angle: function(n, r) {
					return t.acos(e.dot(n, r) / (e.norm(n) * e.norm(r)));
				},
				aug: function(e, t) {
					var r = [], i;
					for (i = 0; i < e.length; i++) r.push(e[i].slice());
					for (i = 0; i < r.length; i++) n.apply(r[i], t[i]);
					return r;
				},
				inv: function(t) {
					for (var n = t.length, r = t[0].length, i = e.identity(n, r), a = e.gauss_jordan(t, i), o = [], s = 0, c; s < n; s++) for (o[s] = [], c = r; c < a[0].length; c++) o[s][c - r] = a[s][c];
					return o;
				},
				det: function e(t) {
					if (t.length === 2) return t[0][0] * t[1][1] - t[0][1] * t[1][0];
					for (var n = 0, r = 0; r < t.length; r++) {
						for (var i = [], a = 1; a < t.length; a++) {
							i[a - 1] = [];
							for (var o = 0; o < t.length; o++) o < r ? i[a - 1][o] = t[a][o] : o > r && (i[a - 1][o - 1] = t[a][o]);
						}
						var s = r % 2 ? -1 : 1;
						n += e(i) * t[0][r] * s;
					}
					return n;
				},
				gauss_elimination: function(n, r) {
					var i = 0, a = 0, o = n.length, s = n[0].length, c = 1, l = 0, u = [], d, f, p, m;
					for (n = e.aug(n, r), d = n[0].length, i = 0; i < o; i++) {
						for (f = n[i][i], a = i, m = i + 1; m < s; m++) f < t.abs(n[m][i]) && (f = n[m][i], a = m);
						if (a != i) for (m = 0; m < d; m++) p = n[i][m], n[i][m] = n[a][m], n[a][m] = p;
						for (a = i + 1; a < o; a++) for (c = n[a][i] / n[i][i], m = i; m < d; m++) n[a][m] = n[a][m] - c * n[i][m];
					}
					for (i = o - 1; i >= 0; i--) {
						for (l = 0, a = i + 1; a <= o - 1; a++) l += u[a] * n[i][a];
						u[i] = (n[i][d - 1] - l) / n[i][i];
					}
					return u;
				},
				gauss_jordan: function(n, r) {
					var i = e.aug(n, r), a = i.length, o = i[0].length, s = 0, c, l, u;
					for (l = 0; l < a; l++) {
						var d = l;
						for (u = l + 1; u < a; u++) t.abs(i[u][l]) > t.abs(i[d][l]) && (d = u);
						var f = i[l];
						for (i[l] = i[d], i[d] = f, u = l + 1; u < a; u++) for (s = i[u][l] / i[l][l], c = l; c < o; c++) i[u][c] -= i[l][c] * s;
					}
					for (l = a - 1; l >= 0; l--) {
						for (s = i[l][l], u = 0; u < l; u++) for (c = o - 1; c > l - 1; c--) i[u][c] -= i[l][c] * i[u][l] / s;
						for (i[l][l] /= s, c = a; c < o; c++) i[l][c] /= s;
					}
					return i;
				},
				triaUpSolve: function(t, n) {
					var r = t[0].length, i = e.zeros(1, r)[0], a, o = !1;
					return n[0].length != null && (n = n.map(function(e) {
						return e[0];
					}), o = !0), e.arange(r - 1, -1, -1).forEach(function(o) {
						a = e.arange(o + 1, r).map(function(e) {
							return i[e] * t[o][e];
						}), i[o] = (n[o] - e.sum(a)) / t[o][o];
					}), o ? i.map(function(e) {
						return [e];
					}) : i;
				},
				triaLowSolve: function(t, n) {
					var r = t[0].length, i = e.zeros(1, r)[0], a, o = !1;
					return n[0].length != null && (n = n.map(function(e) {
						return e[0];
					}), o = !0), e.arange(r).forEach(function(r) {
						a = e.arange(r).map(function(e) {
							return t[r][e] * i[e];
						}), i[r] = (n[r] - e.sum(a)) / t[r][r];
					}), o ? i.map(function(e) {
						return [e];
					}) : i;
				},
				lu: function(t) {
					var n = t.length, r = e.identity(n), i = e.zeros(t.length, t[0].length), a;
					return e.arange(n).forEach(function(e) {
						i[0][e] = t[0][e];
					}), e.arange(1, n).forEach(function(o) {
						e.arange(o).forEach(function(n) {
							a = e.arange(n).map(function(e) {
								return r[o][e] * i[e][n];
							}), r[o][n] = (t[o][n] - e.sum(a)) / i[n][n];
						}), e.arange(o, n).forEach(function(n) {
							a = e.arange(o).map(function(e) {
								return r[o][e] * i[e][n];
							}), i[o][n] = t[a.length][n] - e.sum(a);
						});
					}), [r, i];
				},
				cholesky: function(n) {
					var r = n.length, i = e.zeros(n.length, n[0].length), a;
					return e.arange(r).forEach(function(o) {
						a = e.arange(o).map(function(e) {
							return t.pow(i[o][e], 2);
						}), i[o][o] = t.sqrt(n[o][o] - e.sum(a)), e.arange(o + 1, r).forEach(function(t) {
							a = e.arange(o).map(function(e) {
								return i[o][e] * i[t][e];
							}), i[t][o] = (n[o][t] - e.sum(a)) / i[o][o];
						});
					}), i;
				},
				gauss_jacobi: function(n, r, i, a) {
					for (var o = 0, s = 0, c = n.length, l = [], u = [], d = [], f, p, m, h; o < c; o++) for (l[o] = [], u[o] = [], d[o] = [], s = 0; s < c; s++) o > s ? (l[o][s] = n[o][s], u[o][s] = d[o][s] = 0) : o < s ? (u[o][s] = n[o][s], l[o][s] = d[o][s] = 0) : (d[o][s] = n[o][s], l[o][s] = u[o][s] = 0);
					for (m = e.multiply(e.multiply(e.inv(d), e.add(l, u)), -1), p = e.multiply(e.inv(d), r), f = i, h = e.add(e.multiply(m, i), p), o = 2; t.abs(e.norm(e.subtract(h, f))) > a;) f = h, h = e.add(e.multiply(m, f), p), o++;
					return h;
				},
				gauss_seidel: function(n, r, i, a) {
					for (var o = 0, s = n.length, c = [], l = [], u = [], d, f, p, m, h; o < s; o++) for (c[o] = [], l[o] = [], u[o] = [], d = 0; d < s; d++) o > d ? (c[o][d] = n[o][d], l[o][d] = u[o][d] = 0) : o < d ? (l[o][d] = n[o][d], c[o][d] = u[o][d] = 0) : (u[o][d] = n[o][d], c[o][d] = l[o][d] = 0);
					for (m = e.multiply(e.multiply(e.inv(e.add(u, c)), l), -1), p = e.multiply(e.inv(e.add(u, c)), r), f = i, h = e.add(e.multiply(m, i), p), o = 2; t.abs(e.norm(e.subtract(h, f))) > a;) f = h, h = e.add(e.multiply(m, f), p), o += 1;
					return h;
				},
				SOR: function(n, r, i, a, o) {
					for (var s = 0, c = n.length, l = [], u = [], d = [], f, p, m, h, g; s < c; s++) for (l[s] = [], u[s] = [], d[s] = [], f = 0; f < c; f++) s > f ? (l[s][f] = n[s][f], u[s][f] = d[s][f] = 0) : s < f ? (u[s][f] = n[s][f], l[s][f] = d[s][f] = 0) : (d[s][f] = n[s][f], l[s][f] = u[s][f] = 0);
					for (h = e.multiply(e.inv(e.add(d, e.multiply(l, o))), e.subtract(e.multiply(d, 1 - o), e.multiply(u, o))), m = e.multiply(e.multiply(e.inv(e.add(d, e.multiply(l, o))), r), o), p = i, g = e.add(e.multiply(h, i), m), s = 2; t.abs(e.norm(e.subtract(g, p))) > a;) p = g, g = e.add(e.multiply(h, p), m), s++;
					return g;
				},
				householder: function(n) {
					for (var r = n.length, i = n[0].length, a = 0, o = [], s = [], c, l, u, d, f; a < r - 1; a++) {
						for (c = 0, d = a + 1; d < i; d++) c += n[d][a] * n[d][a];
						for (f = n[a + 1][a] > 0 ? -1 : 1, c = f * t.sqrt(c), l = t.sqrt((c * c - n[a + 1][a] * c) / 2), o = e.zeros(r, 1), o[a + 1][0] = (n[a + 1][a] - c) / (2 * l), u = a + 2; u < r; u++) o[u][0] = n[u][a] / (2 * l);
						s = e.subtract(e.identity(r, i), e.multiply(e.multiply(o, e.transpose(o)), 2)), n = e.multiply(s, e.multiply(n, s));
					}
					return n;
				},
				QR: function() {
					var n = e.sum, r = e.arange;
					function i(i) {
						var a = i.length, o = i[0].length, s = e.zeros(o, o);
						i = e.copy(i);
						var c, l, u;
						for (l = 0; l < o; l++) {
							for (s[l][l] = t.sqrt(n(r(a).map(function(e) {
								return i[e][l] * i[e][l];
							}))), c = 0; c < a; c++) i[c][l] = i[c][l] / s[l][l];
							for (u = l + 1; u < o; u++) for (s[l][u] = n(r(a).map(function(e) {
								return i[e][l] * i[e][u];
							})), c = 0; c < a; c++) i[c][u] = i[c][u] - i[c][l] * s[l][u];
						}
						return [i, s];
					}
					return i;
				}(),
				lstsq: function() {
					function t(t) {
						t = e.copy(t);
						var n = t.length, r = e.identity(n);
						return e.arange(n - 1, -1, -1).forEach(function(n) {
							e.sliceAssign(r, { row: n }, e.divide(e.slice(r, { row: n }), t[n][n])), e.sliceAssign(t, { row: n }, e.divide(e.slice(t, { row: n }), t[n][n])), e.arange(n).forEach(function(i) {
								var a = e.multiply(t[i][n], -1), o = e.slice(t, { row: i }), s = e.multiply(e.slice(t, { row: n }), a);
								e.sliceAssign(t, { row: i }, e.add(o, s));
								var c = e.slice(r, { row: i }), l = e.multiply(e.slice(r, { row: n }), a);
								e.sliceAssign(r, { row: i }, e.add(c, l));
							});
						}), r;
					}
					function n(n, r) {
						var i = !1;
						r[0].length === void 0 && (r = r.map(function(e) {
							return [e];
						}), i = !0);
						var a = e.QR(n), o = a[0], s = a[1], c = n[0].length, l = e.slice(o, { col: { end: c } }), u = t(e.slice(s, { row: { end: c } })), d = e.transpose(l);
						d[0].length === void 0 && (d = [d]);
						var f = e.multiply(e.multiply(u, d), r);
						return f.length === void 0 && (f = [[f]]), i ? f.map(function(e) {
							return e[0];
						}) : f;
					}
					return n;
				}(),
				jacobi: function(n) {
					for (var r = 1, i = n.length, a = e.identity(i, i), o = [], s, c, l, u, d, f, p, m; r === 1;) {
						for (f = n[0][1], u = 0, d = 1, c = 0; c < i; c++) for (l = 0; l < i; l++) c != l && f < t.abs(n[c][l]) && (f = t.abs(n[c][l]), u = c, d = l);
						for (p = n[u][u] === n[d][d] ? n[u][d] > 0 ? t.PI / 4 : -t.PI / 4 : t.atan(2 * n[u][d] / (n[u][u] - n[d][d])) / 2, m = e.identity(i, i), m[u][u] = t.cos(p), m[u][d] = -t.sin(p), m[d][u] = t.sin(p), m[d][d] = t.cos(p), a = e.multiply(a, m), s = e.multiply(e.multiply(e.inv(m), n), m), n = s, r = 0, c = 1; c < i; c++) for (l = 1; l < i; l++) c != l && t.abs(n[c][l]) > .001 && (r = 1);
					}
					for (c = 0; c < i; c++) o.push(n[c][c]);
					return [a, o];
				},
				rungekutta: function(e, t, n, r, i, a) {
					var o, s, c, l, u;
					if (a === 2) for (; r <= n;) o = t * e(r, i), s = t * e(r + t, i + o), c = i + (o + s) / 2, i = c, r += t;
					if (a === 4) for (; r <= n;) o = t * e(r, i), s = t * e(r + t / 2, i + o / 2), l = t * e(r + t / 2, i + s / 2), u = t * e(r + t, i + l), c = i + (o + 2 * s + 2 * l + u) / 6, i = c, r += t;
					return i;
				},
				romberg: function(e, n, r, i) {
					for (var a = 0, o = (r - n) / 2, s = [], c = [], l = [], u, d, f, p, m; a < i / 2;) {
						for (m = e(n), f = n, p = 0; f <= r; f += o, p++) s[p] = f;
						for (u = s.length, f = 1; f < u - 1; f++) m += (f % 2 == 0 ? 2 : 4) * e(s[f]);
						m = o / 3 * (m + e(r)), l[a] = m, o /= 2, a++;
					}
					for (d = l.length, u = 1; d !== 1;) {
						for (f = 0; f < d - 1; f++) c[f] = (t.pow(4, u) * l[f + 1] - l[f]) / (t.pow(4, u) - 1);
						d = c.length, l = c, c = [], u++;
					}
					return l;
				},
				richardson: function(e, n, r, i) {
					function a(e, t) {
						for (var n = 0, r = e.length, i; n < r; n++) e[n] === t && (i = n);
						return i;
					}
					for (var o = t.abs(r - e[a(e, r) + 1]), s = 0, c = [], l = [], u, d, f, p, m; i >= o;) u = a(e, r + i), d = a(e, r), c[s] = (n[u] - 2 * n[d] + n[2 * d - u]) / (i * i), i /= 2, s++;
					for (p = c.length, f = 1; p != 1;) {
						for (m = 0; m < p - 1; m++) l[m] = (t.pow(4, f) * c[m + 1] - c[m]) / (t.pow(4, f) - 1);
						p = l.length, c = l, l = [], f++;
					}
					return c;
				},
				simpson: function(e, t, n, r) {
					for (var i = (n - t) / r, a = e(t), o = [], s = t, c = 0, l = 1, u; s <= n; s += i, c++) o[c] = s;
					for (u = o.length; l < u - 1; l++) a += (l % 2 == 0 ? 2 : 4) * e(o[l]);
					return i / 3 * (a + e(n));
				},
				hermite: function(e, t, n, r) {
					for (var i = e.length, a = 0, o = 0, s = [], c = [], l = [], u = [], d; o < i; o++) {
						for (s[o] = 1, d = 0; d < i; d++) o != d && (s[o] *= (r - e[d]) / (e[o] - e[d]));
						for (c[o] = 0, d = 0; d < i; d++) o != d && (c[o] += 1 / (e[o] - e[d]));
						l[o] = (1 - 2 * (r - e[o]) * c[o]) * (s[o] * s[o]), u[o] = (r - e[o]) * (s[o] * s[o]), a += l[o] * t[o] + u[o] * n[o];
					}
					return a;
				},
				lagrange: function(e, t, n) {
					for (var r = 0, i = 0, a, o, s = e.length; i < s; i++) {
						for (o = t[i], a = 0; a < s; a++) i != a && (o *= (n - e[a]) / (e[i] - e[a]));
						r += o;
					}
					return r;
				},
				cubic_spline: function(t, n, r) {
					for (var i = t.length, a = 0, o, s = [], c = [], l = [], u = [], d = [], f = [], p = []; a < i - 1; a++) d[a] = t[a + 1] - t[a];
					for (l[0] = 0, a = 1; a < i - 1; a++) l[a] = 3 / d[a] * (n[a + 1] - n[a]) - 3 / d[a - 1] * (n[a] - n[a - 1]);
					for (a = 1; a < i - 1; a++) s[a] = [], c[a] = [], s[a][a - 1] = d[a - 1], s[a][a] = 2 * (d[a - 1] + d[a]), s[a][a + 1] = d[a], c[a][0] = l[a];
					for (u = e.multiply(e.inv(s), c), o = 0; o < i - 1; o++) f[o] = (n[o + 1] - n[o]) / d[o] - d[o] * (u[o + 1][0] + 2 * u[o][0]) / 3, p[o] = (u[o + 1][0] - u[o][0]) / (3 * d[o]);
					for (o = 0; o < i && !(t[o] > r); o++);
					return --o, n[o] + (r - t[o]) * f[o] + e.sq(r - t[o]) * u[o] + (r - t[o]) * e.sq(r - t[o]) * p[o];
				},
				gauss_quadrature: function() {
					throw Error("gauss_quadrature not yet implemented");
				},
				PCA: function(t) {
					var n = t.length, r = t[0].length, i = 0, a, o, s = [], c = [], l = [], u = [], d = [], f = [], p = [], m = [], h = [], g = [];
					for (i = 0; i < n; i++) s[i] = e.sum(t[i]) / r;
					for (i = 0; i < r; i++) for (p[i] = [], a = 0; a < n; a++) p[i][a] = t[a][i] - s[a];
					for (p = e.transpose(p), i = 0; i < n; i++) for (m[i] = [], a = 0; a < n; a++) m[i][a] = e.dot([p[i]], [p[a]]) / (r - 1);
					for (l = e.jacobi(m), h = l[0], c = l[1], g = e.transpose(h), i = 0; i < c.length; i++) for (a = i; a < c.length; a++) c[i] < c[a] && (o = c[i], c[i] = c[a], c[a] = o, u = g[i], g[i] = g[a], g[a] = u);
					for (f = e.transpose(p), i = 0; i < n; i++) for (d[i] = [], a = 0; a < f.length; a++) d[i][a] = e.dot([g[i]], [f[a]]);
					return [
						t,
						c,
						g,
						d
					];
				}
			}), (function(t) {
				for (var n = 0; n < t.length; n++) (function(t) {
					e.fn[t] = function(n, r) {
						var i = this;
						return r ? (setTimeout(function() {
							r.call(i, e.fn[t].call(i, n));
						}, 15), this) : typeof e[t](this, n) == "number" ? e[t](this, n) : e(e[t](this, n));
					};
				})(t[n]);
			})("add divide multiply subtract dot pow exp log abs norm angle".split(" "));
		})(e, Math), (function(e, t) {
			var n = [].slice, r = e.utils.isNumber, i = e.utils.isArray;
			e.extend({
				zscore: function() {
					var t = n.call(arguments);
					return r(t[1]) ? (t[0] - t[1]) / t[2] : (t[0] - e.mean(t[1])) / e.stdev(t[1], t[2]);
				},
				ztest: function() {
					var r = n.call(arguments), a;
					return i(r[1]) ? (a = e.zscore(r[0], r[1], r[3]), r[2] === 1 ? e.normal.cdf(-t.abs(a), 0, 1) : e.normal.cdf(-t.abs(a), 0, 1) * 2) : r.length > 2 ? (a = e.zscore(r[0], r[1], r[2]), r[3] === 1 ? e.normal.cdf(-t.abs(a), 0, 1) : e.normal.cdf(-t.abs(a), 0, 1) * 2) : (a = r[0], r[1] === 1 ? e.normal.cdf(-t.abs(a), 0, 1) : e.normal.cdf(-t.abs(a), 0, 1) * 2);
				}
			}), e.extend(e.fn, {
				zscore: function(e, t) {
					return (e - this.mean()) / this.stdev(t);
				},
				ztest: function(n, r, i) {
					var a = t.abs(this.zscore(n, i));
					return r === 1 ? e.normal.cdf(-a, 0, 1) : e.normal.cdf(-a, 0, 1) * 2;
				}
			}), e.extend({
				tscore: function() {
					var r = n.call(arguments);
					return r.length === 4 ? (r[0] - r[1]) / (r[2] / t.sqrt(r[3])) : (r[0] - e.mean(r[1])) / (e.stdev(r[1], !0) / t.sqrt(r[1].length));
				},
				ttest: function() {
					var i = n.call(arguments), a;
					return i.length === 5 ? (a = t.abs(e.tscore(i[0], i[1], i[2], i[3])), i[4] === 1 ? e.studentt.cdf(-a, i[3] - 1) : e.studentt.cdf(-a, i[3] - 1) * 2) : r(i[1]) ? (a = t.abs(i[0]), i[2] == 1 ? e.studentt.cdf(-a, i[1] - 1) : e.studentt.cdf(-a, i[1] - 1) * 2) : (a = t.abs(e.tscore(i[0], i[1])), i[2] == 1 ? e.studentt.cdf(-a, i[1].length - 1) : e.studentt.cdf(-a, i[1].length - 1) * 2);
				}
			}), e.extend(e.fn, {
				tscore: function(e) {
					return (e - this.mean()) / (this.stdev(!0) / t.sqrt(this.cols()));
				},
				ttest: function(n, r) {
					return r === 1 ? 1 - e.studentt.cdf(t.abs(this.tscore(n)), this.cols() - 1) : e.studentt.cdf(-t.abs(this.tscore(n)), this.cols() - 1) * 2;
				}
			}), e.extend({
				anovafscore: function() {
					var r = n.call(arguments), i, a, o, s, c, l, u, d;
					if (r.length === 1) {
						for (c = Array(r[0].length), u = 0; u < r[0].length; u++) c[u] = r[0][u];
						r = c;
					}
					for (a = [], u = 0; u < r.length; u++) a = a.concat(r[u]);
					for (o = e.mean(a), i = 0, u = 0; u < r.length; u++) i += r[u].length * t.pow(e.mean(r[u]) - o, 2);
					for (i /= r.length - 1, l = 0, u = 0; u < r.length; u++) for (s = e.mean(r[u]), d = 0; d < r[u].length; d++) l += t.pow(r[u][d] - s, 2);
					return l /= a.length - r.length, i / l;
				},
				anovaftest: function() {
					var t = n.call(arguments), i, a, o, s;
					if (r(t[0])) return 1 - e.centralF.cdf(t[0], t[1], t[2]);
					var c = e.anovafscore(t);
					for (i = t.length - 1, o = 0, s = 0; s < t.length; s++) o += t[s].length;
					return a = o - i - 1, 1 - e.centralF.cdf(c, i, a);
				},
				ftest: function(t, n, r) {
					return 1 - e.centralF.cdf(t, n, r);
				}
			}), e.extend(e.fn, {
				anovafscore: function() {
					return e.anovafscore(this.toArray());
				},
				anovaftes: function() {
					var t = 0, n;
					for (n = 0; n < this.length; n++) t += this[n].length;
					return e.ftest(this.anovafscore(), this.length - 1, t - this.length);
				}
			}), e.extend({
				qscore: function() {
					var i = n.call(arguments), a, o, s, c, l;
					return r(i[0]) ? (a = i[0], o = i[1], s = i[2], c = i[3], l = i[4]) : (a = e.mean(i[0]), o = e.mean(i[1]), s = i[0].length, c = i[1].length, l = i[2]), t.abs(a - o) / (l * t.sqrt((1 / s + 1 / c) / 2));
				},
				qtest: function() {
					var t = n.call(arguments), r;
					t.length === 3 ? (r = t[0], t = t.slice(1)) : t.length === 7 ? (r = e.qscore(t[0], t[1], t[2], t[3], t[4]), t = t.slice(5)) : (r = e.qscore(t[0], t[1], t[2]), t = t.slice(3));
					var i = t[0], a = t[1];
					return 1 - e.tukey.cdf(r, a, i - a);
				},
				tukeyhsd: function(t) {
					for (var n = e.pooledstdev(t), r = t.map(function(t) {
						return e.mean(t);
					}), i = t.reduce(function(e, t) {
						return e + t.length;
					}, 0), a = [], o = 0; o < t.length; ++o) for (var s = o + 1; s < t.length; ++s) {
						var c = e.qtest(r[o], r[s], t[o].length, t[s].length, n, i, t.length);
						a.push([[o, s], c]);
					}
					return a;
				}
			}), e.extend({
				normalci: function() {
					var r = n.call(arguments), i = [, ,], a = r.length === 4 ? t.abs(e.normal.inv(r[1] / 2, 0, 1) * r[2] / t.sqrt(r[3])) : t.abs(e.normal.inv(r[1] / 2, 0, 1) * e.stdev(r[2]) / t.sqrt(r[2].length));
					return i[0] = r[0] - a, i[1] = r[0] + a, i;
				},
				tci: function() {
					var r = n.call(arguments), i = [, ,], a = r.length === 4 ? t.abs(e.studentt.inv(r[1] / 2, r[3] - 1) * r[2] / t.sqrt(r[3])) : t.abs(e.studentt.inv(r[1] / 2, r[2].length - 1) * e.stdev(r[2], !0) / t.sqrt(r[2].length));
					return i[0] = r[0] - a, i[1] = r[0] + a, i;
				},
				significant: function(e, t) {
					return e < t;
				}
			}), e.extend(e.fn, {
				normalci: function(t, n) {
					return e.normalci(t, n, this.toArray());
				},
				tci: function(t, n) {
					return e.tci(t, n, this.toArray());
				}
			});
			function a(e, n, r, i) {
				if (e > 1 || r > 1 || e <= 0 || r <= 0) throw Error("Proportions should be greater than 0 and less than 1");
				var a = (e * n + r * i) / (n + i), o = t.sqrt(a * (1 - a) * (1 / n + 1 / i));
				return (e - r) / o;
			}
			e.extend(e.fn, {
				oneSidedDifferenceOfProportions: function(t, n, r, i) {
					var o = a(t, n, r, i);
					return e.ztest(o, 1);
				},
				twoSidedDifferenceOfProportions: function(t, n, r, i) {
					var o = a(t, n, r, i);
					return e.ztest(o, 2);
				}
			});
		})(e, Math), e.models = (function() {
			function t(t) {
				var r = t[0].length;
				return e.arange(r).map(function(i) {
					var a = e.arange(r).filter(function(e) {
						return e !== i;
					});
					return n(e.col(t, i).map(function(e) {
						return e[0];
					}), e.col(t, a));
				});
			}
			function n(t, n) {
				var r = t.length, i = n[0].length - 1, a = r - i - 1, o = e.lstsq(n, t), s = e.multiply(n, o.map(function(e) {
					return [e];
				})).map(function(e) {
					return e[0];
				}), c = e.subtract(t, s), l = e.mean(t), u = e.sum(s.map(function(e) {
					return (e - l) ** 2;
				})), d = e.sum(t.map(function(e, t) {
					return (e - s[t]) ** 2;
				})), f = u + d;
				return {
					exog: n,
					endog: t,
					nobs: r,
					df_model: i,
					df_resid: a,
					coef: o,
					predict: s,
					resid: c,
					ybar: l,
					SST: f,
					SSE: u,
					SSR: d,
					R2: u / f
				};
			}
			function r(n) {
				var r = t(n.exog), i = Math.sqrt(n.SSR / n.df_resid), a = r.map(function(e) {
					var t = e.SST, n = e.R2;
					return i / Math.sqrt(t * (1 - n));
				}), o = n.coef.map(function(e, t) {
					return (e - 0) / a[t];
				}), s = o.map(function(t) {
					var r = e.studentt.cdf(t, n.df_resid);
					return (r > .5 ? 1 - r : r) * 2;
				}), c = e.studentt.inv(.975, n.df_resid);
				return {
					se: a,
					t: o,
					p: s,
					sigmaHat: i,
					interval95: n.coef.map(function(e, t) {
						var n = c * a[t];
						return [e - n, e + n];
					})
				};
			}
			function i(t) {
				var n = t.R2 / t.df_model / ((1 - t.R2) / t.df_resid);
				return {
					F_statistic: n,
					pvalue: 1 - function(t, n, r) {
						return e.beta.cdf(t / (r / n + t), n / 2, r / 2);
					}(n, t.df_model, t.df_resid)
				};
			}
			function a(e, t) {
				var a = n(e, t), o = r(a), s = i(a), c = 1 - (1 - a.R2) * ((a.nobs - 1) / a.df_resid);
				return a.t = o, a.f = s, a.adjust_R2 = c, a;
			}
			return { ols: a };
		})(), e.extend({
			buildxmatrix: function() {
				for (var t = Array(arguments.length), n = 0; n < arguments.length; n++) t[n] = [1].concat(arguments[n]);
				return e(t);
			},
			builddxmatrix: function() {
				for (var t = Array(arguments[0].length), n = 0; n < arguments[0].length; n++) t[n] = [1].concat(arguments[0][n]);
				return e(t);
			},
			buildjxmatrix: function(t) {
				for (var n = Array(t.length), r = 0; r < t.length; r++) n[r] = t[r];
				return e.builddxmatrix(n);
			},
			buildymatrix: function(t) {
				return e(t).transpose();
			},
			buildjymatrix: function(e) {
				return e.transpose();
			},
			matrixmult: function(t, n) {
				var r, i, a, o, s;
				if (t.cols() == n.rows()) {
					if (n.rows() > 1) {
						for (o = [], r = 0; r < t.rows(); r++) for (o[r] = [], i = 0; i < n.cols(); i++) {
							for (s = 0, a = 0; a < t.cols(); a++) s += t.toArray()[r][a] * n.toArray()[a][i];
							o[r][i] = s;
						}
						return e(o);
					}
					for (o = [], r = 0; r < t.rows(); r++) for (o[r] = [], i = 0; i < n.cols(); i++) {
						for (s = 0, a = 0; a < t.cols(); a++) s += t.toArray()[r][a] * n.toArray()[i];
						o[r][i] = s;
					}
					return e(o);
				}
			},
			regress: function(t, n) {
				var r = e.xtranspxinv(t), i = t.transpose(), a = e.matrixmult(e(r), i);
				return e.matrixmult(a, n);
			},
			regresst: function(t, n, r) {
				var i = e.regress(t, n), a = {};
				a.anova = {};
				var o = e.jMatYBar(t, i);
				a.yBar = o;
				var s = n.mean();
				a.anova.residuals = e.residuals(n, o), a.anova.ssr = e.ssr(o, s), a.anova.msr = a.anova.ssr / (t[0].length - 1), a.anova.sse = e.sse(n, o), a.anova.mse = a.anova.sse / (n.length - (t[0].length - 1) - 1), a.anova.sst = e.sst(n, s), a.anova.mst = a.anova.sst / (n.length - 1), a.anova.r2 = 1 - a.anova.sse / a.anova.sst, a.anova.r2 < 0 && (a.anova.r2 = 0), a.anova.fratio = a.anova.msr / a.anova.mse, a.anova.pvalue = e.anovaftest(a.anova.fratio, t[0].length - 1, n.length - (t[0].length - 1) - 1), a.anova.rmse = Math.sqrt(a.anova.mse), a.anova.r2adj = 1 - a.anova.mse / a.anova.mst, a.anova.r2adj < 0 && (a.anova.r2adj = 0), a.stats = Array(t[0].length);
				for (var c = e.xtranspxinv(t), l, u, d, f = 0; f < i.length; f++) l = Math.sqrt(a.anova.mse * Math.abs(c[f][f])), u = Math.abs(i[f] / l), d = e.ttest(u, n.length - t[0].length - 1, r), a.stats[f] = [
					i[f],
					l,
					u,
					d
				];
				return a.regress = i, a;
			},
			xtranspx: function(t) {
				return e.matrixmult(t.transpose(), t);
			},
			xtranspxinv: function(t) {
				var n = e.matrixmult(t.transpose(), t);
				return e.inv(n);
			},
			jMatYBar: function(t, n) {
				return new e(e.matrixmult(t, n));
			},
			residuals: function(t, n) {
				return e.matrixsubtract(t, n);
			},
			ssr: function(e, t) {
				for (var n = 0, r = 0; r < e.length; r++) n += (e[r] - t) ** 2;
				return n;
			},
			sse: function(e, t) {
				for (var n = 0, r = 0; r < e.length; r++) n += (e[r] - t[r]) ** 2;
				return n;
			},
			sst: function(e, t) {
				for (var n = 0, r = 0; r < e.length; r++) n += (e[r] - t) ** 2;
				return n;
			},
			matrixsubtract: function(t, n) {
				for (var r = Array(t.length), i = 0; i < t.length; i++) {
					r[i] = Array(t[i].length);
					for (var a = 0; a < t[i].length; a++) r[i][a] = t[i][a] - n[i][a];
				}
				return e(r);
			}
		}), e.jStat = e, e;
	});
})), a = /* @__PURE__ */ n(((e) => {
	(function(t) {
		typeof DO_NOT_EXPORT_BESSEL > "u" ? typeof e == "object" ? t(e) : typeof define == "function" && define.amd ? define(function() {
			var e = {};
			return t(e), e;
		}) : t({}) : t({});
	})(function(e) {
		e.version = "1.0.2";
		var t = Math;
		function n(e, t) {
			for (var n = 0, r = 0; n < e.length; ++n) r = t * r + e[n];
			return r;
		}
		function r(e, t, n, r, i) {
			if (t === 0) return n;
			if (t === 1) return r;
			for (var a = 2 / e, o = r, s = 1; s < t; ++s) o = r * s * a + i * n, n = r, r = o;
			return o;
		}
		function i(e, t, n, i, a) {
			return function(n, o) {
				if (i) {
					if (n === 0) return i == 1 ? -Infinity : Infinity;
					if (n < 0) return NaN;
				}
				if (o === 0) return e(n);
				if (o === 1) return t(n);
				if (o < 0) return NaN;
				o |= 0;
				var s = e(n), c = t(n);
				return r(n, o, s, c, a);
			};
		}
		var a = (function() {
			var e = .636619772, i = [
				57568490574,
				-13362590354,
				651619640.7,
				-11214424.18,
				77392.33017,
				-184.9052456
			].reverse(), a = [
				57568490411,
				1029532985,
				9494680.718,
				59272.64853,
				267.8532712,
				1
			].reverse(), o = [
				1,
				-.001098628627,
				2734510407e-14,
				-2073370639e-15,
				2.093887211e-7
			].reverse(), s = [
				-.01562499995,
				.0001430488765,
				-6911147651e-15,
				7.621095161e-7,
				-9.34935152e-8
			].reverse();
			function c(r) {
				var c = 0, l = 0, u = 0, d = r * r;
				if (r < 8) l = n(i, d), u = n(a, d), c = l / u;
				else {
					var f = r - .785398164;
					d = 64 / d, l = n(o, d), u = n(s, d), c = t.sqrt(e / r) * (t.cos(f) * l - t.sin(f) * u * 8 / r);
				}
				return c;
			}
			var l = [
				72362614232,
				-7895059235,
				242396853.1,
				-2972611.439,
				15704.4826,
				-30.16036606
			].reverse(), u = [
				144725228442,
				2300535178,
				18583304.74,
				99447.43394,
				376.9991397,
				1
			].reverse(), d = [
				1,
				.00183105,
				-3516396496e-14,
				2457520174e-15,
				-2.40337019e-7
			].reverse(), f = [
				.04687499995,
				-.0002002690873,
				8449199096e-15,
				-8.8228987e-7,
				1.05787412e-7
			].reverse();
			function p(r) {
				var i = 0, a = 0, o = 0, s = r * r, c = t.abs(r) - 2.356194491;
				return Math.abs(r) < 8 ? (a = r * n(l, s), o = n(u, s), i = a / o) : (s = 64 / s, a = n(d, s), o = n(f, s), i = t.sqrt(e / t.abs(r)) * (t.cos(c) * a - t.sin(c) * o * 8 / t.abs(r)), r < 0 && (i = -i)), i;
			}
			return function e(n, i) {
				if (i = Math.round(i), !isFinite(n)) return isNaN(n) ? n : 0;
				if (i < 0) return (i % 2 ? -1 : 1) * e(n, -i);
				if (n < 0) return (i % 2 ? -1 : 1) * e(-n, i);
				if (i === 0) return c(n);
				if (i === 1) return p(n);
				if (n === 0) return 0;
				var a = 0;
				if (n > i) a = r(n, i, c(n), p(n), -1);
				else {
					for (var o = 2 * t.floor((i + t.floor(t.sqrt(40 * i))) / 2), s = !1, l = 0, u = 0, d = 1, f = 0, m = 2 / n, h = o; h > 0; h--) f = h * m * d - l, l = d, d = f, t.abs(d) > 1e10 && (d *= 1e-10, l *= 1e-10, a *= 1e-10, u *= 1e-10), s && (u += d), s = !s, h == i && (a = l);
					u = 2 * u - d, a /= u;
				}
				return a;
			};
		})(), o = (function() {
			var e = .636619772, r = [
				-2957821389,
				7062834065,
				-512359803.6,
				10879881.29,
				-86327.92757,
				228.4622733
			].reverse(), o = [
				40076544269,
				745249964.8,
				7189466.438,
				47447.2647,
				226.1030244,
				1
			].reverse(), s = [
				1,
				-.001098628627,
				2734510407e-14,
				-2073370639e-15,
				2.093887211e-7
			].reverse(), c = [
				-.01562499995,
				.0001430488765,
				-6911147651e-15,
				7.621095161e-7,
				-9.34945152e-8
			].reverse();
			function l(i) {
				var l = 0, u = 0, d = 0, f = i * i, p = i - .785398164;
				return i < 8 ? (u = n(r, f), d = n(o, f), l = u / d + e * a(i, 0) * t.log(i)) : (f = 64 / f, u = n(s, f), d = n(c, f), l = t.sqrt(e / i) * (t.sin(p) * u + t.cos(p) * d * 8 / i)), l;
			}
			var u = [
				-4900604943e3,
				127527439e4,
				-51534381390,
				734926455.1,
				-4237922.726,
				8511.937935
			].reverse(), d = [
				249958057e5,
				424441966400,
				3733650367,
				22459040.02,
				102042.605,
				354.9632885,
				1
			].reverse(), f = [
				1,
				.00183105,
				-3516396496e-14,
				2457520174e-15,
				-2.40337019e-7
			].reverse(), p = [
				.04687499995,
				-.0002002690873,
				8449199096e-15,
				-8.8228987e-7,
				1.05787412e-7
			].reverse();
			function m(r) {
				var i = 0, o = 0, s = 0, c = r * r, l = r - 2.356194491;
				return r < 8 ? (o = r * n(u, c), s = n(d, c), i = o / s + e * (a(r, 1) * t.log(r) - 1 / r)) : (c = 64 / c, o = n(f, c), s = n(p, c), i = t.sqrt(e / r) * (t.sin(l) * o + t.cos(l) * s * 8 / r)), i;
			}
			return i(l, m, "BESSELY", 1, -1);
		})(), s = (function() {
			var e = [
				1,
				3.5156229,
				3.0899424,
				1.2067492,
				.2659732,
				.0360768,
				.0045813
			].reverse(), r = [
				.39894228,
				.01328592,
				.00225319,
				-.00157565,
				.00916281,
				-.02057706,
				.02635537,
				-.01647633,
				.00392377
			].reverse();
			function i(i) {
				return i <= 3.75 ? n(e, i * i / (3.75 * 3.75)) : t.exp(t.abs(i)) / t.sqrt(t.abs(i)) * n(r, 3.75 / t.abs(i));
			}
			var a = [
				.5,
				.87890594,
				.51498869,
				.15084934,
				.02658733,
				.00301532,
				32411e-8
			].reverse(), o = [
				.39894228,
				-.03988024,
				-.00362018,
				.00163801,
				-.01031555,
				.02282967,
				-.02895312,
				.01787654,
				-.00420059
			].reverse();
			function s(e) {
				return e < 3.75 ? e * n(a, e * e / (3.75 * 3.75)) : (e < 0 ? -1 : 1) * t.exp(t.abs(e)) / t.sqrt(t.abs(e)) * n(o, 3.75 / t.abs(e));
			}
			return function e(n, r) {
				if (r = Math.round(r), r === 0) return i(n);
				if (r === 1) return s(n);
				if (r < 0) return NaN;
				if (t.abs(n) === 0) return 0;
				if (n == Infinity) return Infinity;
				var a = 0, o, c = 2 / t.abs(n), l = 0, u = 1, d = 0;
				for (o = 2 * t.round((r + t.round(t.sqrt(40 * r))) / 2); o > 0; o--) d = o * c * u + l, l = u, u = d, t.abs(u) > 1e10 && (u *= 1e-10, l *= 1e-10, a *= 1e-10), o == r && (a = l);
				return a *= e(n, 0) / u, n < 0 && r % 2 ? -a : a;
			};
		})(), c = (function() {
			var e = [
				-.57721566,
				.4227842,
				.23069756,
				.0348859,
				.00262698,
				1075e-7,
				74e-7
			].reverse(), r = [
				1.25331414,
				-.07832358,
				.02189568,
				-.01062446,
				.00587872,
				-.0025154,
				53208e-8
			].reverse();
			function a(i) {
				return i <= 2 ? -t.log(i / 2) * s(i, 0) + n(e, i * i / 4) : t.exp(-i) / t.sqrt(i) * n(r, 2 / i);
			}
			var o = [
				1,
				.15443144,
				-.67278579,
				-.18156897,
				-.01919402,
				-.00110404,
				-4686e-8
			].reverse(), c = [
				1.25331414,
				.23498619,
				-.0365562,
				.01504268,
				-.00780353,
				.00325614,
				-68245e-8
			].reverse();
			function l(e) {
				return e <= 2 ? t.log(e / 2) * s(e, 1) + 1 / e * n(o, e * e / 4) : t.exp(-e) / t.sqrt(e) * n(c, 2 / e);
			}
			return i(a, l, "BESSELK", 2, 1);
		})();
		e.besselj = a, e.bessely = o, e.besseli = s, e.besselk = c;
	});
})), o = /* @__PURE__ */ t({
	ABS: () => Kn,
	ACCRINT: () => xs,
	ACOS: () => qn,
	ACOSH: () => Jn,
	ACOT: () => Yn,
	ACOTH: () => Xn,
	AGGREGATE: () => Zn,
	AND: () => ec,
	ARABIC: () => Qn,
	ASIN: () => $n,
	ASINH: () => er,
	ATAN: () => tr,
	ATAN2: () => nr,
	ATANH: () => rr,
	AVEDEV: () => Mt,
	AVERAGE: () => Nt,
	AVERAGEA: () => Pt,
	AVERAGEIF: () => Ft,
	AVERAGEIFS: () => It,
	BASE: () => ir,
	BESSELI: () => ta,
	BESSELJ: () => na,
	BESSELK: () => ra,
	BESSELY: () => ia,
	BETA: () => Lt,
	BETADIST: () => Xa,
	BETAINV: () => Za,
	BIN2DEC: () => aa,
	BIN2HEX: () => oa,
	BIN2OCT: () => sa,
	BINOM: () => Rt,
	BINOMDIST: () => Qa,
	BITAND: () => ca,
	BITLSHIFT: () => la,
	BITOR: () => ua,
	BITRSHIFT: () => da,
	BITXOR: () => fa,
	CEILING: () => ar,
	CEILINGMATH: () => $a,
	CEILINGPRECISE: () => eo,
	CHAR: () => at,
	CHIDIST: () => to,
	CHIDISTRT: () => no,
	CHIINV: () => ro,
	CHIINVRT: () => io,
	CHISQ: () => W,
	CHITEST: () => ao,
	CHOOSE: () => Be,
	CHOOSECOLS: () => Ve,
	CHOOSEROWS: () => He,
	CLEAN: () => ot,
	CODE: () => st,
	COLUMN: () => Ue,
	COLUMNS: () => We,
	COMBIN: () => or,
	COMBINA: () => sr,
	COMPLEX: () => X,
	CONCAT: () => lt,
	CONCATENATE: () => ct,
	CONFIDENCE: () => zt,
	CONVERT: () => pa,
	CORREL: () => Bt,
	COS: () => cr,
	COSH: () => lr,
	COT: () => ur,
	COTH: () => dr,
	COUNT: () => Vt,
	COUNTA: () => Ht,
	COUNTBLANK: () => Ut,
	COUNTIF: () => Wt,
	COUNTIFS: () => Gt,
	COUPDAYS: () => Ss,
	COVAR: () => oo,
	COVARIANCE: () => Kt,
	COVARIANCEP: () => so,
	COVARIANCES: () => co,
	CRITBINOM: () => lo,
	CSC: () => fr,
	CSCH: () => pr,
	CUMIPMT: () => Cs,
	CUMPRINC: () => ws,
	DATE: () => Oi,
	DATEDIF: () => ki,
	DATEVALUE: () => Ai,
	DAVERAGE: () => is,
	DAY: () => ji,
	DAYS: () => Ni,
	DAYS360: () => Pi,
	DB: () => Ts,
	DCOUNT: () => as,
	DCOUNTA: () => os,
	DDB: () => Es,
	DEC2BIN: () => ma,
	DEC2HEX: () => ha,
	DEC2OCT: () => ga,
	DECIMAL: () => mr,
	DEGREES: () => hr,
	DELTA: () => _a,
	DEVSQ: () => qt,
	DGET: () => ss,
	DISC: () => Ds,
	DMAX: () => cs,
	DMIN: () => ls,
	DOLLAR: () => ut,
	DOLLARDE: () => Os,
	DOLLARFR: () => ks,
	DPRODUCT: () => us,
	DROP: () => Ge,
	DSTDEV: () => ds,
	DSTDEVP: () => fs,
	DSUM: () => ps,
	DVAR: () => ms,
	DVARP: () => hs,
	EDATE: () => Fi,
	EFFECT: () => As,
	EOMONTH: () => Ii,
	ERF: () => va,
	ERFC: () => ya,
	ERFCPRECISE: () => uo,
	ERFPRECISE: () => fo,
	ERROR: () => Ee,
	EVEN: () => gr,
	EXACT: () => dt,
	EXP: () => _r,
	EXPAND: () => Ke,
	EXPON: () => Jt,
	EXPONDIST: () => po,
	F: () => G,
	FACT: () => yr,
	FACTDOUBLE: () => br,
	FALSE: () => tc,
	FDIST: () => mo,
	FDISTRT: () => ho,
	FIND: () => ft,
	FINV: () => go,
	FINVRT: () => _o,
	FISHER: () => Yt,
	FISHERINV: () => Xt,
	FIXED: () => pt,
	FLOOR: () => xr,
	FLOORMATH: () => vo,
	FLOORPRECISE: () => yo,
	FORECAST: () => Zt,
	FREQUENCY: () => Qt,
	FTEST: () => bo,
	FV: () => js,
	FVSCHEDULE: () => Ms,
	GAMMA: () => $t,
	GAMMADIST: () => xo,
	GAMMAINV: () => So,
	GAMMALN: () => en,
	GAMMALNPRECISE: () => Co,
	GAUSS: () => tn,
	GCD: () => Sr,
	GEOMEAN: () => nn,
	GESTEP: () => ba,
	GROWTH: () => rn,
	HARMEAN: () => an,
	HEX2BIN: () => xa,
	HEX2DEC: () => Sa,
	HEX2OCT: () => Ca,
	HLOOKUP: () => qe,
	HOUR: () => Li,
	HSTACK: () => rt,
	HYPGEOM: () => on,
	HYPGEOMDIST: () => wo,
	IF: () => nc,
	IFERROR: () => ic,
	IFNA: () => ac,
	IFS: () => rc,
	IMABS: () => wa,
	IMAGINARY: () => Z,
	IMARGUMENT: () => Ta,
	IMCONJUGATE: () => Ea,
	IMCOS: () => Da,
	IMCOSH: () => Oa,
	IMCOT: () => ka,
	IMCSC: () => Ha,
	IMCSCH: () => Ua,
	IMDIV: () => Aa,
	IMEXP: () => ja,
	IMLN: () => Ma,
	IMLOG10: () => Na,
	IMLOG2: () => Pa,
	IMPOWER: () => Fa,
	IMPRODUCT: () => Ia,
	IMREAL: () => Q,
	IMSEC: () => La,
	IMSECH: () => Ra,
	IMSIN: () => za,
	IMSINH: () => Ba,
	IMSQRT: () => Va,
	IMSUB: () => Wa,
	IMSUM: () => Ga,
	IMTAN: () => Ka,
	INDEX: () => Je,
	INT: () => Cr,
	INTERCEPT: () => sn,
	IPMT: () => Ns,
	IRR: () => Ps,
	ISBLANK: () => De,
	ISERR: () => Oe,
	ISERROR: () => ke,
	ISEVEN: () => Ae,
	ISLOGICAL: () => je,
	ISNA: () => Me,
	ISNONTEXT: () => Ne,
	ISNUMBER: () => Pe,
	ISO: () => wr,
	ISODD: () => Fe,
	ISOWEEKNUM: () => Ri,
	ISPMT: () => Fs,
	ISTEXT: () => Ie,
	KURT: () => cn,
	LARGE: () => ln,
	LCM: () => Tr,
	LEFT: () => mt,
	LEN: () => ht,
	LINEST: () => un,
	LN: () => Er,
	LOG: () => Dr,
	LOG10: () => Or,
	LOGEST: () => dn,
	LOGINV: () => To,
	LOGNORM: () => fn,
	LOGNORMDIST: () => Eo,
	LOGNORMINV: () => Do,
	LOOKUP: () => Ye,
	LOWER: () => gt,
	MATCH: () => Xe,
	MAX: () => pn,
	MAXA: () => mn,
	MAXIFS: () => hn,
	MEDIAN: () => gn,
	MID: () => _t,
	MIN: () => _n,
	MINA: () => vn,
	MINIFS: () => yn,
	MINUTE: () => zi,
	MIRR: () => Is,
	MMULT: () => kr,
	MOD: () => Ar,
	MODE: () => bn,
	MODEMULT: () => Oo,
	MODESNGL: () => ko,
	MONTH: () => Bi,
	MROUND: () => jr,
	MULTINOMIAL: () => Mr,
	MUNIT: () => Nr,
	N: () => Le,
	NA: () => Re,
	NEGBINOM: () => xn,
	NEGBINOMDIST: () => Ao,
	NETWORKDAYS: () => Vi,
	NETWORKDAYSINTL: () => jo,
	NOMINAL: () => Ls,
	NORM: () => K,
	NORMDIST: () => Mo,
	NORMINV: () => No,
	NORMSDIST: () => Po,
	NORMSINV: () => Fo,
	NOT: () => oc,
	NOW: () => Hi,
	NPER: () => Rs,
	NPV: () => zs,
	NUMBERVALUE: () => vt,
	OCT2BIN: () => qa,
	OCT2DEC: () => Ja,
	OCT2HEX: () => Ya,
	ODD: () => Pr,
	OR: () => sc,
	PDURATION: () => Bs,
	PEARSON: () => Sn,
	PERCENTILE: () => q,
	PERCENTILEEXC: () => Io,
	PERCENTILEINC: () => Lo,
	PERCENTRANK: () => Cn,
	PERCENTRANKEXC: () => Ro,
	PERCENTRANKINC: () => zo,
	PERMUT: () => wn,
	PERMUTATIONA: () => Tn,
	PHI: () => En,
	PI: () => Fr,
	PMT: () => Vs,
	POISSON: () => Dn,
	POISSONDIST: () => Bo,
	POWER: () => Ir,
	PPMT: () => Hs,
	PRICEDISC: () => Us,
	PROB: () => On,
	PRODUCT: () => Lr,
	PROPER: () => yt,
	PV: () => Ws,
	QUARTILE: () => kn,
	QUARTILEEXC: () => Vo,
	QUARTILEINC: () => Ho,
	QUOTIENT: () => Rr,
	RADIANS: () => zr,
	RAND: () => Br,
	RANDBETWEEN: () => Vr,
	RANK: () => An,
	RANKAVG: () => Uo,
	RANKEQ: () => Wo,
	RATE: () => Gs,
	REPLACE: () => bt,
	REPT: () => H,
	RIGHT: () => xt,
	ROMAN: () => Hr,
	ROUND: () => Wr,
	ROUNDDOWN: () => Gr,
	ROUNDUP: () => Kr,
	ROW: () => jn,
	ROWS: () => Ze,
	RRI: () => Ks,
	RSQ: () => Mn,
	SEARCH: () => St,
	SEC: () => qr,
	SECH: () => Jr,
	SECOND: () => Ui,
	SERIESSUM: () => Yr,
	SIGN: () => Xr,
	SIN: () => Zr,
	SINH: () => Qr,
	SKEW: () => Nn,
	SKEWP: () => Go,
	SLN: () => qs,
	SLOPE: () => Pn,
	SMALL: () => Fn,
	SORT: () => Qe,
	SQRT: () => $r,
	SQRTPI: () => ei,
	STANDARDIZE: () => In,
	STDEV: () => J,
	STDEVA: () => Ln,
	STDEVP: () => Ko,
	STDEVPA: () => Rn,
	STDEVS: () => qo,
	STEYX: () => zn,
	SUBSTITUTE: () => Ct,
	SUBTOTAL: () => ti,
	SUM: () => ni,
	SUMIF: () => ri,
	SUMIFS: () => ii,
	SUMPRODUCT: () => ai,
	SUMSQ: () => oi,
	SUMX2MY2: () => si,
	SUMX2PY2: () => ci,
	SUMXMY2: () => li,
	SWITCH: () => uc,
	SYD: () => Js,
	T: () => U,
	TAKE: () => $e,
	TAN: () => ui,
	TANH: () => di,
	TBILLEQ: () => Ys,
	TBILLPRICE: () => Xs,
	TBILLYIELD: () => Zs,
	TDIST: () => Jo,
	TDISTRT: () => Yo,
	TEXT: () => wt,
	TEXTJOIN: () => Tt,
	TIME: () => Wi,
	TIMEVALUE: () => Gi,
	TINV: () => Xo,
	TODAY: () => Ki,
	TRANSPOSE: () => et,
	TREND: () => Bn,
	TRIM: () => Et,
	TRIMMEAN: () => Vn,
	TRUE: () => cc,
	TRUNC: () => fi,
	TTEST: () => Zo,
	TYPE: () => ze,
	UNICHAR: () => Dt,
	UNICODE: () => Ot,
	UNIQUE: () => tt,
	UPPER: () => kt,
	VALUE: () => At,
	VAR: () => Y,
	VARA: () => Hn,
	VARP: () => Qo,
	VARPA: () => Un,
	VARS: () => $o,
	VLOOKUP: () => nt,
	VSTACK: () => it,
	WEEKDAY: () => qi,
	WEEKNUM: () => Ji,
	WEIBULL: () => Wn,
	WEIBULLDIST: () => es,
	WORKDAY: () => Yi,
	WORKDAYINTL: () => ts,
	XIRR: () => Qs,
	XNPV: () => $s,
	XOR: () => lc,
	YEAR: () => Xi,
	YEARFRAC: () => $i,
	Z: () => Gn,
	ZTEST: () => ns,
	utils: () => dc
}), s = /* @__PURE__ */ e(i(), 1), c = /* @__PURE__ */ e(a(), 1), l = /* @__PURE__ */ Error("#NULL!"), u = /* @__PURE__ */ Error("#DIV/0!"), d = /* @__PURE__ */ Error("#VALUE!"), f = /* @__PURE__ */ Error("#REF!"), p = /* @__PURE__ */ Error("#NAME?"), m = /* @__PURE__ */ Error("#NUM!"), h = /* @__PURE__ */ Error("#N/A"), g = /* @__PURE__ */ Error("#ERROR!"), _ = /* @__PURE__ */ Error("#GETTING_DATA"), v = /* @__PURE__ */ Error("#CALC!"), y = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	calc: v,
	data: _,
	div0: u,
	error: g,
	na: h,
	name: p,
	nil: l,
	num: m,
	ref: f,
	value: d
}), b = !1;
function x() {
	b = !0;
}
function S() {
	b = !1;
}
function ee(e) {
	e < 60 && (e += 1);
	let t = Math.floor(e - 25569) * 86400, n = /* @__PURE__ */ new Date(t * 1e3), r = e - Math.floor(e) + 1e-7, i = Math.floor(86400 * r), a = i % 60;
	i -= a;
	let o = Math.floor(i / 3600), s = Math.floor(i / 60) % 60, c = n.getUTCDate(), l = n.getUTCMonth();
	return e >= 60 && e < 61 && (c = 29, l = 1), new Date(n.getUTCFullYear(), l, c, o, s, a);
}
function C(e) {
	let t = new Date(1900, 0, 1), n = e > -22038912e5 ? 2 : 1;
	return Math.ceil((e - t) / 864e5) + n;
}
var te = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	dateToSerial: C,
	get returnSerial() {
		return b;
	},
	serialToDate: ee,
	useDate: S,
	useSerial: x
}), w = "=", ne = [
	">",
	">=",
	"<",
	"<=",
	"=",
	"<>"
], T = "operator", E = "literal", D = [T, E], O = T, k = E;
function A(e, t) {
	if (D.indexOf(t) === -1) throw Error("Unsupported token type: " + t);
	return {
		value: e,
		type: t
	};
}
function re(e) {
	return typeof e == "string" && /^\d+(\.\d+)?$/.test(e) && (e = e.indexOf(".") === -1 ? parseInt(e, 10) : parseFloat(e)), e;
}
function ie(e) {
	let t = e.length, n = [], r = 0, i = "", a = "";
	for (; r < t;) {
		let t = e.charAt(r);
		switch (t) {
			case ">":
			case "<":
			case "=":
				a += t, i.length > 0 && (n.push(i), i = "");
				break;
			default:
				a.length > 0 && (n.push(a), a = ""), i += t;
				break;
		}
		r++;
	}
	return i.length > 0 && n.push(i), a.length > 0 && n.push(a), n;
}
function ae(e) {
	let t = "", n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		r === 0 && ne.indexOf(i) >= 0 ? n.push(A(i, O)) : t += i;
	}
	return t.length > 0 && n.push(A(re(t), k)), n.length > 0 && n[0].type !== O && n.unshift(A(w, O)), n;
}
function oe(e) {
	let t = [], n;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		switch (i.type) {
			case O:
				n = i.value;
				break;
			case k:
				t.push(i.value);
				break;
		}
	}
	return se(t, n);
}
function se(e, t) {
	let n = !1;
	switch (t) {
		case ">":
			n = e[0] > e[1];
			break;
		case ">=":
			n = e[0] >= e[1];
			break;
		case "<":
			n = e[0] < e[1];
			break;
		case "<=":
			n = e[0] <= e[1];
			break;
		case "=":
			n = e[0] == e[1];
			break;
		case "<>":
			n = e[0] != e[1];
			break;
	}
	return n;
}
function ce(e) {
	return ae(ie(e));
}
var le = oe;
function ue(e) {
	let t = [];
	return j(e, (e) => {
		t.push(e);
	}), t;
}
function j(e, t) {
	let n = -1, r = e.length;
	for (; ++n < r && t(e[n], n, e) !== !1;);
	return e;
}
function de(e) {
	let t = e.length, n;
	for (; t--;) if (n = e[t], typeof n != "number") {
		if (n === !0) {
			e[t] = 1;
			continue;
		}
		if (n === !1) {
			e[t] = 0;
			continue;
		}
		if (typeof n == "string") {
			let r = R(n);
			e[t] = r instanceof Error ? 0 : r;
		}
	}
	return e;
}
function fe(e) {
	return [e.length, e.reduce((e, t) => Math.max(e, t.length), 0)];
}
function pe(e, t) {
	let n = [e, t];
	return n.some((e) => !V(e)) ? h : n.some((e) => e <= 0) ? d : Array.from({ length: e }, () => Array.from({ length: t }, () => void 0));
}
function me(e, t) {
	if (!e) return d;
	(!e.every((e) => Array.isArray(e)) || e.length === 0) && (e = [[...e]]), e.map((t, n) => {
		t.map((t, r) => {
			t || (e[n][r] = 0);
		});
	});
	let n = e.reduce((t, n, r) => n.length > e[t].length ? r : t, 0), r = e[n].length;
	return e.map((e) => [...e, ...Array(r - e.length).fill(0)]);
}
function M() {
	let e;
	if (arguments.length === 1) {
		let t = arguments[0];
		e = _e(t) ? ue.apply(null, arguments) : [t];
	} else e = Array.from(arguments);
	for (; !ve(e);) e = he(e);
	return e;
}
function he(e) {
	return !e || !e.reduce ? [e] : e.reduce((e, t) => {
		let n = Array.isArray(e), r = Array.isArray(t);
		return n && r ? e.concat(t) : n ? (e.push(t), e) : r ? [e].concat(t) : [e, t];
	});
}
function ge(e, t) {
	return t ||= 1, !e || typeof e.slice != "function" ? e : e.slice(0, e.length - t);
}
function _e(e) {
	return e != null && typeof e.length == "number" && typeof e != "string";
}
function ve(e) {
	if (!e) return !1;
	for (let t = 0; t < e.length; ++t) if (Array.isArray(e[t])) return !1;
	return !0;
}
function N(e, t) {
	return t ||= 1, !e || typeof e.slice != "function" ? e : e.slice(t);
}
function ye(e) {
	return e ? e[0].map((t, n) => e.map((e) => e[n])) : d;
}
function P(e, t) {
	let n = null;
	return j(e, (e, r) => {
		if (e[0] === t) return n = r, !1;
	}), n ?? d;
}
function F() {
	for (let e = 0; e < arguments.length; e++) if (arguments[e] instanceof Error) return arguments[e];
}
function I() {
	let e = arguments.length;
	for (; e--;) if (arguments[e] instanceof Error) return !0;
	return !1;
}
function be(e) {
	let t = 0x5af3107a4000;
	return Math.round(e * t) / t;
}
function xe() {
	return M.apply(null, arguments).filter((e) => typeof e == "number");
}
function Se(e) {
	if (typeof e == "boolean" || e instanceof Error) return e;
	if (typeof e == "number") return e !== 0;
	if (typeof e == "string") {
		let t = e.toUpperCase();
		if (t === "TRUE") return !0;
		if (t === "FALSE") return !1;
	}
	return e instanceof Date && !isNaN(e) || d;
}
function L(e) {
	if (!isNaN(e)) {
		if (e instanceof Date) return new Date(e);
		let t = parseFloat(e);
		return t < 0 || t >= 2958466 ? m : ee(t);
	}
	return typeof e == "string" && (e = /(\d{4})-(\d\d?)-(\d\d?)$/.test(e) ? /* @__PURE__ */ new Date(e + "T00:00:00.000") : new Date(e), !isNaN(e)) ? e : d;
}
function Ce(e) {
	let t = e.length, n;
	for (; t--;) {
		if (n = L(e[t]), n === d) return n;
		e[t] = n;
	}
	return e;
}
function R(e) {
	return e instanceof Error ? e : e == null ? 0 : (typeof e == "boolean" && (e = +e), !isNaN(e) && e !== "" ? parseFloat(e) : d);
}
function z(e) {
	let t;
	if (!e || (t = e.length) === 0) return d;
	let n;
	for (; t--;) {
		if (e[t] instanceof Error) return e[t];
		if (n = R(e[t]), n instanceof Error) return n;
		e[t] = n;
	}
	return e;
}
function B(e) {
	return e instanceof Error ? e : e == null ? "" : e.toString();
}
function we() {
	let e = arguments.length;
	for (; e--;) if (typeof arguments[e] == "string") return !0;
	return !1;
}
function Te() {
	let e = ue(arguments), t = z(M(e.shift()));
	if (t instanceof Error) return t;
	let n = e, r = n.length / 2;
	for (let e = 0; e < r; e++) n[e * 2] = M(n[e * 2]);
	let i = [];
	for (let e = 0; e < t.length; e++) {
		let a = !1;
		for (let t = 0; t < r; t++) {
			let r = n[t * 2][e], i = n[t * 2 + 1], o = i === void 0 || i === "*", s = !1;
			if (o) s = !0;
			else {
				let e = ce(i + "");
				s = le([A(r, k)].concat(e));
			}
			if (!s) {
				a = !1;
				break;
			}
			a = !0;
		}
		a && i.push(t[e]);
	}
	return i;
}
function V(e) {
	return e != null;
}
var Ee = {};
Ee.TYPE = (e) => {
	switch (e) {
		case l: return 1;
		case u: return 2;
		case d: return 3;
		case f: return 4;
		case p: return 5;
		case m: return 6;
		case h: return 7;
		case _: return 8;
	}
	return h;
};
function De(e) {
	return e === null;
}
function Oe(e) {
	return [
		d,
		f,
		u,
		m,
		p,
		l
	].indexOf(e) >= 0 || typeof e == "number" && (isNaN(e) || !isFinite(e));
}
function ke(e) {
	return Oe(e) || e === h;
}
function Ae(e) {
	return !(Math.floor(Math.abs(e)) & 1);
}
function je(e) {
	return e === !0 || e === !1;
}
function Me(e) {
	return e === h;
}
function Ne(e) {
	return typeof e != "string";
}
function Pe(e) {
	return typeof e == "number" && !isNaN(e) && isFinite(e);
}
function Fe(e) {
	return !!(Math.floor(Math.abs(e)) & 1);
}
function Ie(e) {
	return typeof e == "string";
}
function Le(e) {
	return Pe(e) ? e : e instanceof Date ? e.getTime() : e === !0 ? 1 : e === !1 ? 0 : ke(e) ? e : 0;
}
function Re() {
	return h;
}
function ze(e) {
	if (Pe(e)) return 1;
	if (Ie(e)) return 2;
	if (je(e)) return 4;
	if (ke(e)) return 16;
	if (Array.isArray(e)) return 64;
}
function Be() {
	if (arguments.length < 2) return h;
	let e = arguments[0];
	return e < 1 || e > 254 || arguments.length < e + 1 ? d : arguments[e];
}
function Ve(e, t, ...n) {
	if (!Array.isArray(e)) return d;
	let r = M([t, ...n]), [i, a] = fe(e);
	if (r.some((e) => {
		if (!V(e)) return !0;
		let t = Math.abs(e);
		return !(0 < t && t <= a);
	})) return d;
	let o = r.map((e) => e < 0 ? e + a + 1 : e), s = Array(i);
	for (let t = 0; t < i; t++) {
		s[t] = Array(o.length);
		for (let n = 0; n < o.length; n++) s[t][n] = e[t][o[n] - 1] ?? 0;
	}
	return s;
}
function He(e, t, ...n) {
	if (!Array.isArray(e)) return d;
	let r = M([t, ...n]);
	return r.some((t) => {
		if (!V(t)) return !0;
		let n = Math.abs(t);
		return !(0 < n && n <= e.length);
	}) ? d : r.map((t) => t < 0 ? t + e.length + 1 : t).reduce((t, n) => {
		let r = [...e[--n]].map((e) => V(e) ? e : 0);
		return t.push(r), t;
	}, []);
}
function Ue(e, t) {
	if (arguments.length !== 2) return h;
	if (t < 0) return m;
	if (!(e instanceof Array) || typeof t != "number") return d;
	if (e.length !== 0) return s.default.col(e, t);
}
function We(e) {
	return arguments.length === 1 ? e instanceof Array ? e.length === 0 ? 0 : s.default.cols(e) : d : h;
}
function Ge(e, t, n) {
	if (I(e, t, n)) return F(e, t, n);
	if (!(e instanceof Array)) return d;
	let r = [], [i, a] = fe(e), o = 0, s = i;
	if (typeof t == "number") {
		if (Math.abs(t) > i) return v;
		t > 0 ? o = t : t < 0 && (s += t);
	}
	let c = 0, l = a;
	if (typeof n == "number") {
		if (Math.abs(n) > a) return v;
		n > 0 ? c = n : n < 0 && (l += n);
	}
	for (let t = o; t < s; t++) {
		let n = [...e[t].slice(c, l).map((e) => e ?? 0)];
		r.push(n);
	}
	return r;
}
function Ke(e, t, n, r) {
	let [i, a] = fe(e);
	if (V(t) || (t = i), V(n) || (n = a), t < i || n < a) return d;
	let o = pe(t, n);
	for (let s = 0; s < t; s++) for (let t = 0; t < n; t++) {
		let n = e[s]?.[t];
		V(n) || (n = s < i && t < a ? 0 : r ?? h), o[s][t] = n;
	}
	return o;
}
function qe(e, t, n, r) {
	return nt(e, ye(t), n, r);
}
function Je(e, t, n) {
	let r = F(e, t, n);
	if (r) return r;
	if (!Array.isArray(e)) return d;
	let i = e.length > 0 && !Array.isArray(e[0]);
	return i && !n ? (n = t, t = 1) : (n ||= 1, t ||= 1), n < 0 || t < 0 ? d : i && t === 1 && n <= e.length ? e[n - 1] : t <= e.length && n <= e[t - 1].length ? e[t - 1][n - 1] : f;
}
function Ye(e, t, n) {
	t = M(t), n = n ? M(n) : t;
	let r = typeof e == "number", i = h;
	for (let a = 0; a < t.length; a++) if (t[a] === e) return n[a];
	else if (r && t[a] <= e || typeof t[a] == "string" && t[a].localeCompare(e) < 0) i = n[a];
	else if (r && t[a] > e) return i;
	return i;
}
function Xe(e, t, n) {
	if (!e && e !== 0 || !t || (arguments.length === 2 && (n = 1), t = M(t), !(t instanceof Array)) || n !== -1 && n !== 0 && n !== 1) return h;
	let r, i;
	for (let a = 0; a < t.length; a++) if (n === 1) {
		if (t[a] === e) return a + 1;
		t[a] < e && (i ? t[a] > i && (r = a + 1, i = t[a]) : (r = a + 1, i = t[a]));
	} else if (n === 0) {
		if (typeof e == "string" && typeof t[a] == "string") {
			let n = e.toLowerCase().replace(/\?/g, ".").replace(/\*/g, ".*").replace(/~/g, "\\").replace(/\+/g, "\\+").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
			if (RegExp("^" + n + "$").test(t[a].toLowerCase())) return a + 1;
		} else if (t[a] === e) return a + 1;
	} else if (n === -1) {
		if (t[a] === e) return a + 1;
		t[a] > e && (i ? t[a] < i && (r = a + 1, i = t[a]) : (r = a + 1, i = t[a]));
	}
	return r || h;
}
function Ze(e) {
	return arguments.length === 1 ? e instanceof Array ? e.length === 0 ? 0 : s.default.rows(e) : d : h;
}
function Qe(e, t = 1, n = 1, r = !1) {
	if (!e || !Array.isArray(e)) return h;
	if (e.length === 0) return 0;
	if (t = R(t), !t || t < 1 || (n = R(n), n !== 1 && n !== -1)) return d;
	if (r = Se(r), typeof r != "boolean") return p;
	let i = (e) => e.sort((e, r) => (e = B(e[t - 1]), r = B(r[t - 1]), n === 1 ? e < r ? n * -1 : n : e > r ? n : n * -1)), a = me(e), o = r ? ye(a) : a;
	return t >= 1 && t <= o[0].length ? r ? ye(i(o)) : i(o) : d;
}
function $e(e, t, n) {
	if (I(e, t, n)) return F(e, t, n);
	if (!(e instanceof Array)) return d;
	let [r, i] = fe(e), a = 0, o = r - 1;
	if (typeof t == "number") {
		if (t === 0) return v;
		Math.abs(t) <= r && (t < 0 ? a = r + t : o = t - 1);
	}
	let s = 0, c = i - 1;
	if (typeof n == "number") {
		if (n === 0) return v;
		Math.abs(n) <= i && (n < 0 ? s = i + n : c = n - 1);
	}
	let l = pe(o - a + 1, c - s + 1), u = -1, f;
	for (let t = a; t <= o; t++) {
		u++, f = -1;
		for (let n = s; n <= c; n++) l[u][++f] = e[t]?.[n] ?? 0;
	}
	return l;
}
function et(e) {
	return e ? ye(me(e)) : h;
}
function tt() {
	let e = [];
	for (let t = 0; t < arguments.length; ++t) {
		let n = !1, r = arguments[t];
		for (let t = 0; t < e.length && (n = e[t] === r, !n); ++t);
		n || e.push(r);
	}
	return e;
}
function nt(e, t, n, r) {
	if (!t || !n) return h;
	r = !(r === 0 || r === !1);
	let i = h, a = !1, o = typeof e == "number", s = typeof e == "string" ? e.toLowerCase() : e;
	for (let c = 0; c < t.length; c++) {
		let l = t[c], u = typeof l[0] == "string" ? l[0].toLowerCase() : l[0];
		if (u === s) {
			i = n < l.length + 1 ? l[n - 1] : f;
			break;
		} else !a && (o && r && u <= e || r && typeof u == "string" && u.localeCompare(e) < 0) && (i = n < l.length + 1 ? l[n - 1] : f);
		o && u > e && (a = !0);
	}
	return i;
}
function rt(e, ...t) {
	let n = [e, ...t], r = 0, i = 0, a = [];
	for (let e of n) {
		let [t, n] = fe(e);
		r = Math.max(r, t), i += n, a.push(n);
	}
	let o = Array.from({ length: r }, () => Array(i)), s = 0;
	for (let e = 0; e < n.length; e++) {
		let t = n[e], i = a[e];
		for (let e = 0; e < i; e++) {
			for (let n = 0; n < r; n++) o[n][s] = t[n]?.[e] ?? (n < t.length ? 0 : h);
			s++;
		}
	}
	return o;
}
function it(e, ...t) {
	let n = [e, ...t], r = 0, i = 0;
	for (let e of n) {
		let [t, n] = fe(e);
		r = Math.max(r, n), i += t;
	}
	let a = Array(i), o, s = -1;
	for (; (o = n.shift()) !== void 0;) for (let e = 0; e < o.length; e++) {
		a[++s] = Array(r);
		for (let t = 0; t < r; t++) a[s][t] = o[e][t] ?? (t < o[e].length ? 0 : h);
	}
	return a;
}
function at(e) {
	return e = R(e), e === 0 ? d : e instanceof Error ? e : String.fromCharCode(e);
}
function ot(e) {
	return I(e) ? e : (e ||= "", e.replace(/[\0-\x1F]/g, ""));
}
function st(e) {
	if (I(e)) return e;
	e ||= "";
	let t = e.charCodeAt(0);
	return isNaN(t) && (t = d), t;
}
function ct() {
	let e = M(arguments), t = F.apply(void 0, e);
	if (t) return t;
	let n = 0;
	for (; (n = e.indexOf(!0)) > -1;) e[n] = "TRUE";
	let r = 0;
	for (; (r = e.indexOf(!1)) > -1;) e[r] = "FALSE";
	return e.join("");
}
var lt = ct;
function ut(e, t = 2) {
	if (e = R(e), isNaN(e)) return d;
	e = Wr(e, t);
	let n = {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: t >= 0 ? t : 0,
		maximumFractionDigits: t >= 0 ? t : 0
	}, r = e.toLocaleString("en-US", n);
	return e < 0 ? "$(" + r.slice(2) + ")" : r;
}
function dt(e, t) {
	return arguments.length === 2 ? F(e, t) || (e = B(e), t = B(t), e === t) : h;
}
function ft(e, t, n) {
	if (arguments.length < 2) return h;
	e = B(e), t = B(t), n = n === void 0 ? 0 : n;
	let r = t.indexOf(e, n - 1);
	return r === -1 ? d : r + 1;
}
function pt(e, t = 2, n = !1) {
	if (e = R(e), isNaN(e) || (t = R(t), isNaN(t))) return d;
	if (t < 0) {
		let n = 10 ** -t;
		e = Math.round(e / n) * n;
	} else e = e.toFixed(t);
	if (n) e = e.toString().replace(/,/g, "");
	else {
		let t = e.toString().split(".");
		t[0] = t[0].replace(/\B(?=(\d{3})+$)/g, ","), e = t.join(".");
	}
	return e;
}
function mt(e, t) {
	return F(e, t) || (e = B(e), t = t === void 0 ? 1 : t, t = R(t), t instanceof Error || typeof e != "string" ? d : e.substring(0, t));
}
function ht(e) {
	return arguments.length === 0 ? g : e instanceof Error ? e : Array.isArray(e) ? d : B(e).length;
}
function gt(e) {
	return arguments.length === 1 ? (e = B(e), I(e) ? e : e.toLowerCase()) : d;
}
function _t(e, t, n) {
	if (I(e, t, n)) return F(e, t, n);
	let r = [t, n].map((e) => R(e));
	if (!r.every((e) => !(e instanceof Error) && e > 0)) return d;
	V(e) ? typeof e != "string" && (e = String(e)) : e = "", [t, n] = r;
	let i = t - 1, a = i + n;
	return e.substring(i, a);
}
function vt(e, t, n) {
	return e = V(e) ? e : "", typeof e == "number" ? e : typeof e == "string" ? (t = t === void 0 ? "." : t, n = n === void 0 ? "," : n, Number(e.replace(t, ".").replace(n, ""))) : h;
}
function yt(e) {
	return I(e) ? e : isNaN(e) && typeof e == "number" ? d : (e = B(e), e.replace(/\w\S*/g, (e) => e.charAt(0).toUpperCase() + e.substr(1).toLowerCase()));
}
function bt(e, t, n, r) {
	return t = R(t), n = R(n), I(t, n) || typeof e != "string" || typeof r != "string" ? d : e.substr(0, t - 1) + r + e.substr(t - 1 + n);
}
function H(e, t) {
	return F(e, t) || (e = B(e), t = R(t), t instanceof Error ? t : Array(t + 1).join(e));
}
function xt(e, t) {
	return F(e, t) || (e = B(e), t = t === void 0 ? 1 : t, t = R(t), t instanceof Error ? t : e.substring(e.length - t));
}
function St(e, t, n) {
	let r;
	return typeof e != "string" || typeof t != "string" ? d : (n = n === void 0 ? 0 : n, r = t.toLowerCase().indexOf(e.toLowerCase(), n - 1) + 1, r === 0 ? d : r);
}
function Ct(e, t, n, r) {
	if (arguments.length < 3) return h;
	if (!e || !t) return e;
	if (r === void 0) return e.split(t).join(n);
	{
		if (r = Math.floor(Number(r)), Number.isNaN(r) || r <= 0) return d;
		let i = 0, a = 0;
		for (; i > -1 && e.indexOf(t, i) > -1;) if (i = e.indexOf(t, i + 1), a++, i > -1 && a === r) return e.substring(0, i) + n + e.substring(i + t.length);
		return e;
	}
}
function U(e) {
	return e instanceof Error || typeof e == "string" ? e : "";
}
function wt(e, t) {
	if (e === void 0 || e instanceof Error || t instanceof Error) return h;
	if (e instanceof Date) return e.toISOString().slice(0, 10);
	if (t == null) return "";
	if (typeof t == "number") return String(t);
	if (typeof t != "string") return d;
	let n = t.startsWith("$") ? "$" : "", r = t.endsWith("%");
	t = t.replace(/%/g, "").replace(/\$/g, "");
	let i = t.includes(".") ? t.split(".")[1].match(/0/g).length : 0, a = !t.includes(",");
	return r && (e *= 100), e = pt(e, i, a), e.startsWith("-") ? (e = e.replace("-", ""), e = "-" + n + e) : e = n + e, r && (e += "%"), e;
}
function Tt(e, t, ...n) {
	if (typeof t != "boolean" && (t = Se(t)), arguments.length < 3) return h;
	e ??= "";
	let r = M(n), i = t ? r.filter((e) => e) : r;
	if (Array.isArray(e)) {
		e = M(e);
		let t = i.map((e) => [e]), n = 0;
		for (let r = 0; r < t.length - 1; r++) t[r].push(e[n]), n++, n === e.length && (n = 0);
		return i = M(t), i.join("");
	}
	return i.join(e);
}
function Et(e) {
	return e = B(e), e instanceof Error ? e : e.replace(/\s+/g, " ").trim();
}
var Dt = at, Ot = st;
function kt(e) {
	return e = B(e), e instanceof Error ? e : e.toUpperCase();
}
function At(e) {
	let t = F(e);
	if (t) return t;
	if (typeof e == "number") return e;
	if (V(e) || (e = ""), typeof e != "string") return d;
	let n = /(%)$/.test(e) || /^(%)/.test(e);
	if (e = e.replace(/^[^0-9-]{0,3}/, ""), e = e.replace(/[^0-9]{0,3}$/, ""), e = e.replace(/[ ,]/g, ""), e === "") return 0;
	let r = Number(e);
	return isNaN(r) ? d : (r ||= 0, n && (r *= .01), r);
}
var jt = 2.5066282746310002;
function Mt() {
	let e = M(arguments).filter(V);
	if (e.length === 0) return m;
	let t = z(e);
	return t instanceof Error ? t : s.default.sum((0, s.default)(t).subtract(s.default.mean(t)).abs()[0]) / t.length;
}
function Nt() {
	let e = M(arguments).filter(V);
	if (e.length === 0) return u;
	let t = F.apply(void 0, e);
	if (t) return t;
	let n = xe(e), r = n.length, i = 0, a = 0, o;
	for (let e = 0; e < r; e++) i += n[e], a += 1;
	return o = i / a, isNaN(o) && (o = m), o;
}
function Pt() {
	let e = M(arguments).filter(V);
	if (e.length === 0) return u;
	let t = F.apply(void 0, e);
	if (t) return t;
	let n = e, r = n.length, i = 0, a = 0, o;
	for (let e = 0; e < r; e++) {
		let t = n[e];
		typeof t == "number" && (i += t), t === !0 && i++, t !== null && a++;
	}
	return o = i / a, isNaN(o) && (o = m), o;
}
function Ft(e, t, n) {
	if (arguments.length <= 1) return h;
	if (n ||= e, n = z(M(n).filter(V)), e = M(e), n instanceof Error) return n;
	let r = 0, i = 0, a = t === void 0 || t === "*", o = a ? null : ce(t + "");
	for (let t = 0; t < e.length; t++) {
		let s = e[t];
		(a || le([A(s, k)].concat(o))) && (i += n[t], r++);
	}
	return i / r;
}
function It() {
	let e = Te(...arguments), t = e.reduce((e, t) => e + t, 0) / e.length;
	return isNaN(t) ? 0 : t;
}
var Lt = {};
Lt.DIST = function(e, t, n, r, i, a) {
	return arguments.length < 4 || (i = i === void 0 ? 0 : i, a = a === void 0 ? 1 : a, e = R(e), t = R(t), n = R(n), i = R(i), a = R(a), I(e, t, n, i, a)) ? d : (e = (e - i) / (a - i), r ? s.default.beta.cdf(e, t, n) : s.default.beta.pdf(e, t, n));
}, Lt.INV = (e, t, n, r, i) => (r = r === void 0 ? 0 : r, i = i === void 0 ? 1 : i, e = R(e), t = R(t), n = R(n), r = R(r), i = R(i), I(e, t, n, r, i) ? d : s.default.beta.inv(e, t, n) * (i - r) + r);
var Rt = {};
Rt.DIST = (e, t, n, r) => (e = R(e), t = R(t), n = R(n), r = R(r), I(e, t, n, r) ? d : r ? s.default.binomial.cdf(e, t, n) : s.default.binomial.pdf(e, t, n)), Rt.DIST.RANGE = (e, t, n, r) => {
	if (r = r === void 0 ? n : r, e = R(e), t = R(t), n = R(n), r = R(r), I(e, t, n, r)) return d;
	let i = 0;
	for (let a = n; a <= r; a++) i += or(e, a) * t ** +a * (1 - t) ** (e - a);
	return i;
}, Rt.INV = (e, t, n) => {
	if (e = R(e), t = R(t), n = R(n), I(e, t, n)) return d;
	let r = 0;
	for (; r <= e;) {
		if (s.default.binomial.cdf(r, e, t) >= n) return r;
		r++;
	}
};
var W = {};
W.DIST = (e, t, n) => (e = R(e), t = R(t), I(e, t) ? d : n ? s.default.chisquare.cdf(e, t) : s.default.chisquare.pdf(e, t)), W.DIST.RT = (e, t) => !e | !t ? h : e < 1 || t > 10 ** 10 ? m : typeof e != "number" || typeof t != "number" ? d : 1 - s.default.chisquare.cdf(e, t), W.INV = (e, t) => (e = R(e), t = R(t), I(e, t) ? d : s.default.chisquare.inv(e, t)), W.INV.RT = (e, t) => !e | !t ? h : e < 0 || e > 1 || t < 1 || t > 10 ** 10 ? m : typeof e != "number" || typeof t != "number" ? d : s.default.chisquare.inv(1 - e, t), W.TEST = function(e, t) {
	if (arguments.length !== 2) return h;
	if (!(e instanceof Array) || !(t instanceof Array) || e.length !== t.length || e[0] && t[0] && e[0].length !== t[0].length) return d;
	let n = e.length, r, i, a;
	for (i = 0; i < n; i++) e[i] instanceof Array || (r = e[i], e[i] = [], e[i].push(r)), t[i] instanceof Array || (r = t[i], t[i] = [], t[i].push(r));
	let o = e[0].length, s = o === 1 ? n - 1 : (n - 1) * (o - 1), c = 0, l = Math.PI;
	for (i = 0; i < n; i++) for (a = 0; a < o; a++) c += (e[i][a] - t[i][a]) ** 2 / t[i][a];
	function u(e, t) {
		let n = Math.exp(-.5 * e);
		t % 2 == 1 && (n *= Math.sqrt(2 * e / l));
		let r = t;
		for (; r >= 2;) n = n * e / r, r -= 2;
		let i = n, a = t;
		for (; i > 1e-10 * n;) a += 2, i = i * e / a, n += i;
		return 1 - n;
	}
	return Math.round(u(c, s) * 1e6) / 1e6;
};
var zt = {};
zt.NORM = (e, t, n) => (e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : s.default.normalci(1, e, t, n)[1] - 1), zt.T = (e, t, n) => (e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : s.default.tci(1, e, t, n)[1] - 1);
function Bt(e, t) {
	return e = z(M(e)), t = z(M(t)), I(e, t) ? d : s.default.corrcoeff(e, t);
}
function Vt() {
	return xe(M(arguments)).length;
}
function Ht() {
	let e = M(arguments);
	return e.length - Ut(e);
}
function Ut() {
	let e = M(arguments), t = 0, n;
	for (let r = 0; r < e.length; r++) n = e[r], (n == null || n === "") && t++;
	return t;
}
function Wt(e, t) {
	if (e = M(e), t === void 0 || t === "*") return e.length;
	let n = 0, r = ce(t + "");
	for (let t = 0; t < e.length; t++) {
		let i = e[t];
		le([A(i, k)].concat(r)) && n++;
	}
	return n;
}
function Gt() {
	let e = ue(arguments), t = Array(M(e[0]).length);
	for (let e = 0; e < t.length; e++) t[e] = !0;
	for (let n = 0; n < e.length; n += 2) {
		let r = M(e[n]), i = e[n + 1];
		if (!(i === void 0 || i === "*")) {
			let e = ce(i + "");
			for (let n = 0; n < r.length; n++) {
				let i = r[n], a = [A(i, k)].concat(e);
				t[n] = t[n] && le(a);
			}
		}
	}
	let n = 0;
	for (let e = 0; e < t.length; e++) t[e] && n++;
	return n;
}
var Kt = {};
Kt.P = (e, t) => {
	if (e = z(M(e)), t = z(M(t)), I(e, t)) return d;
	let n = s.default.mean(e), r = s.default.mean(t), i = 0, a = e.length;
	for (let o = 0; o < a; o++) i += (e[o] - n) * (t[o] - r);
	return i / a;
}, Kt.S = (e, t) => (e = z(M(e)), t = z(M(t)), I(e, t) ? d : s.default.covariance(e, t));
function qt() {
	let e = z(M(arguments));
	if (e instanceof Error) return e;
	let t = s.default.mean(e), n = 0;
	for (let r = 0; r < e.length; r++) n += (e[r] - t) ** 2;
	return n;
}
var Jt = {};
Jt.DIST = (e, t, n) => (e = R(e), t = R(t), I(e, t) ? d : n ? s.default.exponential.cdf(e, t) : s.default.exponential.pdf(e, t));
var G = {};
G.DIST = (e, t, n, r) => (e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : r ? s.default.centralF.cdf(e, t, n) : s.default.centralF.pdf(e, t, n)), G.DIST.RT = function(e, t, n) {
	return arguments.length === 3 ? e < 0 || t < 1 || n < 1 ? m : typeof e != "number" || typeof t != "number" || typeof n != "number" ? d : 1 - s.default.centralF.cdf(e, t, n) : h;
}, G.INV = (e, t, n) => (e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : e <= 0 || e > 1 ? m : s.default.centralF.inv(e, t, n)), G.INV.RT = function(e, t, n) {
	return arguments.length === 3 ? e < 0 || e > 1 || t < 1 || t > 10 ** 10 || n < 1 || n > 10 ** 10 ? m : typeof e != "number" || typeof t != "number" || typeof n != "number" ? d : s.default.centralF.inv(1 - e, t, n) : h;
}, G.TEST = (e, t) => {
	if (!e || !t || !(e instanceof Array) || !(t instanceof Array)) return h;
	if (e.length < 2 || t.length < 2) return u;
	let n = (e, t) => {
		let n = 0;
		for (let r = 0; r < e.length; r++) n += (e[r] - t) ** 2;
		return n;
	}, r = ni(e) / e.length, i = ni(t) / t.length;
	return n(e, r) / (e.length - 1) / (n(t, i) / (t.length - 1));
};
function Yt(e) {
	return e = R(e), e instanceof Error ? e : Math.log((1 + e) / (1 - e)) / 2;
}
function Xt(e) {
	if (e = R(e), e instanceof Error) return e;
	let t = Math.exp(2 * e);
	return (t - 1) / (t + 1);
}
function Zt(e, t, n) {
	if (e = R(e), t = z(M(t)), n = z(M(n)), I(e, t, n)) return d;
	let r = s.default.mean(n), i = s.default.mean(t), a = n.length, o = 0, c = 0;
	for (let e = 0; e < a; e++) o += (n[e] - r) * (t[e] - i), c += (n[e] - r) ** 2;
	let l = o / c;
	return i - l * r + l * e;
}
function Qt(e, t) {
	if (e = z(M(e)), t = z(M(t)), I(e, t)) return d;
	let n = e.length, r = t.length, i = [];
	for (let a = 0; a <= r; a++) {
		i[a] = 0;
		for (let o = 0; o < n; o++) a === 0 ? e[o] <= t[0] && (i[0] += 1) : a < r ? e[o] > t[a - 1] && e[o] <= t[a] && (i[a] += 1) : a === r && e[o] > t[r - 1] && (i[r] += 1);
	}
	return i;
}
function $t(e) {
	return e = R(e), e instanceof Error ? e : e === 0 || parseInt(e, 10) === e && e < 0 ? m : s.default.gammafn(e);
}
$t.DIST = function(e, t, n, r) {
	return arguments.length === 4 ? e < 0 || t <= 0 || n <= 0 || typeof e != "number" || typeof t != "number" || typeof n != "number" ? d : r ? s.default.gamma.cdf(e, t, n, !0) : s.default.gamma.pdf(e, t, n, !1) : h;
}, $t.INV = function(e, t, n) {
	return arguments.length === 3 ? e < 0 || e > 1 || t <= 0 || n <= 0 ? m : typeof e != "number" || typeof t != "number" || typeof n != "number" ? d : s.default.gamma.inv(e, t, n) : h;
};
function en(e) {
	return e = R(e), e instanceof Error ? e : s.default.gammaln(e);
}
en.PRECISE = function(e) {
	return arguments.length === 1 ? e <= 0 ? m : typeof e == "number" ? s.default.gammaln(e) : d : h;
};
function tn(e) {
	return e = R(e), e instanceof Error ? e : s.default.normal.cdf(e, 0, 1) - .5;
}
function nn() {
	let e = z(M(arguments));
	return e instanceof Error ? e : s.default.geomean(e);
}
function rn(e, t, n, r) {
	if (e = z(M(e)), e instanceof Error) return e;
	let i;
	if (t === void 0) for (t = [], i = 1; i <= e.length; i++) t.push(i);
	if (n === void 0 && (n = t), t = z(M(t)), n = z(M(n)), I(t, n)) return d;
	r === void 0 && (r = !0);
	let a = e.length, o = 0, s = 0, c = 0, l = 0;
	for (i = 0; i < a; i++) {
		let n = t[i], r = Math.log(e[i]);
		o += n, s += r, c += n * r, l += n * n;
	}
	o /= a, s /= a, c /= a, l /= a;
	let u, f;
	r ? (u = (c - o * s) / (l - o * o), f = s - u * o) : (u = c / l, f = 0);
	let p = [];
	for (i = 0; i < n.length; i++) p.push(Math.exp(f + u * n[i]));
	return p;
}
function an() {
	let e = z(M(arguments));
	if (e instanceof Error) return e;
	let t = e.length, n = 0;
	for (let r = 0; r < t; r++) n += 1 / e[r];
	return t / n;
}
var on = {};
on.DIST = (e, t, n, r, i) => {
	if (e = R(e), t = R(t), n = R(n), r = R(r), I(e, t, n, r)) return d;
	function a(e, t, n, r) {
		return or(n, e) * or(r - n, t - e) / or(r, t);
	}
	function o(e, t, n, r) {
		let i = 0;
		for (let o = 0; o <= e; o++) i += a(o, t, n, r);
		return i;
	}
	return i ? o(e, t, n, r) : a(e, t, n, r);
};
function sn(e, t) {
	return e = z(e), t = z(t), I(e, t) ? d : e.length === t.length ? Zt(0, e, t) : h;
}
function cn() {
	let e = z(M(arguments));
	if (e instanceof Error) return e;
	let t = s.default.mean(e), n = e.length, r = 0;
	for (let i = 0; i < n; i++) r += (e[i] - t) ** 4;
	return r /= s.default.stdev(e, !0) ** 4, n * (n + 1) / ((n - 1) * (n - 2) * (n - 3)) * r - 3 * (n - 1) * (n - 1) / ((n - 2) * (n - 3));
}
function ln(e, t) {
	return F.apply(void 0, e) || (I(t) ? t : (e = xe(M(e)), t = R(t), t < 0 || e.length < t ? d : e.sort((e, t) => t - e)[t - 1]));
}
function un(e, t) {
	if (e = z(M(e)), t = z(M(t)), I(e, t)) return d;
	let n = s.default.mean(e), r = s.default.mean(t), i = t.length, a = 0, o = 0;
	for (let s = 0; s < i; s++) a += (t[s] - r) * (e[s] - n), o += (t[s] - r) ** 2;
	let c = a / o;
	return [c, n - c * r];
}
function dn(e, t) {
	if (e = z(M(e)), t = z(M(t)), I(e, t) || e.length !== t.length) return d;
	for (let t = 0; t < e.length; t++) e[t] = Math.log(e[t]);
	let n = un(e, t);
	return n[0] = Math.round(Math.exp(n[0]) * 1e6) / 1e6, n[1] = Math.round(Math.exp(n[1]) * 1e6) / 1e6, n;
}
var fn = {};
fn.DIST = (e, t, n, r) => (e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : r ? s.default.lognormal.cdf(e, t, n) : s.default.lognormal.pdf(e, t, n)), fn.INV = (e, t, n) => (e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : s.default.lognormal.inv(e, t, n));
function pn() {
	let e = M(arguments), t = F.apply(void 0, e);
	if (t) return t;
	let n = xe(e);
	return n.length === 0 ? 0 : Math.max.apply(Math, n);
}
function mn() {
	let e = M(arguments), t = F.apply(void 0, e);
	if (t) return t;
	let n = de(e);
	return n = n.map((e) => e ?? 0), n.length === 0 ? 0 : Math.max.apply(Math, n);
}
function hn() {
	let e = Te(...arguments);
	return e.length === 0 ? 0 : Math.max.apply(Math, e);
}
function gn() {
	let e = M(arguments), t = F.apply(void 0, e);
	if (t) return t;
	let n = de(e), r = s.default.median(n);
	return isNaN(r) && (r = m), r;
}
function _n() {
	let e = M(arguments), t = F.apply(void 0, e);
	if (t) return t;
	let n = xe(e);
	return n.length === 0 ? 0 : Math.min.apply(Math, n);
}
function vn() {
	let e = M(arguments), t = F.apply(void 0, e);
	if (t) return t;
	let n = de(e);
	return n = n.map((e) => e ?? 0), n.length === 0 ? 0 : Math.min.apply(Math, n);
}
function yn() {
	let e = Te(...arguments);
	return e.length === 0 ? 0 : Math.min.apply(Math, e);
}
var bn = {};
bn.MULT = function() {
	let e = z(M(arguments));
	if (e instanceof Error) return e;
	let t = e.length, n = {}, r = [], i = 0, a;
	for (let o = 0; o < t; o++) a = e[o], n[a] = n[a] ? n[a] + 1 : 1, n[a] > i && (i = n[a], r = []), n[a] === i && (r[r.length] = a);
	return r;
}, bn.SNGL = function() {
	let e = z(M(arguments));
	return e instanceof Error ? e : bn.MULT(e).sort((e, t) => e - t)[0];
};
var xn = {};
xn.DIST = (e, t, n, r) => (e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : r ? s.default.negbin.cdf(e, t, n) : s.default.negbin.pdf(e, t, n));
var K = {};
K.DIST = (e, t, n, r) => (e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : n <= 0 ? m : r ? s.default.normal.cdf(e, t, n) : s.default.normal.pdf(e, t, n)), K.INV = (e, t, n) => (e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : s.default.normal.inv(e, t, n)), K.S = {}, K.S.DIST = (e, t) => (e = R(e), e instanceof Error ? d : t ? s.default.normal.cdf(e, 0, 1) : s.default.normal.pdf(e, 0, 1)), K.S.INV = (e) => (e = R(e), e instanceof Error ? d : s.default.normal.inv(e, 0, 1));
function Sn(e, t) {
	if (t = z(M(t)), e = z(M(e)), I(t, e)) return d;
	let n = s.default.mean(e), r = s.default.mean(t), i = e.length, a = 0, o = 0, c = 0;
	for (let s = 0; s < i; s++) a += (e[s] - n) * (t[s] - r), o += (e[s] - n) ** 2, c += (t[s] - r) ** 2;
	return a / Math.sqrt(o * c);
}
var q = {};
q.EXC = (e, t) => {
	if (e = z(M(e)), t = R(t), I(e, t)) return d;
	e = e.sort((e, t) => e - t);
	let n = e.length;
	if (t < 1 / (n + 1) || t > 1 - 1 / (n + 1)) return m;
	let r = t * (n + 1) - 1, i = Math.floor(r);
	return be(r === i ? e[r] : e[i] + (r - i) * (e[i + 1] - e[i]));
}, q.INC = (e, t) => {
	if (e = z(M(e)), t = R(t), I(e, t)) return d;
	e = e.sort((e, t) => e - t);
	let n = e.length, r = t * (n - 1), i = Math.floor(r);
	return be(r === i ? e[r] : e[i] + (r - i) * (e[i + 1] - e[i]));
};
var Cn = {};
Cn.EXC = (e, t, n) => {
	if (n = n === void 0 ? 3 : n, e = z(M(e)), t = R(t), n = R(n), I(e, t, n)) return d;
	e = e.sort((e, t) => e - t);
	let r = tt.apply(null, e), i = e.length, a = r.length, o = 10 ** n, s = 0, c = !1, l = 0;
	for (; !c && l < a;) t === r[l] ? (s = (e.indexOf(r[l]) + 1) / (i + 1), c = !0) : t >= r[l] && (t < r[l + 1] || l === a - 1) && (s = (e.indexOf(r[l]) + 1 + (t - r[l]) / (r[l + 1] - r[l])) / (i + 1), c = !0), l++;
	return Math.floor(s * o) / o;
}, Cn.INC = (e, t, n) => {
	if (n = n === void 0 ? 3 : n, e = z(M(e)), t = R(t), n = R(n), I(e, t, n)) return d;
	e = e.sort((e, t) => e - t);
	let r = tt.apply(null, e), i = e.length, a = r.length, o = 10 ** n, s = 0, c = !1, l = 0;
	for (; !c && l < a;) t === r[l] ? (s = e.indexOf(r[l]) / (i - 1), c = !0) : t >= r[l] && (t < r[l + 1] || l === a - 1) && (s = (e.indexOf(r[l]) + (t - r[l]) / (r[l + 1] - r[l])) / (i - 1), c = !0), l++;
	return Math.floor(s * o) / o;
};
function wn(e, t) {
	return e = R(e), t = R(t), I(e, t) ? d : yr(e) / yr(e - t);
}
function Tn(e, t) {
	return e = R(e), t = R(t), I(e, t) ? d : e ** +t;
}
function En(e) {
	return e = R(e), e instanceof Error ? d : Math.exp(-.5 * e * e) / jt;
}
var Dn = {};
Dn.DIST = (e, t, n) => (e = R(e), t = R(t), I(e, t) ? d : n ? s.default.poisson.cdf(e, t) : s.default.poisson.pdf(e, t));
function On(e, t, n, r) {
	if (n === void 0) return 0;
	if (r = r === void 0 ? n : r, e = z(M(e)), t = z(M(t)), n = R(n), r = R(r), I(e, t, n, r)) return d;
	if (n === r) return e.indexOf(n) >= 0 ? t[e.indexOf(n)] : 0;
	let i = e.sort((e, t) => e - t), a = i.length, o = 0;
	for (let s = 0; s < a; s++) i[s] >= n && i[s] <= r && (o += t[e.indexOf(i[s])]);
	return o;
}
var kn = {};
kn.EXC = (e, t) => {
	if (e = z(xe(M(e))), t = R(t), I(e, t)) return d;
	switch (t) {
		case 1: return q.EXC(e, .25);
		case 2: return q.EXC(e, .5);
		case 3: return q.EXC(e, .75);
		default: return m;
	}
}, kn.INC = (e, t) => {
	if (e = z(xe(M(e))), t = R(t), I(e, t)) return d;
	switch (t) {
		case 1: return q.INC(e, .25);
		case 2: return q.INC(e, .5);
		case 3: return q.INC(e, .75);
		default: return m;
	}
};
var An = {};
An.AVG = (e, t, n) => {
	if (e = R(e), t = z(M(t)), I(e, t)) return d;
	t = M(t), n ||= !1;
	let r = n ? (e, t) => e - t : (e, t) => t - e;
	t = t.sort(r);
	let i = t.length, a = 0;
	for (let n = 0; n < i; n++) t[n] === e && a++;
	return a > 1 ? (2 * t.indexOf(e) + a + 1) / 2 : t.indexOf(e) + 1;
}, An.EQ = (e, t, n) => {
	if (e = R(e), t = z(M(t)), I(e, t)) return d;
	n ||= !1;
	let r = n ? (e, t) => e - t : (e, t) => t - e;
	return t = t.sort(r), t.indexOf(e) + 1;
};
function jn(e, t) {
	if (arguments.length !== 2) return h;
	if (t < 0) return m;
	if (!(e instanceof Array) || typeof t != "number") return d;
	if (e.length !== 0) return s.default.row(e, t);
}
function Mn(e, t) {
	return e = z(M(e)), t = z(M(t)), I(e, t) ? d : Sn(e, t) ** 2;
}
function Nn() {
	let e = z(M(arguments));
	if (e instanceof Error) return e;
	let t = s.default.mean(e), n = e.length, r = 0;
	for (let i = 0; i < n; i++) r += (e[i] - t) ** 3;
	return n * r / ((n - 1) * (n - 2) * s.default.stdev(e, !0) ** 3);
}
Nn.P = function() {
	let e = z(M(arguments));
	if (e instanceof Error) return e;
	let t = s.default.mean(e), n = e.length, r = 0, i = 0;
	for (let a = 0; a < n; a++) i += (e[a] - t) ** 3, r += (e[a] - t) ** 2;
	return i /= n, r /= n, i / r ** (3 / 2);
};
function Pn(e, t) {
	if (e = z(M(e)), t = z(M(t)), I(e, t)) return d;
	let n = s.default.mean(t), r = s.default.mean(e), i = t.length, a = 0, o = 0;
	for (let s = 0; s < i; s++) a += (t[s] - n) * (e[s] - r), o += (t[s] - n) ** 2;
	return a / o;
}
function Fn(e, t) {
	return e = z(M(e)), t = R(t), I(e, t) ? e : e.sort((e, t) => e - t)[t - 1];
}
function In(e, t, n) {
	return e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : (e - t) / n;
}
var J = {};
J.P = function() {
	let e = Y.P.apply(this, arguments), t = Math.sqrt(e);
	return isNaN(t) && (t = m), t;
}, J.S = function() {
	let e = Y.S.apply(this, arguments);
	return Math.sqrt(e);
};
function Ln() {
	let e = Hn.apply(this, arguments);
	return Math.sqrt(e);
}
function Rn() {
	let e = Un.apply(this, arguments), t = Math.sqrt(e);
	return isNaN(t) && (t = m), t;
}
function zn(e, t) {
	if (e = z(M(e)), t = z(M(t)), I(e, t)) return d;
	let n = s.default.mean(t), r = s.default.mean(e), i = t.length, a = 0, o = 0, c = 0;
	for (let s = 0; s < i; s++) a += (e[s] - r) ** 2, o += (t[s] - n) * (e[s] - r), c += (t[s] - n) ** 2;
	return Math.sqrt((a - o * o / c) / (i - 2));
}
U.DIST = (e, t, n) => n !== 1 && n !== 2 ? m : n === 1 ? U.DIST.RT(e, t) : U.DIST["2T"](e, t), U.DIST["2T"] = function(e, t) {
	return arguments.length === 2 ? e < 0 || t < 1 ? m : typeof e != "number" || typeof t != "number" ? d : (1 - s.default.studentt.cdf(e, t)) * 2 : h;
}, U.DIST.RT = function(e, t) {
	return arguments.length === 2 ? e < 0 || t < 1 ? m : typeof e != "number" || typeof t != "number" ? d : 1 - s.default.studentt.cdf(e, t) : h;
}, U.INV = (e, t) => (e = R(e), t = R(t), I(e, t) ? d : s.default.studentt.inv(e, t)), U.INV["2T"] = (e, t) => (e = R(e), t = R(t), e <= 0 || e > 1 || t < 1 ? m : I(e, t) ? d : Math.abs(s.default.studentt.inv(e / 2, t))), U.TEST = (e, t) => {
	if (e = z(M(e)), t = z(M(t)), I(e, t)) return d;
	let n = s.default.mean(e), r = s.default.mean(t), i = 0, a = 0, o;
	for (o = 0; o < e.length; o++) i += (e[o] - n) ** 2;
	for (o = 0; o < t.length; o++) a += (t[o] - r) ** 2;
	i /= e.length - 1, a /= t.length - 1;
	let c = Math.abs(n - r) / Math.sqrt(i / e.length + a / t.length);
	return U.DIST["2T"](c, e.length + t.length - 2);
};
function Bn(e, t, n) {
	if (e = z(M(e)), t = z(M(t)), n = z(M(n)), I(e, t, n)) return d;
	let r = un(e, t), i = r[0], a = r[1], o = [];
	return n.forEach((e) => {
		o.push(i * e + a);
	}), o;
}
function Vn(e, t) {
	if (e = z(M(e)), t = R(t), I(e, t)) return d;
	let n = xr(e.length * t, 2) / 2;
	return s.default.mean(ge(N(e.sort((e, t) => e - t), n), n));
}
var Y = {};
Y.P = function() {
	let e = xe(M(arguments)), t = e.length, n = 0, r = Nt(e), i;
	for (let i = 0; i < t; i++) n += (e[i] - r) ** 2;
	return i = n / t, isNaN(i) && (i = m), i;
}, Y.S = function() {
	let e = xe(M(arguments)), t = e.length, n = 0, r = Nt(e);
	for (let i = 0; i < t; i++) n += (e[i] - r) ** 2;
	return n / (t - 1);
};
function Hn() {
	let e = M(arguments), t = e.length, n = 0, r = 0, i = Pt(e);
	for (let a = 0; a < t; a++) {
		let t = e[a];
		typeof t == "number" ? n += (t - i) ** 2 : t === !0 ? n += (1 - i) ** 2 : n += (0 - i) ** 2, t !== null && r++;
	}
	return n / (r - 1);
}
function Un() {
	let e = M(arguments), t = e.length, n = 0, r = 0, i = Pt(e), a;
	for (let a = 0; a < t; a++) {
		let t = e[a];
		typeof t == "number" ? n += (t - i) ** 2 : t === !0 ? n += (1 - i) ** 2 : n += (0 - i) ** 2, t !== null && r++;
	}
	return a = n / r, isNaN(a) && (a = m), a;
}
var Wn = {};
Wn.DIST = (e, t, n, r) => (e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : r ? 1 - Math.exp(-((e / n) ** +t)) : e ** (t - 1) * Math.exp(-((e / n) ** +t)) * t / n ** +t);
var Gn = {};
Gn.TEST = (e, t, n) => {
	if (e = z(M(e)), t = R(t), I(e, t)) return d;
	n ||= J.S(e);
	let r = e.length;
	return 1 - K.S.DIST((Nt(e) - t) / (n / Math.sqrt(r)), !0);
};
function Kn(e) {
	return e = R(e), e instanceof Error ? e : Math.abs(e);
}
function qn(e) {
	if (e = R(e), e instanceof Error) return e;
	let t = Math.acos(e);
	return isNaN(t) && (t = m), t;
}
function Jn(e) {
	if (e = R(e), e instanceof Error) return e;
	let t = Math.log(e + Math.sqrt(e * e - 1));
	return isNaN(t) && (t = m), t;
}
function Yn(e) {
	return e = R(e), e instanceof Error ? e : Math.atan(1 / e);
}
function Xn(e) {
	if (e = R(e), e instanceof Error) return e;
	let t = .5 * Math.log((e + 1) / (e - 1));
	return isNaN(t) && (t = m), t;
}
function Zn(e, t, n, r) {
	if (e = R(e), t = R(e), I(e, t)) return d;
	switch (e) {
		case 1: return Nt(n);
		case 2: return Vt(n);
		case 3: return Ht(n);
		case 4: return pn(n);
		case 5: return _n(n);
		case 6: return Lr(n);
		case 7: return J.S(n);
		case 8: return J.P(n);
		case 9: return ni(n);
		case 10: return Y.S(n);
		case 11: return Y.P(n);
		case 12: return gn(n);
		case 13: return bn.SNGL(n);
		case 14: return ln(n, r);
		case 15: return Fn(n, r);
		case 16: return q.INC(n, r);
		case 17: return kn.INC(n, r);
		case 18: return q.EXC(n, r);
		case 19: return kn.EXC(n, r);
	}
}
function Qn(e) {
	if (e == null) return 0;
	if (e instanceof Error) return e;
	if (!/^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(e)) return d;
	let t = 0;
	return e.replace(/[MDLV]|C[MD]?|X[CL]?|I[XV]?/g, (e) => {
		t += {
			M: 1e3,
			CM: 900,
			D: 500,
			CD: 400,
			C: 100,
			XC: 90,
			L: 50,
			XL: 40,
			X: 10,
			IX: 9,
			V: 5,
			IV: 4,
			I: 1
		}[e];
	}), t;
}
function $n(e) {
	if (e = R(e), e instanceof Error) return e;
	let t = Math.asin(e);
	return isNaN(t) && (t = m), t;
}
function er(e) {
	return e = R(e), e instanceof Error ? e : Math.log(e + Math.sqrt(e * e + 1));
}
function tr(e) {
	return e = R(e), e instanceof Error ? e : Math.atan(e);
}
function nr(e, t) {
	return e = R(e), t = R(t), F(e, t) || Math.atan2(e, t);
}
function rr(e) {
	if (e = R(e), e instanceof Error) return e;
	let t = Math.log((1 + e) / (1 - e)) / 2;
	return isNaN(t) && (t = m), t;
}
function ir(e, t, n) {
	e = R(e), t = R(t), n = R(n);
	let r = F(e, t, n);
	if (r) return r;
	if (t === 0) return m;
	let i = e.toString(t);
	return Array(Math.max(n + 1 - i.length, 0)).join("0") + i;
}
function ar(e, t) {
	return e = R(e), t = R(t), F(e, t) || (t === 0 ? 0 : e > 0 && t < 0 ? m : Math.ceil(e / t) * t);
}
ar.MATH = (e, t, n = 0) => (t === void 0 && (t = e > 0 ? 1 : -1), e = R(e), t = R(t), n = R(n), F(e, t, n) || (t === 0 ? 0 : (t = Math.abs(t), n === 0 || e > 0 ? Math.ceil(e / t) * t : Math.floor(e / t) * t))), ar.PRECISE = (e, t) => ar.MATH(e, t);
function or(e, t) {
	return e = R(e), t = R(t), F(e, t) || (e < t ? m : yr(e) / (yr(t) * yr(e - t)));
}
function sr(e, t) {
	return e = R(e), t = R(t), F(e, t) || (e < t ? m : e === 0 && t === 0 ? 1 : or(e + t - 1, e - 1));
}
function cr(e) {
	return e = R(e), e instanceof Error ? e : Math.cos(e);
}
function lr(e) {
	return e = R(e), e instanceof Error ? e : (Math.exp(e) + Math.exp(-e)) / 2;
}
function ur(e) {
	return e = R(e), e instanceof Error ? e : e === 0 ? u : 1 / Math.tan(e);
}
function dr(e) {
	if (e = R(e), e instanceof Error) return e;
	if (e === 0) return u;
	let t = Math.exp(2 * e);
	return (t + 1) / (t - 1);
}
function fr(e) {
	return e = R(e), e instanceof Error ? e : e === 0 ? u : 1 / Math.sin(e);
}
function pr(e) {
	return e = R(e), e instanceof Error ? e : e === 0 ? u : 2 / (Math.exp(e) - Math.exp(-e));
}
function mr(e, t) {
	if (arguments.length < 2) return h;
	e ||= "0", t = R(t);
	let n = F(e, t);
	if (n) return n;
	if (t === 0) return m;
	let r = parseInt(e, t);
	return isNaN(r) ? m : r;
}
function hr(e) {
	return e = R(e), e instanceof Error ? e : e * 180 / Math.PI;
}
function gr(e) {
	return e = R(e), e instanceof Error ? e : ar.MATH(e, -2, -1);
}
function _r(e) {
	return arguments.length < 1 ? h : arguments.length > 1 ? g : (e = R(e), e instanceof Error || (e = Math.exp(e)), e);
}
var vr = [];
function yr(e) {
	if (e = R(e), e instanceof Error) return e;
	let t = Math.floor(e);
	return t === 0 || t === 1 ? 1 : (vr[t] > 0 || (vr[t] = yr(t - 1) * t), vr[t]);
}
function br(e) {
	if (e = R(e), e instanceof Error) return e;
	let t = Math.floor(e);
	return t <= 0 ? 1 : t * br(t - 2);
}
function xr(e, t) {
	return e = R(e), t = R(t), F(e, t) || (t ? e > 0 && t < 0 ? m : Math.floor(e / t) * t : u);
}
xr.MATH = (e, t = 1, n = 0) => (e = R(e), t = R(t), n = R(n), F(e, t, n) || (t === 0 ? 0 : (t = Math.abs(t), n === 0 || e > 0 ? Math.floor(e / t) * t : Math.ceil(e / t) * t))), xr.PRECISE = (e, t) => xr.MATH(e, t);
function Sr() {
	let e = z(M(arguments));
	if (e instanceof Error) return e;
	let t = e.length, n = e[0], r = n < 0 ? -n : n;
	for (let n = 1; n < t; n++) {
		let t = e[n], i = t < 0 ? -t : t;
		for (; r && i;) r > i ? r %= i : i %= r;
		r += i;
	}
	return r;
}
function Cr(e) {
	return e = R(e), e instanceof Error ? e : Math.floor(e);
}
var wr = { CEILING: ar };
function Tr() {
	let e = z(M(arguments));
	if (e instanceof Error) return e;
	for (var t, n, r, i, a = 1; (r = e.pop()) !== void 0;) {
		if (r === 0) return 0;
		for (; r > 1;) {
			if (r % 2) {
				for (t = 3, n = Math.floor(Math.sqrt(r)); t <= n && r % t; t += 2);
				i = t <= n ? t : r;
			} else i = 2;
			for (r /= i, a *= i, t = e.length; t; e[--t] % i === 0 && (e[t] /= i) === 1 && e.splice(t, 1));
		}
	}
	return a;
}
function Er(e) {
	return e = R(e), e instanceof Error ? e : e === 0 ? m : Math.log(e);
}
function Dr(e, t) {
	return e = R(e), t = t ? R(t) : 10, F(e, t) || (e === 0 || t === 0 ? m : Math.log(e) / Math.log(t));
}
function Or(e) {
	return e = R(e), e instanceof Error ? e : e === 0 ? m : Math.log(e) / Math.log(10);
}
function kr(e, t) {
	return !Array.isArray(e) || !Array.isArray(t) || e.some((e) => !e.length) || t.some((e) => !e.length) || he(e).some((e) => typeof e != "number") || he(t).some((e) => typeof e != "number") || e[0].length !== t.length ? d : Array(e.length).fill(0).map(() => Array(t[0].length).fill(0)).map((n, r) => n.map((n, i) => e[r].reduce((e, n, r) => e + n * t[r][i], 0)));
}
function Ar(e, t) {
	e = R(e), t = R(t);
	let n = F(e, t);
	if (n) return n;
	if (t === 0) return u;
	let r = Math.abs(e % t);
	return r = e < 0 ? t - r : r, t > 0 ? r : -r;
}
function jr(e, t) {
	return e = R(e), t = R(t), F(e, t) || (e * t === 0 ? 0 : e * t < 0 ? m : Math.round(e / t) * t);
}
function Mr() {
	let e = z(M(arguments));
	if (e instanceof Error) return e;
	let t = 0, n = 1;
	for (let r = 0; r < e.length; r++) t += e[r], n *= yr(e[r]);
	return yr(t) / n;
}
function Nr(e) {
	return arguments.length > 1 ? h : (e = parseInt(e), !e || e <= 0 ? d : Array(e).fill(0).map(() => Array(e).fill(0)).map((e, t) => (e[t] = 1, e)));
}
function Pr(e) {
	if (e = R(e), e instanceof Error) return e;
	let t = Math.ceil(Math.abs(e));
	return t = t & 1 ? t : t + 1, e >= 0 ? t : -t;
}
function Fr() {
	return Math.PI;
}
function Ir(e, t) {
	e = R(e), t = R(t);
	let n = F(e, t);
	if (n) return n;
	if (e === 0 && t === 0) return m;
	let r = e ** +t;
	return isNaN(r) ? m : r;
}
function Lr() {
	let e = M(arguments).filter((e) => e != null);
	if (e.length === 0) return 0;
	let t = z(e);
	if (t instanceof Error) return t;
	let n = 1;
	for (let e = 0; e < t.length; e++) n *= t[e];
	return n;
}
function Rr(e, t) {
	return e = R(e), t = R(t), F(e, t) || parseInt(e / t, 10);
}
function zr(e) {
	return e = R(e), e instanceof Error ? e : e * Math.PI / 180;
}
function Br() {
	return Math.random();
}
function Vr(e, t) {
	return e = R(e), t = R(t), F(e, t) || e + Math.ceil((t - e + 1) * Math.random()) - 1;
}
function Hr(e) {
	if (e = R(e), e instanceof Error) return e;
	let t = String(e).split(""), n = /* @__PURE__ */ ".C.CC.CCC.CD.D.DC.DCC.DCCC.CM..X.XX.XXX.XL.L.LX.LXX.LXXX.XC..I.II.III.IV.V.VI.VII.VIII.IX".split("."), r = "", i = 3;
	for (; i--;) r = (n[+t.pop() + i * 10] || "") + r;
	return Array(+t.join("") + 1).join("M") + r;
}
function Ur(e, t, n) {
	e = R(e), t = R(t);
	let r = F(e, t);
	if (r) return r;
	let i = e >= 0 ? 1 : -1, a = (Math.abs(e) + "e" + t).split("e");
	return a = (n(a[0] + "e" + a[1]) + "e" + -t).split("e"), Number(a[0] + "e" + a[1]) * i;
}
function Wr(e, t) {
	return Ur(e, t, Math.round);
}
function Gr(e, t) {
	return Ur(e, t, Math.floor);
}
function Kr(e, t) {
	return Ur(e, t, Math.ceil);
}
function qr(e) {
	return e = R(e), e instanceof Error ? e : 1 / Math.cos(e);
}
function Jr(e) {
	return e = R(e), e instanceof Error ? e : 2 / (Math.exp(e) + Math.exp(-e));
}
function Yr(e, t, n, r) {
	if (e = R(e), t = R(t), n = R(n), r = z(r), I(e, t, n, r)) return d;
	let i = r[0] * e ** +t;
	for (let a = 1; a < r.length; a++) i += r[a] * e ** +(t + a * n);
	return i;
}
function Xr(e) {
	return e = R(e), e instanceof Error ? e : e < 0 ? -1 : e === 0 ? 0 : 1;
}
function Zr(e) {
	return e = R(e), e instanceof Error ? e : Math.sin(e);
}
function Qr(e) {
	return e = R(e), e instanceof Error ? e : (Math.exp(e) - Math.exp(-e)) / 2;
}
function $r(e) {
	return e = R(e), e instanceof Error ? e : e < 0 ? m : Math.sqrt(e);
}
function ei(e) {
	return e = R(e), e instanceof Error ? e : Math.sqrt(e * Math.PI);
}
function ti(e, t) {
	if (e = R(e), e instanceof Error) return e;
	switch (e) {
		case 1: return Nt(t);
		case 2: return Vt(t);
		case 3: return Ht(t);
		case 4: return pn(t);
		case 5: return _n(t);
		case 6: return Lr(t);
		case 7: return J.S(t);
		case 8: return J.P(t);
		case 9: return ni(t);
		case 10: return Y.S(t);
		case 11: return Y.P(t);
		case 101: return Nt(t);
		case 102: return Vt(t);
		case 103: return Ht(t);
		case 104: return pn(t);
		case 105: return _n(t);
		case 106: return Lr(t);
		case 107: return J.S(t);
		case 108: return J.P(t);
		case 109: return ni(t);
		case 110: return Y.S(t);
		case 111: return Y.P(t);
	}
}
function ni() {
	let e = 0;
	return j(ue(arguments), (t) => {
		if (e instanceof Error) return !1;
		if (t instanceof Error) e = t;
		else if (typeof t == "number") e += t;
		else if (typeof t == "string") {
			let n = parseFloat(t);
			!isNaN(n) && (e += n);
		} else if (Array.isArray(t)) {
			let n = ni.apply(null, t);
			n instanceof Error ? e = n : e += n;
		}
	}), e;
}
function ri(e, t, n) {
	if (e = M(e), n = n ? M(n) : e, e instanceof Error) return e;
	if (t == null || t instanceof Error) return 0;
	let r = 0, i = t === "*", a = i ? null : ce(t + "");
	for (let t = 0; t < e.length; t++) {
		let o = e[t], s = n[t];
		if (i) r += o;
		else {
			let e = [A(o, k)].concat(a);
			r += le(e) ? s : 0;
		}
	}
	return r;
}
function ii() {
	let e = ue(arguments);
	return e[0] = de(M(e[0])), ni(Te(...e));
}
function ai() {
	if (!arguments || arguments.length === 0) return d;
	let e = arguments.length + 1, t = 0, n, r, i, a;
	for (let o = 0; o < arguments[0].length; o++) if (arguments[0][o] instanceof Array) for (let i = 0; i < arguments[0][o].length; i++) {
		for (n = 1, r = 1; r < e; r++) {
			let e = arguments[r - 1][o][i];
			if (e instanceof Error) return e;
			if (a = R(e), a instanceof Error) return a;
			n *= a;
		}
		t += n;
	}
	else {
		for (n = 1, r = 1; r < e; r++) {
			let e = arguments[r - 1][o];
			if (e instanceof Error) return e;
			if (i = R(e), i instanceof Error) return i;
			n *= i;
		}
		t += n;
	}
	return t;
}
function oi() {
	let e = z(M(arguments));
	if (e instanceof Error) return e;
	let t = 0, n = e.length;
	for (let r = 0; r < n; r++) t += Pe(e[r]) ? e[r] * e[r] : 0;
	return t;
}
function si(e, t) {
	if (e = z(M(e)), t = z(M(t)), I(e, t)) return d;
	let n = 0;
	for (let r = 0; r < e.length; r++) n += e[r] * e[r] - t[r] * t[r];
	return n;
}
function ci(e, t) {
	if (e = z(M(e)), t = z(M(t)), I(e, t)) return d;
	let n = 0;
	e = z(M(e)), t = z(M(t));
	for (let r = 0; r < e.length; r++) n += e[r] * e[r] + t[r] * t[r];
	return n;
}
function li(e, t) {
	if (e = z(M(e)), t = z(M(t)), I(e, t)) return d;
	let n = 0;
	e = M(e), t = M(t);
	for (let r = 0; r < e.length; r++) n += (e[r] - t[r]) ** 2;
	return n;
}
function ui(e) {
	return e = R(e), e instanceof Error ? e : Math.tan(e);
}
function di(e) {
	if (e = R(e), e instanceof Error) return e;
	let t = Math.exp(2 * e);
	return (t - 1) / (t + 1);
}
function fi(e, t) {
	return e = R(e), t = R(t), F(e, t) || (e > 0 ? 1 : -1) * Math.floor(Math.abs(e) * 10 ** t) / 10 ** t;
}
function pi(e, t) {
	return arguments.length === 2 ? (e = R(e), t = R(t), F(e, t) || e + t) : h;
}
function mi(e, t) {
	return arguments.length === 2 ? (e = R(e), t = R(t), F(e, t) || (t === 0 ? u : e / t)) : h;
}
function hi(e, t) {
	return arguments.length === 2 ? e instanceof Error ? e : t instanceof Error ? t : (e === null && (e = void 0), t === null && (t = void 0), e === t) : h;
}
function gi(e, t) {
	return arguments.length === 2 ? e instanceof Error ? e : t instanceof Error ? t : (we(e, t) ? (e = B(e), t = B(t)) : (e = R(e), t = R(t)), F(e, t) || e > t) : h;
}
function _i(e, t) {
	return arguments.length === 2 ? (we(e, t) ? (e = B(e), t = B(t)) : (e = R(e), t = R(t)), F(e, t) || e >= t) : h;
}
function vi(e, t) {
	return arguments.length === 2 ? (we(e, t) ? (e = B(e), t = B(t)) : (e = R(e), t = R(t)), F(e, t) || e < t) : h;
}
function yi(e, t) {
	return arguments.length === 2 ? (we(e, t) ? (e = B(e), t = B(t)) : (e = R(e), t = R(t)), F(e, t) || e <= t) : h;
}
function bi(e, t) {
	return arguments.length === 2 ? (e = R(e), t = R(t), F(e, t) || e - t) : h;
}
function xi(e, t) {
	return arguments.length === 2 ? (e = R(e), t = R(t), F(e, t) || e * t) : h;
}
function Si(e, t) {
	return arguments.length === 2 ? e instanceof Error ? e : t instanceof Error ? t : (e === null && (e = void 0), t === null && (t = void 0), e !== t) : h;
}
function Ci(e, t) {
	return arguments.length === 2 ? Ir(e, t) : h;
}
var wi = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	ADD: pi,
	DIVIDE: mi,
	EQ: hi,
	GT: gi,
	GTE: _i,
	LT: vi,
	LTE: yi,
	MINUS: bi,
	MULTIPLY: xi,
	NE: Si,
	POW: Ci
}), Ti = [
	void 0,
	0,
	1,
	void 0,
	void 0,
	void 0,
	void 0,
	void 0,
	void 0,
	void 0,
	void 0,
	void 0,
	1,
	2,
	3,
	4,
	5,
	6,
	0
], Ei = [
	[],
	[
		1,
		2,
		3,
		4,
		5,
		6,
		7
	],
	[
		7,
		1,
		2,
		3,
		4,
		5,
		6
	],
	[
		6,
		0,
		1,
		2,
		3,
		4,
		5
	],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[
		7,
		1,
		2,
		3,
		4,
		5,
		6
	],
	[
		6,
		7,
		1,
		2,
		3,
		4,
		5
	],
	[
		5,
		6,
		7,
		1,
		2,
		3,
		4
	],
	[
		4,
		5,
		6,
		7,
		1,
		2,
		3
	],
	[
		3,
		4,
		5,
		6,
		7,
		1,
		2
	],
	[
		2,
		3,
		4,
		5,
		6,
		7,
		1
	],
	[
		1,
		2,
		3,
		4,
		5,
		6,
		7
	]
], Di = [
	[],
	[6, 0],
	[0, 1],
	[1, 2],
	[2, 3],
	[3, 4],
	[4, 5],
	[5, 6],
	void 0,
	void 0,
	void 0,
	[0, 0],
	[1, 1],
	[2, 2],
	[3, 3],
	[4, 4],
	[5, 5],
	[6, 6]
];
function Oi(e, t, n) {
	let r;
	return e = R(e), t = R(t), n = R(n), I(e, t, n) ? r = d : (r = new Date(e, t - 1, n), r.getFullYear() < 0 && (r = m)), b ? C(r) : r;
}
function ki(e, t, n) {
	n = n.toUpperCase(), e = L(e), t = L(t);
	let r = e.getFullYear(), i = e.getMonth(), a = e.getDate(), o = t.getFullYear(), s = t.getMonth(), c = t.getDate(), l;
	switch (n) {
		case "Y":
			l = Math.floor($i(e, t));
			break;
		case "D":
			l = Ni(t, e);
			break;
		case "M":
			l = s - i + 12 * (o - r), c < a && l--;
			break;
		case "MD":
			a <= c ? l = c - a : (s === 0 ? (e.setFullYear(o - 1), e.setMonth(12)) : (e.setFullYear(o), e.setMonth(s - 1)), l = Ni(t, e));
			break;
		case "YM":
			l = s - i + 12 * (o - r), c < a && l--, l %= 12;
			break;
		case "YD":
			s > i || s === i && c < a ? e.setFullYear(o) : e.setFullYear(o - 1), l = Ni(t, e);
			break;
	}
	return l;
}
function Ai(e) {
	if (typeof e != "string" || isNaN(Date.parse(e))) return d;
	let t = new Date(e);
	return b ? C(t) : t;
}
function ji(e) {
	let t = L(e);
	return t instanceof Error ? t : t.getDate();
}
function Mi(e) {
	let t = new Date(e);
	return t.setHours(0, 0, 0, 0), t;
}
function Ni(e, t) {
	return e = L(e), t = L(t), e instanceof Error ? e : t instanceof Error ? t : C(Mi(e)) - C(Mi(t));
}
function Pi(e, t, n) {
	if (n = Se(n || "false"), e = L(e), t = L(t), e instanceof Error) return e;
	if (t instanceof Error) return t;
	if (n instanceof Error) return n;
	let r = e.getMonth(), i = t.getMonth(), a, o;
	if (n) a = e.getDate() === 31 ? 30 : e.getDate(), o = t.getDate() === 31 ? 30 : t.getDate();
	else {
		let n = new Date(e.getFullYear(), r + 1, 0).getDate(), s = new Date(t.getFullYear(), i + 1, 0).getDate();
		a = e.getDate() === n ? 30 : e.getDate(), t.getDate() === s ? a < 30 ? (i++, o = 1) : o = 30 : o = t.getDate();
	}
	return 360 * (t.getFullYear() - e.getFullYear()) + 30 * (i - r) + (o - a);
}
function Fi(e, t) {
	if (e = L(e), e instanceof Error) return e;
	if (isNaN(t)) return d;
	let n = e.getDate();
	e.setDate(1), t = parseInt(t, 10), e.setMonth(e.getMonth() + t);
	let r = e.getMonth();
	if (n > 28) {
		let t = [
			31,
			28,
			31,
			30,
			31,
			30,
			31,
			31,
			30,
			31,
			30,
			31
		][r], i = e.getFullYear();
		r === 1 && (i % 4 == 0 && i % 100 != 0 || i % 400 == 0) && (t = 29), n = Math.min(n, t);
	}
	return e.setDate(n), b ? C(e) : e;
}
function Ii(e, t) {
	if (e = L(e), e instanceof Error) return e;
	if (isNaN(t)) return d;
	t = parseInt(t, 10);
	let n = new Date(e.getFullYear(), e.getMonth() + t + 1, 0);
	return b ? C(n) : n;
}
function Li(e) {
	return e = L(e), e instanceof Error ? e : e.getHours();
}
function Ri(e) {
	if (e = L(e), e instanceof Error) return e;
	e = Mi(e), e.setDate(e.getDate() + 4 - (e.getDay() || 7));
	let t = new Date(e.getFullYear(), 0, 1);
	return Math.ceil(((e - t) / 864e5 + 1) / 7);
}
function zi(e) {
	return e = L(e), e instanceof Error ? e : e.getMinutes();
}
function Bi(e) {
	return e = L(e), e instanceof Error ? e : e.getMonth() + 1;
}
function Vi(e, t, n) {
	return Vi.INTL(e, t, 1, n);
}
Vi.INTL = (e, t, n, r) => {
	if (e = L(e), e instanceof Error) return e;
	if (t = L(t), t instanceof Error) return t;
	let i = !1, a = [], o = [
		1,
		2,
		3,
		4,
		5,
		6,
		0
	], s = /* @__PURE__ */ RegExp("^[0|1]{7}$");
	if (n === void 0) n = Di[1];
	else if (typeof n == "string" && s.test(n)) {
		i = !0, n = n.split("");
		for (let e = 0; e < n.length; e++) n[e] === "1" && a.push(o[e]);
	} else n = Di[n];
	if (!(n instanceof Array)) return d;
	r === void 0 ? r = [] : r instanceof Array || (r = [r]);
	for (let e = 0; e < r.length; e++) {
		let t = L(r[e]);
		if (t instanceof Error) return t;
		r[e] = t;
	}
	let c = Math.round((t - e) / (1e3 * 60 * 60 * 24)) + 1, l = c, u = e;
	for (let e = 0; e < c; e++) {
		let e = (/* @__PURE__ */ new Date()).getTimezoneOffset() > 0 ? u.getUTCDay() : u.getDay(), t = i ? a.includes(e) : e === n[0] || e === n[1];
		for (let e = 0; e < r.length; e++) {
			let n = r[e];
			if (n.getDate() === u.getDate() && n.getMonth() === u.getMonth() && n.getFullYear() === u.getFullYear()) {
				t = !0;
				break;
			}
		}
		t && l--, u.setDate(u.getDate() + 1);
	}
	return l;
};
function Hi() {
	return b ? C(/* @__PURE__ */ new Date()) : /* @__PURE__ */ new Date();
}
function Ui(e) {
	return e = L(e), e instanceof Error ? e : e.getSeconds();
}
function Wi(e, t, n) {
	return e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : e < 0 || t < 0 || n < 0 ? m : (3600 * e + 60 * t + n) / 86400;
}
function Gi(e) {
	return e = L(e), e instanceof Error ? e : (3600 * e.getHours() + 60 * e.getMinutes() + e.getSeconds()) / 86400;
}
function Ki() {
	let e = Mi(/* @__PURE__ */ new Date());
	return b ? C(e) : e;
}
function qi(e, t) {
	if (e = L(e), e instanceof Error) return e;
	t === void 0 && (t = 1);
	let n = e.getDay();
	return Ei[t][n];
}
function Ji(e, t) {
	if (e = L(e), e instanceof Error) return e;
	if (t === void 0 && (t = 1), t === 21) return Ri(e);
	let n = Ti[t], r = new Date(e.getFullYear(), 0, 1), i = +(r.getDay() < n);
	return r -= Math.abs(r.getDay() - n) * 24 * 60 * 60 * 1e3, Math.floor((e - r) / (1e3 * 60 * 60 * 24) / 7 + 1) + i;
}
function Yi(e, t, n) {
	return Yi.INTL(e, t, 1, n);
}
Yi.INTL = (e, t, n, r) => {
	if (e = L(e), e instanceof Error) return e;
	if (t = R(t), t instanceof Error) return t;
	if (n = n === void 0 ? Di[1] : Di[n], !(n instanceof Array)) return d;
	r === void 0 ? r = [] : r instanceof Array || (r = [r]);
	for (let e = 0; e < r.length; e++) {
		let t = L(r[e]);
		if (t instanceof Error) return t;
		r[e] = t;
	}
	let i = 0, a = Math.sign(t);
	for (; i < t * a;) {
		e.setDate(e.getDate() + a);
		let t = e.getDay();
		if (!(t === n[0] || t === n[1])) {
			for (let t = 0; t < r.length; t++) {
				let n = r[t];
				if (n.getDate() === e.getDate() && n.getMonth() === e.getMonth() && n.getFullYear() === e.getFullYear()) {
					i--;
					break;
				}
			}
			i++;
		}
	}
	return e.getFullYear() < 1900 ? d : e;
};
function Xi(e) {
	return e = L(e), e instanceof Error ? e : e.getFullYear();
}
function Zi(e) {
	return new Date(e, 1, 29).getMonth() === 1;
}
function Qi(e, t) {
	return Math.ceil((t - e) / 1e3 / 60 / 60 / 24);
}
function $i(e, t, n) {
	if (e = L(e), e instanceof Error) return e;
	if (t = L(t), t instanceof Error) return t;
	n ||= 0;
	let r = e.getDate(), i = e.getMonth() + 1, a = e.getFullYear(), o = t.getDate(), s = t.getMonth() + 1, c = t.getFullYear();
	switch (n) {
		case 0: return r === 31 && o === 31 ? (r = 30, o = 30) : r === 31 ? r = 30 : r === 30 && o === 31 && (o = 30), (o + s * 30 + c * 360 - (r + i * 30 + a * 360)) / 360;
		case 1: {
			let n = (e, t) => {
				let n = e.getFullYear(), r = new Date(n, 2, 1);
				if (Zi(n) && e < r && t >= r) return !0;
				let i = t.getFullYear(), a = new Date(i, 2, 1);
				return Zi(i) && t >= a && e < a;
			}, l = 365;
			if (a === c || a + 1 === c && (i > s || i === s && r >= o)) return (a === c && Zi(a) || n(e, t) || s === 1 && o === 29) && (l = 366), Qi(e, t) / l;
			let u = c - a + 1, d = (new Date(c + 1, 0, 1) - new Date(a, 0, 1)) / 1e3 / 60 / 60 / 24 / u;
			return Qi(e, t) / d;
		}
		case 2: return Qi(e, t) / 360;
		case 3: return Qi(e, t) / 365;
		case 4: return (o + s * 30 + c * 360 - (r + i * 30 + a * 360)) / 360;
	}
}
function ea(e) {
	return /^[01]{1,10}$/.test(e);
}
function ta(e, t) {
	return e = R(e), t = R(t), I(e, t) ? d : c.default.besseli(e, t);
}
function na(e, t) {
	return e = R(e), t = R(t), I(e, t) ? d : c.default.besselj(e, t);
}
function ra(e, t) {
	return e = R(e), t = R(t), I(e, t) ? d : c.default.besselk(e, t);
}
function ia(e, t) {
	return e = R(e), t = R(t), I(e, t) ? d : c.default.bessely(e, t);
}
function aa(e) {
	if (!ea(e)) return m;
	let t = parseInt(e, 2), n = e.toString();
	return n.length === 10 && n.substring(0, 1) === "1" ? parseInt(n.substring(1), 2) - 512 : t;
}
function oa(e, t) {
	if (!ea(e)) return m;
	let n = e.toString();
	if (n.length === 10 && n.substring(0, 1) === "1") return (0xfffffffe00 + parseInt(n.substring(1), 2)).toString(16);
	let r = parseInt(e, 2).toString(16);
	return t === void 0 ? r : isNaN(t) ? d : t < 0 ? m : (t = Math.floor(t), t >= r.length ? H("0", t - r.length) + r : m);
}
function sa(e, t) {
	if (!ea(e)) return m;
	let n = e.toString();
	if (n.length === 10 && n.substring(0, 1) === "1") return (1073741312 + parseInt(n.substring(1), 2)).toString(8);
	let r = parseInt(e, 2).toString(8);
	return t === void 0 ? r : isNaN(t) ? d : t < 0 ? m : (t = Math.floor(t), t >= r.length ? H("0", t - r.length) + r : m);
}
function ca(e, t) {
	return e = R(e), t = R(t), I(e, t) ? d : e < 0 || t < 0 || Math.floor(e) !== e || Math.floor(t) !== t || e > 0xffffffffffff || t > 0xffffffffffff ? m : e & t;
}
function la(e, t) {
	return e = R(e), t = R(t), I(e, t) ? d : e < 0 || Math.floor(e) !== e || e > 0xffffffffffff || Math.abs(t) > 53 ? m : t >= 0 ? e << t : e >> -t;
}
function ua(e, t) {
	return e = R(e), t = R(t), I(e, t) ? d : e < 0 || t < 0 || Math.floor(e) !== e || Math.floor(t) !== t || e > 0xffffffffffff || t > 0xffffffffffff ? m : e | t;
}
function da(e, t) {
	return e = R(e), t = R(t), I(e, t) ? d : e < 0 || Math.floor(e) !== e || e > 0xffffffffffff || Math.abs(t) > 53 ? m : t >= 0 ? e >> t : e << -t;
}
function fa(e, t) {
	return e = R(e), t = R(t), I(e, t) ? d : e < 0 || t < 0 || Math.floor(e) !== e || Math.floor(t) !== t || e > 0xffffffffffff || t > 0xffffffffffff ? m : e ^ t;
}
function X(e, t, n) {
	if (e = R(e), t = R(t), I(e, t)) return e;
	if (n = n === void 0 ? "i" : n, n !== "i" && n !== "j") return d;
	if (e === 0 && t === 0) return 0;
	if (e === 0) return t === 1 ? n : t.toString() + n;
	if (t === 0) return e.toString();
	{
		let r = t > 0 ? "+" : "";
		return e.toString() + r + (t === 1 ? n : t.toString() + n);
	}
}
function pa(e, t, n) {
	if (e = R(e), e instanceof Error) return e;
	let r = [
		[
			"a.u. of action",
			"?",
			null,
			"action",
			!1,
			!1,
			105457168181818e-48
		],
		[
			"a.u. of charge",
			"e",
			null,
			"electric_charge",
			!1,
			!1,
			160217653141414e-33
		],
		[
			"a.u. of energy",
			"Eh",
			null,
			"energy",
			!1,
			!1,
			435974417757576e-32
		],
		[
			"a.u. of length",
			"a?",
			null,
			"length",
			!1,
			!1,
			529177210818182e-25
		],
		[
			"a.u. of mass",
			"m?",
			null,
			"mass",
			!1,
			!1,
			910938261616162e-45
		],
		[
			"a.u. of time",
			"?/Eh",
			null,
			"time",
			!1,
			!1,
			241888432650516e-31
		],
		[
			"admiralty knot",
			"admkn",
			null,
			"speed",
			!1,
			!0,
			.514773333
		],
		[
			"ampere",
			"A",
			null,
			"electric_current",
			!0,
			!1,
			1
		],
		[
			"ampere per meter",
			"A/m",
			null,
			"magnetic_field_intensity",
			!0,
			!1,
			1
		],
		[
			"ångström",
			"Å",
			["ang"],
			"length",
			!1,
			!0,
			1e-10
		],
		[
			"are",
			"ar",
			null,
			"area",
			!1,
			!0,
			100
		],
		[
			"astronomical unit",
			"ua",
			null,
			"length",
			!1,
			!1,
			149597870691667e-25
		],
		[
			"bar",
			"bar",
			null,
			"pressure",
			!1,
			!1,
			1e5
		],
		[
			"barn",
			"b",
			null,
			"area",
			!1,
			!1,
			1e-28
		],
		[
			"becquerel",
			"Bq",
			null,
			"radioactivity",
			!0,
			!1,
			1
		],
		[
			"bit",
			"bit",
			["b"],
			"information",
			!1,
			!0,
			1
		],
		[
			"btu",
			"BTU",
			["btu"],
			"energy",
			!1,
			!0,
			1055.05585262
		],
		[
			"byte",
			"byte",
			null,
			"information",
			!1,
			!0,
			8
		],
		[
			"candela",
			"cd",
			null,
			"luminous_intensity",
			!0,
			!1,
			1
		],
		[
			"candela per square metre",
			"cd/m?",
			null,
			"luminance",
			!0,
			!1,
			1
		],
		[
			"coulomb",
			"C",
			null,
			"electric_charge",
			!0,
			!1,
			1
		],
		[
			"cubic ångström",
			"ang3",
			["ang^3"],
			"volume",
			!1,
			!0,
			1e-30
		],
		[
			"cubic foot",
			"ft3",
			["ft^3"],
			"volume",
			!1,
			!0,
			.028316846592
		],
		[
			"cubic inch",
			"in3",
			["in^3"],
			"volume",
			!1,
			!0,
			16387064e-12
		],
		[
			"cubic light-year",
			"ly3",
			["ly^3"],
			"volume",
			!1,
			!0,
			846786664623715e-61
		],
		[
			"cubic metre",
			"m3",
			["m^3"],
			"volume",
			!0,
			!0,
			1
		],
		[
			"cubic mile",
			"mi3",
			["mi^3"],
			"volume",
			!1,
			!0,
			4168181825.44058
		],
		[
			"cubic nautical mile",
			"Nmi3",
			["Nmi^3"],
			"volume",
			!1,
			!0,
			6352182208
		],
		[
			"cubic Pica",
			"Pica3",
			[
				"Picapt3",
				"Pica^3",
				"Picapt^3"
			],
			"volume",
			!1,
			!0,
			7.58660370370369e-8
		],
		[
			"cubic yard",
			"yd3",
			["yd^3"],
			"volume",
			!1,
			!0,
			.764554857984
		],
		[
			"cup",
			"cup",
			null,
			"volume",
			!1,
			!0,
			.0002365882365
		],
		[
			"dalton",
			"Da",
			["u"],
			"mass",
			!1,
			!1,
			166053886282828e-41
		],
		[
			"day",
			"d",
			["day"],
			"time",
			!1,
			!0,
			86400
		],
		[
			"degree",
			"°",
			null,
			"angle",
			!1,
			!1,
			.0174532925199433
		],
		[
			"degrees Rankine",
			"Rank",
			null,
			"temperature",
			!1,
			!0,
			.555555555555556
		],
		[
			"dyne",
			"dyn",
			["dy"],
			"force",
			!1,
			!0,
			1e-5
		],
		[
			"electronvolt",
			"eV",
			["ev"],
			"energy",
			!1,
			!0,
			1.60217656514141
		],
		[
			"ell",
			"ell",
			null,
			"length",
			!1,
			!0,
			1.143
		],
		[
			"erg",
			"erg",
			["e"],
			"energy",
			!1,
			!0,
			1e-7
		],
		[
			"farad",
			"F",
			null,
			"electric_capacitance",
			!0,
			!1,
			1
		],
		[
			"fluid ounce",
			"oz",
			null,
			"volume",
			!1,
			!0,
			295735295625e-16
		],
		[
			"foot",
			"ft",
			null,
			"length",
			!1,
			!0,
			.3048
		],
		[
			"foot-pound",
			"flb",
			null,
			"energy",
			!1,
			!0,
			1.3558179483314
		],
		[
			"gal",
			"Gal",
			null,
			"acceleration",
			!1,
			!1,
			.01
		],
		[
			"gallon",
			"gal",
			null,
			"volume",
			!1,
			!0,
			.003785411784
		],
		[
			"gauss",
			"G",
			["ga"],
			"magnetic_flux_density",
			!1,
			!0,
			1
		],
		[
			"grain",
			"grain",
			null,
			"mass",
			!1,
			!0,
			647989e-10
		],
		[
			"gram",
			"g",
			null,
			"mass",
			!1,
			!0,
			.001
		],
		[
			"gray",
			"Gy",
			null,
			"absorbed_dose",
			!0,
			!1,
			1
		],
		[
			"gross registered ton",
			"GRT",
			["regton"],
			"volume",
			!1,
			!0,
			2.8316846592
		],
		[
			"hectare",
			"ha",
			null,
			"area",
			!1,
			!0,
			1e4
		],
		[
			"henry",
			"H",
			null,
			"inductance",
			!0,
			!1,
			1
		],
		[
			"hertz",
			"Hz",
			null,
			"frequency",
			!0,
			!1,
			1
		],
		[
			"horsepower",
			"HP",
			["h"],
			"power",
			!1,
			!0,
			745.69987158227
		],
		[
			"horsepower-hour",
			"HPh",
			["hh", "hph"],
			"energy",
			!1,
			!0,
			2684519.538
		],
		[
			"hour",
			"h",
			["hr"],
			"time",
			!1,
			!0,
			3600
		],
		[
			"imperial gallon (U.K.)",
			"uk_gal",
			null,
			"volume",
			!1,
			!0,
			.00454609
		],
		[
			"imperial hundredweight",
			"lcwt",
			["uk_cwt", "hweight"],
			"mass",
			!1,
			!0,
			50.802345
		],
		[
			"imperial quart (U.K)",
			"uk_qt",
			null,
			"volume",
			!1,
			!0,
			.0011365225
		],
		[
			"imperial ton",
			"brton",
			["uk_ton", "LTON"],
			"mass",
			!1,
			!0,
			1016.046909
		],
		[
			"inch",
			"in",
			null,
			"length",
			!1,
			!0,
			.0254
		],
		[
			"international acre",
			"uk_acre",
			null,
			"area",
			!1,
			!0,
			4046.8564224
		],
		[
			"IT calorie",
			"cal",
			null,
			"energy",
			!1,
			!0,
			4.1868
		],
		[
			"joule",
			"J",
			null,
			"energy",
			!0,
			!0,
			1
		],
		[
			"katal",
			"kat",
			null,
			"catalytic_activity",
			!0,
			!1,
			1
		],
		[
			"kelvin",
			"K",
			["kel"],
			"temperature",
			!0,
			!0,
			1
		],
		[
			"kilogram",
			"kg",
			null,
			"mass",
			!0,
			!0,
			1
		],
		[
			"knot",
			"kn",
			null,
			"speed",
			!1,
			!0,
			.514444444444444
		],
		[
			"light-year",
			"ly",
			null,
			"length",
			!1,
			!0,
			9460730472580800
		],
		[
			"litre",
			"L",
			["l", "lt"],
			"volume",
			!1,
			!0,
			.001
		],
		[
			"lumen",
			"lm",
			null,
			"luminous_flux",
			!0,
			!1,
			1
		],
		[
			"lux",
			"lx",
			null,
			"illuminance",
			!0,
			!1,
			1
		],
		[
			"maxwell",
			"Mx",
			null,
			"magnetic_flux",
			!1,
			!1,
			1e-18
		],
		[
			"measurement ton",
			"MTON",
			null,
			"volume",
			!1,
			!0,
			1.13267386368
		],
		[
			"meter per hour",
			"m/h",
			["m/hr"],
			"speed",
			!1,
			!0,
			.00027777777777778
		],
		[
			"meter per second",
			"m/s",
			["m/sec"],
			"speed",
			!0,
			!0,
			1
		],
		[
			"meter per second squared",
			"m?s??",
			null,
			"acceleration",
			!0,
			!1,
			1
		],
		[
			"parsec",
			"pc",
			["parsec"],
			"length",
			!1,
			!0,
			0x6da012f958ee1c
		],
		[
			"meter squared per second",
			"m?/s",
			null,
			"kinematic_viscosity",
			!0,
			!1,
			1
		],
		[
			"metre",
			"m",
			null,
			"length",
			!0,
			!0,
			1
		],
		[
			"miles per hour",
			"mph",
			null,
			"speed",
			!1,
			!0,
			.44704
		],
		[
			"millimetre of mercury",
			"mmHg",
			null,
			"pressure",
			!1,
			!1,
			133.322
		],
		[
			"minute",
			"?",
			null,
			"angle",
			!1,
			!1,
			.000290888208665722
		],
		[
			"minute",
			"min",
			["mn"],
			"time",
			!1,
			!0,
			60
		],
		[
			"modern teaspoon",
			"tspm",
			null,
			"volume",
			!1,
			!0,
			5e-6
		],
		[
			"mole",
			"mol",
			null,
			"amount_of_substance",
			!0,
			!1,
			1
		],
		[
			"morgen",
			"Morgen",
			null,
			"area",
			!1,
			!0,
			2500
		],
		[
			"n.u. of action",
			"?",
			null,
			"action",
			!1,
			!1,
			105457168181818e-48
		],
		[
			"n.u. of mass",
			"m?",
			null,
			"mass",
			!1,
			!1,
			910938261616162e-45
		],
		[
			"n.u. of speed",
			"c?",
			null,
			"speed",
			!1,
			!1,
			299792458
		],
		[
			"n.u. of time",
			"?/(me?c??)",
			null,
			"time",
			!1,
			!1,
			128808866778687e-35
		],
		[
			"nautical mile",
			"M",
			["Nmi"],
			"length",
			!1,
			!0,
			1852
		],
		[
			"newton",
			"N",
			null,
			"force",
			!0,
			!0,
			1
		],
		[
			"œrsted",
			"Oe ",
			null,
			"magnetic_field_intensity",
			!1,
			!1,
			79.5774715459477
		],
		[
			"ohm",
			"Ω",
			null,
			"electric_resistance",
			!0,
			!1,
			1
		],
		[
			"ounce mass",
			"ozm",
			null,
			"mass",
			!1,
			!0,
			.028349523125
		],
		[
			"pascal",
			"Pa",
			null,
			"pressure",
			!0,
			!1,
			1
		],
		[
			"pascal second",
			"Pa?s",
			null,
			"dynamic_viscosity",
			!0,
			!1,
			1
		],
		[
			"pferdestärke",
			"PS",
			null,
			"power",
			!1,
			!0,
			735.49875
		],
		[
			"phot",
			"ph",
			null,
			"illuminance",
			!1,
			!1,
			1e-4
		],
		[
			"pica (1/6 inch)",
			"pica",
			null,
			"length",
			!1,
			!0,
			.00035277777777778
		],
		[
			"pica (1/72 inch)",
			"Pica",
			["Picapt"],
			"length",
			!1,
			!0,
			.00423333333333333
		],
		[
			"poise",
			"P",
			null,
			"dynamic_viscosity",
			!1,
			!1,
			.1
		],
		[
			"pond",
			"pond",
			null,
			"force",
			!1,
			!0,
			.00980665
		],
		[
			"pound force",
			"lbf",
			null,
			"force",
			!1,
			!0,
			4.4482216152605
		],
		[
			"pound mass",
			"lbm",
			null,
			"mass",
			!1,
			!0,
			.45359237
		],
		[
			"quart",
			"qt",
			null,
			"volume",
			!1,
			!0,
			.000946352946
		],
		[
			"radian",
			"rad",
			null,
			"angle",
			!0,
			!1,
			1
		],
		[
			"second",
			"?",
			null,
			"angle",
			!1,
			!1,
			484813681109536e-20
		],
		[
			"second",
			"s",
			["sec"],
			"time",
			!0,
			!0,
			1
		],
		[
			"short hundredweight",
			"cwt",
			["shweight"],
			"mass",
			!1,
			!0,
			45.359237
		],
		[
			"siemens",
			"S",
			null,
			"electrical_conductance",
			!0,
			!1,
			1
		],
		[
			"sievert",
			"Sv",
			null,
			"equivalent_dose",
			!0,
			!1,
			1
		],
		[
			"slug",
			"sg",
			null,
			"mass",
			!1,
			!0,
			14.59390294
		],
		[
			"square ångström",
			"ang2",
			["ang^2"],
			"area",
			!1,
			!0,
			1e-20
		],
		[
			"square foot",
			"ft2",
			["ft^2"],
			"area",
			!1,
			!0,
			.09290304
		],
		[
			"square inch",
			"in2",
			["in^2"],
			"area",
			!1,
			!0,
			64516e-8
		],
		[
			"square light-year",
			"ly2",
			["ly^2"],
			"area",
			!1,
			!0,
			895054210748189e17
		],
		[
			"square meter",
			"m?",
			null,
			"area",
			!0,
			!0,
			1
		],
		[
			"square mile",
			"mi2",
			["mi^2"],
			"area",
			!1,
			!0,
			2589988.110336
		],
		[
			"square nautical mile",
			"Nmi2",
			["Nmi^2"],
			"area",
			!1,
			!0,
			3429904
		],
		[
			"square Pica",
			"Pica2",
			[
				"Picapt2",
				"Pica^2",
				"Picapt^2"
			],
			"area",
			!1,
			!0,
			1792111111111e-17
		],
		[
			"square yard",
			"yd2",
			["yd^2"],
			"area",
			!1,
			!0,
			.83612736
		],
		[
			"statute mile",
			"mi",
			null,
			"length",
			!1,
			!0,
			1609.344
		],
		[
			"steradian",
			"sr",
			null,
			"solid_angle",
			!0,
			!1,
			1
		],
		[
			"stilb",
			"sb",
			null,
			"luminance",
			!1,
			!1,
			1e-4
		],
		[
			"stokes",
			"St",
			null,
			"kinematic_viscosity",
			!1,
			!1,
			1e-4
		],
		[
			"stone",
			"stone",
			null,
			"mass",
			!1,
			!0,
			6.35029318
		],
		[
			"tablespoon",
			"tbs",
			null,
			"volume",
			!1,
			!0,
			147868e-10
		],
		[
			"teaspoon",
			"tsp",
			null,
			"volume",
			!1,
			!0,
			492892e-11
		],
		[
			"tesla",
			"T",
			null,
			"magnetic_flux_density",
			!0,
			!0,
			1
		],
		[
			"thermodynamic calorie",
			"c",
			null,
			"energy",
			!1,
			!0,
			4.184
		],
		[
			"ton",
			"ton",
			null,
			"mass",
			!1,
			!0,
			907.18474
		],
		[
			"tonne",
			"t",
			null,
			"mass",
			!1,
			!1,
			1e3
		],
		[
			"U.K. pint",
			"uk_pt",
			null,
			"volume",
			!1,
			!0,
			.00056826125
		],
		[
			"U.S. bushel",
			"bushel",
			null,
			"volume",
			!1,
			!0,
			.03523907
		],
		[
			"U.S. oil barrel",
			"barrel",
			null,
			"volume",
			!1,
			!0,
			.158987295
		],
		[
			"U.S. pint",
			"pt",
			["us_pt"],
			"volume",
			!1,
			!0,
			.000473176473
		],
		[
			"U.S. survey mile",
			"survey_mi",
			null,
			"length",
			!1,
			!0,
			1609.347219
		],
		[
			"U.S. survey/statute acre",
			"us_acre",
			null,
			"area",
			!1,
			!0,
			4046.87261
		],
		[
			"volt",
			"V",
			null,
			"voltage",
			!0,
			!1,
			1
		],
		[
			"watt",
			"W",
			null,
			"power",
			!0,
			!0,
			1
		],
		[
			"watt-hour",
			"Wh",
			["wh"],
			"energy",
			!1,
			!0,
			3600
		],
		[
			"weber",
			"Wb",
			null,
			"magnetic_flux",
			!0,
			!1,
			1
		],
		[
			"yard",
			"yd",
			null,
			"length",
			!1,
			!0,
			.9144
		],
		[
			"year",
			"yr",
			null,
			"time",
			!1,
			!0,
			31557600
		]
	], i = {
		Yi: [
			"yobi",
			80,
			12089258196146292e8,
			"Yi",
			"yotta"
		],
		Zi: [
			"zebi",
			70,
			0x400000000000000000,
			"Zi",
			"zetta"
		],
		Ei: [
			"exbi",
			60,
			0x1000000000000000,
			"Ei",
			"exa"
		],
		Pi: [
			"pebi",
			50,
			0x4000000000000,
			"Pi",
			"peta"
		],
		Ti: [
			"tebi",
			40,
			1099511627776,
			"Ti",
			"tera"
		],
		Gi: [
			"gibi",
			30,
			1073741824,
			"Gi",
			"giga"
		],
		Mi: [
			"mebi",
			20,
			1048576,
			"Mi",
			"mega"
		],
		ki: [
			"kibi",
			10,
			1024,
			"ki",
			"kilo"
		]
	}, a = {
		Y: [
			"yotta",
			1e24,
			"Y"
		],
		Z: [
			"zetta",
			1e21,
			"Z"
		],
		E: [
			"exa",
			0xde0b6b3a7640000,
			"E"
		],
		P: [
			"peta",
			0x38d7ea4c68000,
			"P"
		],
		T: [
			"tera",
			0xe8d4a51000,
			"T"
		],
		G: [
			"giga",
			1e9,
			"G"
		],
		M: [
			"mega",
			1e6,
			"M"
		],
		k: [
			"kilo",
			1e3,
			"k"
		],
		h: [
			"hecto",
			100,
			"h"
		],
		e: [
			"dekao",
			10,
			"e"
		],
		d: [
			"deci",
			.1,
			"d"
		],
		c: [
			"centi",
			.01,
			"c"
		],
		m: [
			"milli",
			.001,
			"m"
		],
		u: [
			"micro",
			1e-6,
			"u"
		],
		n: [
			"nano",
			1e-9,
			"n"
		],
		p: [
			"pico",
			1e-12,
			"p"
		],
		f: [
			"femto",
			1e-15,
			"f"
		],
		a: [
			"atto",
			1e-18,
			"a"
		],
		z: [
			"zepto",
			1e-21,
			"z"
		],
		y: [
			"yocto",
			1e-24,
			"y"
		]
	}, o = null, s = null, c = t, l = n, u = 1, d = 1, f;
	for (let e = 0; e < r.length; e++) f = r[e][2] === null ? [] : r[e][2], (r[e][1] === c || f.indexOf(c) >= 0) && (o = r[e]), (r[e][1] === l || f.indexOf(l) >= 0) && (s = r[e]);
	if (o === null) {
		let e = i[t.substring(0, 2)], n = a[t.substring(0, 1)];
		t.substring(0, 2) === "da" && (n = [
			"dekao",
			10,
			"da"
		]), e ? (u = e[2], c = t.substring(2)) : n && (u = n[1], c = t.substring(n[2].length));
		for (let e = 0; e < r.length; e++) f = r[e][2] === null ? [] : r[e][2], (r[e][1] === c || f.indexOf(c) >= 0) && (o = r[e]);
	}
	if (s === null) {
		let e = i[n.substring(0, 2)], t = a[n.substring(0, 1)];
		n.substring(0, 2) === "da" && (t = [
			"dekao",
			10,
			"da"
		]), e ? (d = e[2], l = n.substring(2)) : t && (d = t[1], l = n.substring(t[2].length));
		for (let e = 0; e < r.length; e++) f = r[e][2] === null ? [] : r[e][2], (r[e][1] === l || f.indexOf(l) >= 0) && (s = r[e]);
	}
	return o === null || s === null || o[3] !== s[3] ? h : e * o[6] * u / (s[6] * d);
}
function ma(e, t) {
	if (e = R(e), e instanceof Error) return e;
	if (!/^-?[0-9]{1,3}$/.test(e) || e < -512 || e > 511) return m;
	if (e < 0) return "1" + H("0", 9 - (512 + e).toString(2).length) + (512 + e).toString(2);
	let n = parseInt(e, 10).toString(2);
	return t === void 0 ? n : isNaN(t) ? d : t < 0 ? m : (t = Math.floor(t), t >= n.length ? H("0", t - n.length) + n : m);
}
function ha(e, t) {
	if (e = R(e), e instanceof Error) return e;
	if (!/^-?[0-9]{1,12}$/.test(e) || e < -549755813888 || e > 549755813887) return m;
	if (e < 0) return (1099511627776 + e).toString(16);
	let n = parseInt(e, 10).toString(16);
	return t === void 0 ? n : isNaN(t) ? d : t < 0 ? m : (t = Math.floor(t), t >= n.length ? H("0", t - n.length) + n : m);
}
function ga(e, t) {
	if (e = R(e), e instanceof Error) return e;
	if (!/^-?[0-9]{1,9}$/.test(e) || e < -536870912 || e > 536870911) return m;
	if (e < 0) return (1073741824 + e).toString(8);
	let n = parseInt(e, 10).toString(8);
	return t === void 0 ? n : isNaN(t) ? d : t < 0 ? m : (t = Math.floor(t), t >= n.length ? H("0", t - n.length) + n : m);
}
function _a(e, t) {
	return t = t === void 0 ? 0 : t, e = R(e), t = R(t), I(e, t) ? d : +(e === t);
}
function va(e, t) {
	return t = t === void 0 ? 0 : t, e = R(e), t = R(t), I(e, t) ? d : s.default.erf(e);
}
function ya(e) {
	return isNaN(e) ? d : s.default.erfc(e);
}
function ba(e, t) {
	return t ||= 0, e = R(e), I(t, e) ? e : +(e >= t);
}
function xa(e, t) {
	if (!/^[0-9A-Fa-f]{1,10}$/.test(e)) return m;
	let n = e.length === 10 && e.substring(0, 1).toLowerCase() === "f", r = n ? parseInt(e, 16) - 1099511627776 : parseInt(e, 16);
	if (r < -512 || r > 511) return m;
	if (n) return "1" + H("0", 9 - (512 + r).toString(2).length) + (512 + r).toString(2);
	let i = r.toString(2);
	return t === void 0 ? i : isNaN(t) ? d : t < 0 ? m : (t = Math.floor(t), t >= i.length ? H("0", t - i.length) + i : m);
}
function Sa(e) {
	if (!/^[0-9A-Fa-f]{1,10}$/.test(e)) return m;
	let t = parseInt(e, 16);
	return t >= 549755813888 ? t - 1099511627776 : t;
}
function Ca(e, t) {
	if (!/^[0-9A-Fa-f]{1,10}$/.test(e)) return m;
	let n = parseInt(e, 16);
	if (n > 536870911 && n < 0xffe0000000) return m;
	if (n >= 0xffe0000000) return (n - 0xffc0000000).toString(8);
	let r = n.toString(8);
	return t === void 0 ? r : isNaN(t) ? d : t < 0 ? m : (t = Math.floor(t), t >= r.length ? H("0", t - r.length) + r : m);
}
function wa(e) {
	let t = Q(e), n = Z(e);
	return I(t, n) ? d : Math.sqrt(t ** 2 + n ** 2);
}
function Z(e) {
	if (e === void 0 || e === !0 || e === !1) return d;
	if (e === 0 || e === "0") return 0;
	if (["i", "j"].indexOf(e) >= 0) return 1;
	e += "", e = e.replace("+i", "+1i").replace("-i", "-1i").replace("+j", "+1j").replace("-j", "-1j");
	let t = e.indexOf("+"), n = e.indexOf("-");
	t === 0 && (t = e.indexOf("+", 1)), n === 0 && (n = e.indexOf("-", 1));
	let r = e.substring(e.length - 1, e.length), i = r === "i" || r === "j";
	return t >= 0 || n >= 0 ? i ? t >= 0 ? isNaN(e.substring(0, t)) || isNaN(e.substring(t + 1, e.length - 1)) ? m : Number(e.substring(t + 1, e.length - 1)) : isNaN(e.substring(0, n)) || isNaN(e.substring(n + 1, e.length - 1)) ? m : -Number(e.substring(n + 1, e.length - 1)) : m : i ? isNaN(e.substring(0, e.length - 1)) ? m : e.substring(0, e.length - 1) : isNaN(e) ? m : 0;
}
function Ta(e) {
	let t = Q(e), n = Z(e);
	return I(t, n) ? d : t === 0 && n === 0 ? u : t === 0 && n > 0 ? Math.PI / 2 : t === 0 && n < 0 ? -Math.PI / 2 : n === 0 && t > 0 ? 0 : n === 0 && t < 0 ? -Math.PI : t > 0 ? Math.atan(n / t) : t < 0 && n >= 0 ? Math.atan(n / t) + Math.PI : Math.atan(n / t) - Math.PI;
}
function Ea(e) {
	let t = Q(e), n = Z(e);
	if (I(t, n)) return d;
	let r = e.substring(e.length - 1);
	return r = r === "i" || r === "j" ? r : "i", n === 0 ? e : X(t, -n, r);
}
function Da(e) {
	let t = Q(e), n = Z(e);
	if (I(t, n)) return d;
	let r = e.substring(e.length - 1);
	return r = r === "i" || r === "j" ? r : "i", X(Math.cos(t) * (Math.exp(n) + Math.exp(-n)) / 2, -Math.sin(t) * (Math.exp(n) - Math.exp(-n)) / 2, r);
}
function Oa(e) {
	let t = Q(e), n = Z(e);
	if (I(t, n)) return d;
	let r = e.substring(e.length - 1);
	return r = r === "i" || r === "j" ? r : "i", X(Math.cos(n) * (Math.exp(t) + Math.exp(-t)) / 2, Math.sin(n) * (Math.exp(t) - Math.exp(-t)) / 2, r);
}
function ka(e) {
	return I(Q(e), Z(e)) ? d : Aa(Da(e), za(e));
}
function Aa(e, t) {
	let n = Q(e), r = Z(e), i = Q(t), a = Z(t);
	if (I(n, r, i, a)) return d;
	let o = e.substring(e.length - 1), s = t.substring(t.length - 1), c = "i";
	if ((o === "j" || s === "j") && (c = "j"), i === 0 && a === 0) return m;
	let l = i * i + a * a;
	return X((n * i + r * a) / l, (r * i - n * a) / l, c);
}
function ja(e) {
	let t = Q(e), n = Z(e);
	if (I(t, n)) return d;
	let r = e.substring(e.length - 1);
	r = r === "i" || r === "j" ? r : "i";
	let i = Math.exp(t);
	return X(i * Math.cos(n), i * Math.sin(n), r);
}
function Ma(e) {
	let t = Q(e), n = Z(e);
	if (I(t, n)) return d;
	let r = e.substring(e.length - 1);
	return r = r === "i" || r === "j" ? r : "i", X(Math.log(Math.sqrt(t * t + n * n)), Math.atan(n / t), r);
}
function Na(e) {
	let t = Q(e), n = Z(e);
	if (I(t, n)) return d;
	let r = e.substring(e.length - 1);
	return r = r === "i" || r === "j" ? r : "i", X(Math.log(Math.sqrt(t * t + n * n)) / Math.log(10), Math.atan(n / t) / Math.log(10), r);
}
function Pa(e) {
	let t = Q(e), n = Z(e);
	if (I(t, n)) return d;
	let r = e.substring(e.length - 1);
	return r = r === "i" || r === "j" ? r : "i", X(Math.log(Math.sqrt(t * t + n * n)) / Math.log(2), Math.atan(n / t) / Math.log(2), r);
}
function Fa(e, t) {
	t = R(t);
	let n = Q(e), r = Z(e);
	if (I(t, n, r)) return d;
	let i = e.substring(e.length - 1);
	i = i === "i" || i === "j" ? i : "i";
	let a = wa(e) ** +t, o = Ta(e);
	return X(a * Math.cos(t * o), a * Math.sin(t * o), i);
}
function Ia() {
	let e = arguments[0];
	if (!arguments.length) return d;
	for (let t = 1; t < arguments.length; t++) {
		let n = Q(e), r = Z(e), i = Q(arguments[t]), a = Z(arguments[t]);
		if (I(n, r, i, a)) return d;
		e = X(n * i - r * a, n * a + r * i);
	}
	return e;
}
function Q(e) {
	if (e === void 0 || e === !0 || e === !1) return d;
	if (e === 0 || e === "0" || [
		"i",
		"+i",
		"1i",
		"+1i",
		"-i",
		"-1i",
		"j",
		"+j",
		"1j",
		"+1j",
		"-j",
		"-1j"
	].indexOf(e) >= 0) return 0;
	e += "";
	let t = e.indexOf("+"), n = e.indexOf("-");
	t === 0 && (t = e.indexOf("+", 1)), n === 0 && (n = e.indexOf("-", 1));
	let r = e.substring(e.length - 1, e.length), i = r === "i" || r === "j";
	return t >= 0 || n >= 0 ? i ? t >= 0 ? isNaN(e.substring(0, t)) || isNaN(e.substring(t + 1, e.length - 1)) ? m : Number(e.substring(0, t)) : isNaN(e.substring(0, n)) || isNaN(e.substring(n + 1, e.length - 1)) ? m : Number(e.substring(0, n)) : m : i ? isNaN(e.substring(0, e.length - 1)) ? m : 0 : isNaN(e) ? m : e;
}
function La(e) {
	return e === !0 || e === !1 || I(Q(e), Z(e)) ? d : Aa("1", Da(e));
}
function Ra(e) {
	return I(Q(e), Z(e)) ? d : Aa("1", Oa(e));
}
function za(e) {
	let t = Q(e), n = Z(e);
	if (I(t, n)) return d;
	let r = e.substring(e.length - 1);
	return r = r === "i" || r === "j" ? r : "i", X(Math.sin(t) * (Math.exp(n) + Math.exp(-n)) / 2, Math.cos(t) * (Math.exp(n) - Math.exp(-n)) / 2, r);
}
function Ba(e) {
	let t = Q(e), n = Z(e);
	if (I(t, n)) return d;
	let r = e.substring(e.length - 1);
	return r = r === "i" || r === "j" ? r : "i", X(Math.cos(n) * (Math.exp(t) - Math.exp(-t)) / 2, Math.sin(n) * (Math.exp(t) + Math.exp(-t)) / 2, r);
}
function Va(e) {
	if (I(Q(e), Z(e))) return d;
	let t = e.substring(e.length - 1);
	t = t === "i" || t === "j" ? t : "i";
	let n = Math.sqrt(wa(e)), r = Ta(e);
	return X(n * Math.cos(r / 2), n * Math.sin(r / 2), t);
}
function Ha(e) {
	return e === !0 || e === !1 ? d : I(Q(e), Z(e)) ? m : Aa("1", za(e));
}
function Ua(e) {
	return e === !0 || e === !1 ? d : I(Q(e), Z(e)) ? m : Aa("1", Ba(e));
}
function Wa(e, t) {
	let n = Q(e), r = Z(e), i = Q(t), a = Z(t);
	if (I(n, r, i, a)) return d;
	let o = e.substring(e.length - 1), s = t.substring(t.length - 1), c = "i";
	return (o === "j" || s === "j") && (c = "j"), X(n - i, r - a, c);
}
function Ga() {
	if (!arguments.length) return d;
	let e = M(arguments), t = 0, n = 0;
	for (let r of e) {
		let e = +Q(r), i = +Z(r);
		if (I(e, i)) return d;
		t += e, n += i;
	}
	return X(t, n, "i");
}
function Ka(e) {
	return e === !0 || e === !1 || I(Q(e), Z(e)) ? d : Aa(za(e), Da(e));
}
function qa(e, t) {
	if (!/^[0-7]{1,10}$/.test(e)) return m;
	let n = e.length === 10 && e.substring(0, 1) === "7", r = n ? parseInt(e, 8) - 1073741824 : parseInt(e, 8);
	if (r < -512 || r > 511) return m;
	if (n) return "1" + H("0", 9 - (512 + r).toString(2).length) + (512 + r).toString(2);
	let i = r.toString(2);
	return t === void 0 ? i : isNaN(t) ? d : t < 0 ? m : (t = Math.floor(t), t >= i.length ? H("0", t - i.length) + i : m);
}
function Ja(e) {
	if (!/^[0-7]{1,10}$/.test(e)) return m;
	let t = parseInt(e, 8);
	return t >= 536870912 ? t - 1073741824 : t;
}
function Ya(e, t) {
	if (!/^[0-7]{1,10}$/.test(e)) return m;
	let n = parseInt(e, 8);
	if (n >= 536870912) return "ff" + (n + 3221225472).toString(16);
	let r = n.toString(16);
	return t === void 0 ? r : isNaN(t) ? d : t < 0 ? m : (t = Math.floor(t), t >= r.length ? H("0", t - r.length) + r : m);
}
var Xa = Lt.DIST, Za = Lt.INV, Qa = Rt.DIST, $a = ar.MATH, eo = ar.PRECISE, to = W.DIST, no = W.DIST.RT, ro = W.INV, io = W.INV.RT, ao = W.TEST, oo = Kt.P, so = Kt.P, co = Kt.S, lo = Rt.INV, uo = ya.PRECISE, fo = va.PRECISE, po = Jt.DIST, mo = G.DIST, ho = G.DIST.RT, go = G.INV, _o = G.INV.RT, vo = xr.MATH, yo = xr.PRECISE, bo = G.TEST, xo = $t.DIST, So = $t.INV, Co = en.PRECISE, wo = on.DIST, To = fn.INV, Eo = fn.DIST, Do = fn.INV, Oo = bn.MULT, ko = bn.SNGL, Ao = xn.DIST, jo = Vi.INTL, Mo = K.DIST, No = K.INV, Po = K.S.DIST, Fo = K.S.INV, Io = q.EXC, Lo = q.INC, Ro = Cn.EXC, zo = Cn.INC, Bo = Dn.DIST, Vo = kn.EXC, Ho = kn.INC, Uo = An.AVG, Wo = An.EQ, Go = Nn.P, Ko = J.P, qo = J.S, Jo = U.DIST, Yo = U.DIST.RT, Xo = U.INV, Zo = U.TEST, Qo = Y.P, $o = Y.S, es = Wn.DIST, ts = Yi.INTL, ns = Gn.TEST;
function rs(e) {
	let t = [];
	return j(e, (e) => {
		e && t.push(e);
	}), t;
}
function $(e, t) {
	let n = {};
	for (let t = 1; t < e[0].length; ++t) n[t] = !0;
	let r = t[0].length;
	for (let e = 1; e < t.length; ++e) t[e].length > r && (r = t[e].length);
	for (let i = 1; i < e.length; ++i) for (let a = 1; a < e[i].length; ++a) {
		let o = !1, s = !1;
		for (let n = 0; n < t.length; ++n) {
			let c = t[n];
			if (c.length < r) continue;
			let l = c[0];
			if (e[i][0] === l) {
				s = !0;
				for (let t = 1; t < c.length; ++t) if (!o) if (c[t] === void 0 || c[t] === "*") o = !0;
				else {
					let n = ce(c[t] + "");
					o = le([A(e[i][a], k)].concat(n));
				}
			}
		}
		s && (n[a] = n[a] && o);
	}
	let i = [];
	for (let t = 0; t < e[0].length; ++t) n[t] && i.push(t - 1);
	return i;
}
function is(e, t, n) {
	if (isNaN(t) && typeof t != "string") return d;
	let r = $(e, n), i = [];
	i = N(typeof t == "string" ? e[P(e, t)] : e[t]);
	let a = 0;
	return j(r, (e) => {
		a += i[e];
	}), r.length === 0 ? u : a / r.length;
}
function as(e, t, n) {
	if (isNaN(t) && typeof t != "string") return d;
	let r = $(e, n), i = [];
	i = N(typeof t == "string" ? e[P(e, t)] : e[t]);
	let a = [];
	return j(r, (e) => {
		a.push(i[e]);
	}), Vt(a);
}
function os(e, t, n) {
	if (isNaN(t) && typeof t != "string") return d;
	let r = $(e, n), i = [];
	i = N(typeof t == "string" ? e[P(e, t)] : e[t]);
	let a = [];
	return j(r, (e) => {
		a.push(i[e]);
	}), Ht(a);
}
function ss(e, t, n) {
	if (isNaN(t) && typeof t != "string") return d;
	let r = $(e, n), i = [];
	return i = N(typeof t == "string" ? e[P(e, t)] : e[t]), r.length === 0 ? d : r.length > 1 ? m : i[r[0]];
}
function cs(e, t, n) {
	if (isNaN(t) && typeof t != "string") return d;
	let r = $(e, n), i = [];
	i = N(typeof t == "string" ? e[P(e, t)] : e[t]);
	let a = i[r[0]];
	return j(r, (e) => {
		a < i[e] && (a = i[e]);
	}), a;
}
function ls(e, t, n) {
	if (isNaN(t) && typeof t != "string") return d;
	let r = $(e, n), i = [];
	i = N(typeof t == "string" ? e[P(e, t)] : e[t]);
	let a = i[r[0]];
	return j(r, (e) => {
		a > i[e] && (a = i[e]);
	}), a;
}
function us(e, t, n) {
	if (isNaN(t) && typeof t != "string") return d;
	let r = $(e, n), i = [];
	i = N(typeof t == "string" ? e[P(e, t)] : e[t]);
	let a = [];
	j(r, (e) => {
		a.push(i[e]);
	}), a = rs(a);
	let o = 1;
	return j(a, (e) => {
		o *= e;
	}), o;
}
function ds(e, t, n) {
	if (isNaN(t) && typeof t != "string") return d;
	let r = $(e, n), i = [];
	i = N(typeof t == "string" ? e[P(e, t)] : e[t]);
	let a = [];
	return j(r, (e) => {
		a.push(i[e]);
	}), a = rs(a), J.S(a);
}
function fs(e, t, n) {
	if (isNaN(t) && typeof t != "string") return d;
	let r = $(e, n), i = [];
	i = N(typeof t == "string" ? e[P(e, t)] : e[t]);
	let a = [];
	return j(r, (e) => {
		a.push(i[e]);
	}), a = rs(a), J.P(a);
}
function ps(e, t, n) {
	if (isNaN(t) && typeof t != "string") return d;
	let r = $(e, n), i = [];
	i = N(typeof t == "string" ? e[P(e, t)] : e[t]);
	let a = [];
	return j(r, (e) => {
		a.push(i[e]);
	}), ni(a);
}
function ms(e, t, n) {
	if (isNaN(t) && typeof t != "string") return d;
	let r = $(e, n), i = [];
	i = N(typeof t == "string" ? e[P(e, t)] : e[t]);
	let a = [];
	return j(r, (e) => {
		a.push(i[e]);
	}), Y.S(a);
}
function hs(e, t, n) {
	if (isNaN(t) && typeof t != "string") return d;
	let r = $(e, n), i = [];
	i = N(typeof t == "string" ? e[P(e, t)] : e[t]);
	let a = [];
	return j(r, (e) => {
		a.push(i[e]);
	}), Y.P(a);
}
function gs(e) {
	return e && e.getTime && !isNaN(e.getTime());
}
function _s(e) {
	return e instanceof Date ? e : new Date(e);
}
function vs(e, t, n) {
	let r = L(t);
	for (r.setFullYear(e.getFullYear()), r < e && r.setFullYear(r.getFullYear() + 1); r > e;) r.setMonth(r.getMonth() + -12 / n);
	return r;
}
function ys(e) {
	return e = R(e), [
		1,
		2,
		4
	].indexOf(e) === -1 ? m : e;
}
function bs(e) {
	return e = R(e), [
		0,
		1,
		2,
		3,
		4
	].indexOf(e) === -1 ? m : e;
}
function xs(e, t, n, r, i, a, o) {
	return e = _s(e), t = _s(t), n = _s(n), a = ys(a), o = bs(o), F(a, o) ? m : !gs(e) || !gs(t) || !gs(n) ? d : r <= 0 || i <= 0 || n <= e ? m : (i ||= 0, o ||= 0, i * r * $i(e, n, o));
}
function Ss(e, t, n, r) {
	if (r = bs(r), n = ys(n), e = L(e), t = L(t), F(e, t)) return d;
	if (F(n, r) || e >= t) return m;
	if (r === 1) {
		let r = vs(e, t, n), i = L(r);
		return i.setMonth(i.getMonth() + 12 / n), ki(r, i, "D");
	}
	let i;
	switch (r) {
		case 0:
		case 2:
		case 4:
			i = 360;
			break;
		case 3:
			i = 365;
			break;
		default: return m;
	}
	return i / n;
}
function Cs(e, t, n, r, i, a) {
	if (e = R(e), t = R(t), n = R(n), I(e, t, n)) return d;
	if (e <= 0 || t <= 0 || n <= 0 || r < 1 || i < 1 || r > i || a !== 0 && a !== 1) return m;
	let o = Vs(e, t, n, 0, a), s = 0;
	r === 1 && (a === 0 && (s = -n), r++);
	for (let t = r; t <= i; t++) s += a === 1 ? js(e, t - 2, o, n, 1) - o : js(e, t - 1, o, n, 0);
	return s *= e, s;
}
function ws(e, t, n, r, i, a) {
	if (e = R(e), t = R(t), n = R(n), I(e, t, n)) return d;
	if (e <= 0 || t <= 0 || n <= 0 || r < 1 || i < 1 || r > i || a !== 0 && a !== 1) return m;
	let o = Vs(e, t, n, 0, a), s = 0;
	r === 1 && (s = a === 0 ? o + n * e : o, r++);
	for (let t = r; t <= i; t++) s += a > 0 ? o - (js(e, t - 2, o, n, 1) - o) * e : o - js(e, t - 1, o, n, 0) * e;
	return s;
}
function Ts(e, t, n, r, i) {
	if (i = i === void 0 ? 12 : i, e = R(e), t = R(t), n = R(n), r = R(r), i = R(i), I(e, t, n, r, i)) return d;
	if (e < 0 || t < 0 || n < 0 || r < 0 || [
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12
	].indexOf(i) === -1 || r > n) return m;
	if (t >= e) return 0;
	let a = (1 - (t / e) ** (1 / n)).toFixed(3), o = e * a * i / 12, s = o, c = 0, l = r === n ? n - 1 : r;
	for (let t = 2; t <= l; t++) c = (e - s) * a, s += c;
	return r === 1 ? o : r === n ? (e - s) * a : c;
}
function Es(e, t, n, r, i) {
	if (i = i === void 0 ? 2 : i, e = R(e), t = R(t), n = R(n), r = R(r), i = R(i), I(e, t, n, r, i)) return d;
	if (e < 0 || t < 0 || n < 0 || r < 0 || i <= 0 || r > n) return m;
	if (t >= e) return 0;
	let a = 0, o = 0;
	for (let s = 1; s <= r; s++) o = Math.min((e - a) * (i / n), e - t - a), a += o;
	return o;
}
function Ds(e, t, n, r, i) {
	if (e = L(e), t = L(t), n = R(n), r = R(r), i = R(i), i ||= 0, I(e, t, n, r, i)) return d;
	if (n <= 0 || r <= 0) return m;
	if (e >= t) return d;
	let a, o;
	switch (i) {
		case 0:
			a = 360, o = Pi(e, t, !1);
			break;
		case 1:
			a = 365, o = ki(e, t, "D");
			break;
		case 2:
			a = 360, o = ki(e, t, "D");
			break;
		case 3:
			a = 365, o = ki(e, t, "D");
			break;
		case 4:
			a = 360, o = Pi(e, t, !0);
			break;
		default: return m;
	}
	return (r - n) / r * a / o;
}
function Os(e, t) {
	if (e = R(e), t = R(t), I(e, t)) return d;
	if (t < 0) return m;
	if (t >= 0 && t < 1) return u;
	t = parseInt(t, 10);
	let n = parseInt(e, 10);
	n += e % 1 * 10 ** Math.ceil(Math.log(t) / Math.LN10) / t;
	let r = 10 ** (Math.ceil(Math.log(t) / Math.LN2) + 1);
	return n = Math.round(n * r) / r, n;
}
function ks(e, t) {
	if (e = R(e), t = R(t), I(e, t)) return d;
	if (t < 0) return m;
	if (t >= 0 && t < 1) return u;
	t = parseInt(t, 10);
	let n = parseInt(e, 10);
	return n += e % 1 * 10 ** -Math.ceil(Math.log(t) / Math.LN10) * t, n;
}
function As(e, t) {
	return e = R(e), t = R(t), I(e, t) ? d : e <= 0 || t < 1 ? m : (t = parseInt(t, 10), (1 + e / t) ** +t - 1);
}
function js(e, t, n, r, i) {
	if (r ||= 0, i ||= 0, e = R(e), t = R(t), n = R(n), r = R(r), i = R(i), I(e, t, n, r, i)) return d;
	let a;
	if (e === 0) a = r + n * t;
	else {
		let o = (1 + e) ** +t;
		a = i === 1 ? r * o + n * (1 + e) * (o - 1) / e : r * o + n * (o - 1) / e;
	}
	return -a;
}
function Ms(e, t) {
	if (e = R(e), t = z(M(t)), I(e, t)) return d;
	let n = t.length, r = e;
	for (let e = 0; e < n; e++) r *= 1 + t[e];
	return r;
}
function Ns(e, t, n, r, i, a) {
	if (i ||= 0, a ||= 0, e = R(e), t = R(t), n = R(n), r = R(r), i = R(i), a = R(a), I(e, t, n, r, i, a)) return d;
	let o = Vs(e, n, r, i, a);
	return (t === 1 ? a === 1 ? 0 : -r : a === 1 ? js(e, t - 2, o, r, 1) - o : js(e, t - 1, o, r, 0)) * e;
}
function Ps(e, t) {
	if (t = typeof t == "number" ? t : t === void 0 ? .1 : R(t), e = M(e).filter(V), e = z(e), I(e, t)) return d;
	let n = new Float64Array(e.length), r = !1, i = !1;
	for (let t = 0; t < e.length; t++) n[t] = e[t], n[t] > 0 && (r = !0), n[t] < 0 && (i = !0);
	if (!r || !i) return m;
	let a = (e) => {
		e <= -1 && (e = -.999999999);
		let t = n[0], r = 1 + e, i = 1;
		for (let e = 1; e < n.length; e++) i *= r, t += n[e] / i;
		return t;
	}, o = /* @__PURE__ */ new Map(), s = function(e) {
		let t = Math.round(e * 1e10) / 1e10;
		if (o.has(t)) return o.get(t);
		let n = a(t);
		return o.set(t, n), n;
	};
	return function() {
		let e = 1e-10, n = 1e3, r = t, i = r, a = 0;
		for (; a < n;) {
			let t = s(r);
			if (Math.abs(t) < e) return r;
			if (a > 0 && Math.abs(r - i) < e * 10) break;
			let n = Math.max(1e-4, Math.abs(r * 1e-4)), o = (s(r + n) - t) / n;
			if (Math.abs(o) < e) break;
			i = r;
			let c = t / o, l = Math.max(.1, Math.abs(r) * .5);
			Math.abs(c) > l ? r -= Math.sign(c) * l : r -= c, r <= -1 && (r = -.99999999), r > 1e3 && (r = 1e3), a++;
		}
		let o = s(r);
		if (Math.abs(o) < e) return r;
		let c, l;
		if (o > 0) {
			for (c = r, l = r + .1; s(l) > 0 && l < 1e3;) l = l * 2 + .1;
			if (l >= 1e3) return r;
		} else {
			for (l = r, c = Math.max(-.99999999, r - .1); s(c) < 0 && c > -.99999999;) c = Math.max(-.99999999, c - .1);
			if (c <= -.99999999) return r;
		}
		let u;
		for (let t = 0; t < n; t++) {
			u = (c + l) / 2;
			let t = s(u);
			if (Math.abs(t) < e || Math.abs(l - c) < e) return u;
			t * s(c) < 0 ? l = u : c = u;
		}
		return u;
	}();
}
function Fs(e, t, n, r) {
	return e = R(e), t = R(t), n = R(n), r = R(r), I(e, t, n, r) ? d : r * e * (t / n - 1);
}
function Is(e, t, n) {
	if (e = z(M(e)), t = R(t), n = R(n), I(e, t, n)) return d;
	let r = e.length, i = [], a = [];
	for (let t = 0; t < r; t++) e[t] < 0 ? i.push(e[t]) : a.push(e[t]);
	return (-zs(n, a) * (1 + n) ** (r - 1) / (zs(t, i) * (1 + t))) ** (1 / (r - 1)) - 1;
}
function Ls(e, t) {
	return e = R(e), t = R(t), I(e, t) ? d : e <= 0 || t < 1 ? m : (t = parseInt(t, 10), ((e + 1) ** (1 / t) - 1) * t);
}
function Rs(e, t, n, r, i) {
	if (i = i === void 0 ? 0 : i, r = r === void 0 ? 0 : r, e = R(e), t = R(t), n = R(n), r = R(r), i = R(i), I(e, t, n, r, i)) return d;
	if (e === 0) return -(n + r) / t;
	{
		let a = t * (1 + e * i) - r * e, o = n * e + t * (1 + e * i);
		return Math.log(a / o) / Math.log(1 + e);
	}
}
function zs() {
	let e = z(M(arguments));
	if (e instanceof Error) return e;
	let t = e[0], n = 0;
	for (let r = 1; r < e.length; r++) n += e[r] / (1 + t) ** +r;
	return n;
}
function Bs(e, t, n) {
	return e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : e <= 0 ? m : (Math.log(n) - Math.log(t)) / Math.log(1 + e);
}
function Vs(e, t, n, r, i) {
	if (r ||= 0, i ||= 0, e = R(e), t = R(t), n = R(n), r = R(r), i = R(i), I(e, t, n, r, i)) return d;
	let a;
	if (e === 0) a = (n + r) / t;
	else {
		let o = (1 + e) ** +t;
		a = i === 1 ? (r * e / (o - 1) + n * e / (1 - 1 / o)) / (1 + e) : r * e / (o - 1) + n * e / (1 - 1 / o);
	}
	return -a;
}
function Hs(e, t, n, r, i, a) {
	return i ||= 0, a ||= 0, e = R(e), n = R(n), r = R(r), i = R(i), a = R(a), I(e, n, r, i, a) ? d : Vs(e, n, r, i, a) - Ns(e, t, n, r, i, a);
}
function Us(e, t, n, r, i) {
	if (e = L(e), t = L(t), n = R(n), r = R(r), i = R(i), i ||= 0, I(e, t, n, r, i)) return d;
	if (n <= 0 || r <= 0) return m;
	if (e >= t) return d;
	let a, o;
	switch (i) {
		case 0:
			a = 360, o = Pi(e, t, !1);
			break;
		case 1:
			a = 365, o = ki(e, t, "D");
			break;
		case 2:
			a = 360, o = ki(e, t, "D");
			break;
		case 3:
			a = 365, o = ki(e, t, "D");
			break;
		case 4:
			a = 360, o = Pi(e, t, !0);
			break;
		default: return m;
	}
	return r - n * r * o / a;
}
function Ws(e, t, n, r, i) {
	return r ||= 0, i ||= 0, e = R(e), t = R(t), n = R(n), r = R(r), i = R(i), I(e, t, n, r, i) ? d : e === 0 ? -n * t - r : ((1 - (1 + e) ** +t) / e * n * (1 + e * i) - r) / (1 + e) ** +t;
}
function Gs(e, t, n, r, i, a) {
	if (a = a === void 0 ? .1 : a, r = r === void 0 ? 0 : r, i = i === void 0 ? 0 : i, e = R(e), t = R(t), n = R(n), r = R(r), i = R(i), a = R(a), I(e, t, n, r, i, a)) return d;
	let o = 1e-10, s = a;
	i = +!!i;
	for (let a = 0; a < 100; a++) {
		if (s <= -1) return m;
		let a, c;
		if (Math.abs(s) < o ? a = n * (1 + e * s) + t * (1 + s * i) * e + r : (c = (1 + s) ** +e, a = n * c + t * (1 / s + i) * (c - 1) + r), Math.abs(a) < o) return s;
		let l;
		if (Math.abs(s) < o) l = n * e + t * i * e;
		else {
			c = (1 + s) ** +e;
			let r = e * (1 + s) ** (e - 1);
			l = n * r + t * (1 / s + i) * r + t * (-1 / (s * s)) * (c - 1);
		}
		s -= a / l;
	}
	return s;
}
function Ks(e, t, n) {
	return e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : e === 0 || t === 0 ? m : (n / t) ** (1 / e) - 1;
}
function qs(e, t, n) {
	return e = R(e), t = R(t), n = R(n), I(e, t, n) ? d : n === 0 ? m : (e - t) / n;
}
function Js(e, t, n, r) {
	return e = R(e), t = R(t), n = R(n), r = R(r), I(e, t, n, r) ? d : n === 0 || r < 1 || r > n ? m : (r = parseInt(r, 10), (e - t) * (n - r + 1) * 2 / (n * (n + 1)));
}
function Ys(e, t, n) {
	return e = L(e), t = L(t), n = R(n), I(e, t, n) ? d : n <= 0 || e > t || t - e > 365 * 24 * 60 * 60 * 1e3 ? m : 365 * n / (360 - n * Pi(e, t, !1));
}
function Xs(e, t, n) {
	return e = L(e), t = L(t), n = R(n), I(e, t, n) ? d : n <= 0 || e > t || t - e > 365 * 24 * 60 * 60 * 1e3 ? m : 100 * (1 - n * Pi(e, t, !1) / 360);
}
function Zs(e, t, n) {
	return e = L(e), t = L(t), n = R(n), I(e, t, n) ? d : n <= 0 || e > t || t - e > 365 * 24 * 60 * 60 * 1e3 ? m : (100 - n) * 360 / (n * Pi(e, t, !1));
}
function Qs(e, t, n) {
	if (e = z(M(e)), t = Ce(M(t)), n = R(n), I(e, t, n)) return d;
	let r = (e, t, n) => {
		let r = n + 1, i = e[0];
		for (let n = 1; n < e.length; n++) i += e[n] / r ** (Ni(t[n], t[0]) / 365);
		return i;
	}, i = (e, t, n) => {
		let r = n + 1, i = 0;
		for (let n = 1; n < e.length; n++) {
			let a = Ni(t[n], t[0]) / 365;
			i -= a * e[n] / r ** +(a + 1);
		}
		return i;
	}, a = !1, o = !1;
	for (let t = 0; t < e.length; t++) e[t] > 0 && (a = !0), e[t] < 0 && (o = !0);
	if (!a || !o) return m;
	n ||= .1;
	let s = n, c = 1e-10, l, u, f, p = !0;
	do
		f = r(e, t, s), l = s - f / i(e, t, s), u = Math.abs(l - s), s = l, p = u > c && Math.abs(f) > c;
	while (p);
	return s;
}
function $s(e, t, n) {
	if (e = R(e), t = z(M(t)), n = Ce(M(n)), I(e, t, n)) return d;
	let r = 0;
	for (let i = 0; i < t.length; i++) r += t[i] / (1 + e) ** (Ni(n[i], n[0]) / 365);
	return r;
}
function ec() {
	let e = M(arguments), t = d;
	for (let n = 0; n < e.length; n++) {
		if (e[n] instanceof Error) return e[n];
		e[n] === void 0 || e[n] === null || typeof e[n] == "string" || (t === d && (t = !0), e[n] || (t = !1));
	}
	return t;
}
function tc() {
	return !1;
}
function nc(e, t, n) {
	return e instanceof Error ? e : (t = arguments.length >= 2 ? t : !0, t ??= 0, n = arguments.length === 3 && n, n ??= 0, e ? t : n);
}
function rc() {
	for (let e = 0; e < arguments.length / 2; e++) if (arguments[e * 2]) return arguments[e * 2 + 1];
	return h;
}
function ic(e, t) {
	return ke(e) ? t : e;
}
function ac(e, t) {
	return e === h ? t : e;
}
function oc(e) {
	return typeof e == "string" ? d : e instanceof Error ? e : !e;
}
function sc() {
	let e = M(arguments), t = d;
	for (let n = 0; n < e.length; n++) {
		if (e[n] instanceof Error) return e[n];
		e[n] === void 0 || e[n] === null || typeof e[n] == "string" || (t === d && (t = !1), e[n] && (t = !0));
	}
	return t;
}
function cc() {
	return !0;
}
function lc() {
	let e = M(arguments), t = d;
	for (let n = 0; n < e.length; n++) {
		if (e[n] instanceof Error) return e[n];
		e[n] === void 0 || e[n] === null || typeof e[n] == "string" || (t === d && (t = 0), e[n] && t++);
	}
	return t === d ? t : !!(Math.floor(Math.abs(t)) & 1);
}
function uc() {
	let e;
	if (arguments.length > 0) {
		let t = arguments[0], n = arguments.length - 1, r = Math.floor(n / 2), i = !1, a = n % 2 != 0, o = n % 2 == 0 ? null : arguments[arguments.length - 1];
		if (r) {
			for (let n = 0; n < r; n++) if (t === arguments[n * 2 + 1]) {
				e = arguments[n * 2 + 2], i = !0;
				break;
			}
		}
		i || (e = a ? o : h);
	} else e = d;
	return e;
}
var dc = {
	errors: y,
	symbols: wi,
	date: te
}, fc = "tp-formula-picker{min-inline-size:0;display:inline-block}tp-formula-picker label{align-items:center;gap:.35rem;font-size:.85rem;display:flex}tp-formula-picker select{box-sizing:border-box;border:1px solid var(--tp-neutral-stroke-soft);background:var(--tp-paper-color);min-block-size:2rem;max-inline-size:13rem;color:inherit;font:inherit;padding-inline:.4rem}", pc = Object.entries(o).filter(([e, t]) => typeof t == "function" && /^[A-Z][A-Z0-9.]*$/.test(e)).map(([e]) => e).sort((e, t) => e.localeCompare(t)), mc = {
	AND: "logical1, …",
	AVERAGE: "number1, …",
	CONCATENATE: "text1, …",
	COUNT: "value1, …",
	MAX: "number1, …",
	MIN: "number1, …",
	OR: "logical1, …",
	PRODUCT: "number1, …",
	SUM: "number1, …"
};
function hc(e) {
	let t = o[e];
	if (typeof t != "function") return `${e}(xxx)`;
	let n = String(t).match(/^function\s*[^()]*\(([^)]*)\)/)?.[1]?.trim() ?? "";
	return `${e}(${n === "" ? mc[e] ?? "xxx" : n})`;
}
var gc = class e extends r {
	static styleId = "tp-formula-picker-styles";
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(e.styleId, fc), this.render();
	}
	render() {
		let e = document.createElement("label");
		e.textContent = "Formula";
		let t = document.createElement("select");
		t.setAttribute("aria-label", "Formula");
		let n = document.createElement("option");
		n.value = "", n.textContent = "Insert a formula…", n.selected = !0, t.append(n);
		for (let e of pc) {
			let n = document.createElement("option");
			n.value = e, n.textContent = hc(e), t.append(n);
		}
		t.addEventListener("change", () => {
			if (t.value === "") return;
			let e = `=${hc(t.value)}`;
			this.dispatchEvent(new CustomEvent("tp-formula-picker-select", {
				bubbles: !0,
				composed: !0,
				detail: {
					name: t.value,
					formula: e,
					selectionStart: e.indexOf("(") + 1,
					selectionEnd: e.lastIndexOf(")")
				}
			})), t.value = "";
		}), e.append(t), this.replaceChildren(e);
	}
};
customElements.get("tp-formula-picker") || customElements.define("tp-formula-picker", gc);
//#endregion
export { o as i, pc as n, hc as r, gc as t };

//# sourceMappingURL=formula-picker.js.map