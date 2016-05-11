var COMPILED = !0,
	goog = goog || {};
goog.global = this;
goog.isDef = function(a) {
	return void 0 !== a
};
goog.exportPath_ = function(a, b, c) {
	a = a.split(".");
	c = c || goog.global;
	a[0] in c || !c.execScript || c.execScript("var " + a[0]);
	for (var d; a.length && (d = a.shift());) !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
};
goog.define = function(a, b) {
	var c = b;
	COMPILED || (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, a) ? c = goog.global.CLOSURE_UNCOMPILED_DEFINES[a] : goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) && (c = goog.global.CLOSURE_DEFINES[a]));
	goog.exportPath_(a, c)
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.provide = function(a) {
	if (!COMPILED) {
		if (goog.isProvided_(a)) throw Error('Namespace "' + a + '" already declared.');
		delete goog.implicitNamespaces_[a];
		for (var b = a;
			(b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) goog.implicitNamespaces_[b] = !0
	}
	goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
	if (COMPILED && !goog.DEBUG) throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
};
goog.forwardDeclare = function(a) {};
COMPILED || (goog.isProvided_ = function(a) {
	return !goog.implicitNamespaces_[a] && goog.isDefAndNotNull(goog.getObjectByName(a))
}, goog.implicitNamespaces_ = {});
goog.getObjectByName = function(a, b) {
	for (var c = a.split("."), d = b || goog.global, e; e = c.shift();)
		if (goog.isDefAndNotNull(d[e])) d = d[e];
		else return null;
	return d
};
goog.globalize = function(a, b) {
	var c = b || goog.global,
		d;
	for (d in a) c[d] = a[d]
};
goog.addDependency = function(a, b, c) {
	if (goog.DEPENDENCIES_ENABLED) {
		var d;
		a = a.replace(/\\/g, "/");
		for (var e = goog.dependencies_, f = 0; d = b[f]; f++) e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0;
		for (d = 0; b = c[d]; d++) a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
	}
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
	if (!COMPILED && !goog.isProvided_(a)) {
		if (goog.ENABLE_DEBUG_LOADER) {
			var b = goog.getPathFromDeps_(a);
			if (b) {
				goog.included_[b] = !0;
				goog.writeScripts_();
				return
			}
		}
		a = "goog.require could not find: " + a;
		goog.global.console && goog.global.console.error(a);
		throw Error(a);
	}
};
goog.basePath = "";
goog.nullFunction = function() {};
goog.identityFunction = function(a, b) {
	return a
};
goog.abstractMethod = function() {
	throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
	a.getInstance = function() {
		if (a.instance_) return a.instance_;
		goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
		return a.instance_ = new a
	}
};
goog.instantiatedSingletons_ = [];
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {
	pathToNames: {},
	nameToPath: {},
	requires: {},
	visited: {},
	written: {}
}, goog.inHtmlDocument_ = function() {
	var a = goog.global.document;
	return "undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function() {
	if (goog.global.CLOSURE_BASE_PATH) goog.basePath = goog.global.CLOSURE_BASE_PATH;
	else if (goog.inHtmlDocument_())
		for (var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1; 0 <= b; --b) {
			var c = a[b].src,
				d = c.lastIndexOf("?"),
				d = -1 == d ? c.length :
				d;
			if ("base.js" == c.substr(d - 7, 7)) {
				goog.basePath = c.substr(0, d - 7);
				break
			}
		}
}, goog.importScript_ = function(a) {
	var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
	!goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
	if (goog.inHtmlDocument_()) {
		var b = goog.global.document;
		if ("complete" == b.readyState) {
			if (/\bdeps.js$/.test(a)) return !1;
			throw Error('Cannot write "' + a + '" after document load');
		}
		b.write('<script type="text/javascript" src="' + a + '">\x3c/script>');
		return !0
	}
	return !1
}, goog.writeScripts_ = function() {
	function a(e) {
		if (!(e in d.written)) {
			if (!(e in d.visited) && (d.visited[e] = !0, e in d.requires))
				for (var g in d.requires[e])
					if (!goog.isProvided_(g))
						if (g in d.nameToPath) a(d.nameToPath[g]);
						else throw Error("Undefined nameToPath for " + g);
			e in c || (c[e] = !0, b.push(e))
		}
	}
	var b = [],
		c = {},
		d = goog.dependencies_,
		e;
	for (e in goog.included_) d.written[e] || a(e);
	for (e = 0; e < b.length; e++)
		if (b[e]) goog.importScript_(goog.basePath + b[e]);
		else throw Error("Undefined script input");
}, goog.getPathFromDeps_ = function(a) {
	return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
	var b = typeof a;
	if ("object" == b)
		if (a) {
			if (a instanceof Array) return "array";
			if (a instanceof Object) return b;
			var c = Object.prototype.toString.call(a);
			if ("[object Window]" == c) return "object";
			if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";
			if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
		} else return "null";
	else if ("function" == b && "undefined" == typeof a.call) return "object";
	return b
};
goog.isNull = function(a) {
	return null === a
};
goog.isDefAndNotNull = function(a) {
	return null != a
};
goog.isArray = function(a) {
	return "array" == goog.typeOf(a)
};
goog.isArrayLike = function(a) {
	var b = goog.typeOf(a);
	return "array" == b || "object" == b && "number" == typeof a.length
};
goog.isDateLike = function(a) {
	return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function(a) {
	return "string" == typeof a
};
goog.isBoolean = function(a) {
	return "boolean" == typeof a
};
goog.isNumber = function(a) {
	return "number" == typeof a
};
goog.isFunction = function(a) {
	return "function" == goog.typeOf(a)
};
goog.isObject = function(a) {
	var b = typeof a;
	return "object" == b && null != a || "function" == b
};
goog.getUid = function(a) {
	return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.hasUid = function(a) {
	return !!a[goog.UID_PROPERTY_]
};
goog.removeUid = function(a) {
	"removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
	try {
		delete a[goog.UID_PROPERTY_]
	} catch (b) {}
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
	var b = goog.typeOf(a);
	if ("object" == b || "array" == b) {
		if (a.clone) return a.clone();
		var b = "array" == b ? [] : {},
			c;
		for (c in a) b[c] = goog.cloneObject(a[c]);
		return b
	}
	return a
};
goog.bindNative_ = function(a, b, c) {
	return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
	if (!a) throw Error();
	if (2 < arguments.length) {
		var d = Array.prototype.slice.call(arguments, 2);
		return function() {
			var c = Array.prototype.slice.call(arguments);
			Array.prototype.unshift.apply(c, d);
			return a.apply(b, c)
		}
	}
	return function() {
		return a.apply(b, arguments)
	}
};
goog.bind = function(a, b, c) {
	Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
	return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
	var c = Array.prototype.slice.call(arguments, 1);
	return function() {
		var b = c.slice();
		b.push.apply(b, arguments);
		return a.apply(this, b)
	}
};
goog.mixin = function(a, b) {
	for (var c in b) a[c] = b[c]
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
	return +new Date
};
goog.globalEval = function(a) {
	if (goog.global.execScript) goog.global.execScript(a, "JavaScript");
	else if (goog.global.eval)
		if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) goog.global.eval(a);
		else {
			var b = goog.global.document,
				c = b.createElement("script");
			c.type = "text/javascript";
			c.defer = !1;
			c.appendChild(b.createTextNode(a));
			b.body.appendChild(c);
			b.body.removeChild(c)
		}
	else throw Error("goog.globalEval not available");
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
	var c = function(a) {
			return goog.cssNameMapping_[a] || a
		},
		d = function(a) {
			a = a.split("-");
			for (var b = [], d = 0; d < a.length; d++) b.push(c(a[d]));
			return b.join("-")
		},
		d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
			return a
		};
	return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
	goog.cssNameMapping_ = a;
	goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
	b && (a = a.replace(/\{\$([^}]+)}/g, function(a, d) {
		return d in b ? b[d] : a
	}));
	return a
};
goog.getMsgWithFallback = function(a, b) {
	return a
};
goog.exportSymbol = function(a, b, c) {
	goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
	a[b] = c
};
goog.inherits = function(a, b) {
	function c() {}
	c.prototype = b.prototype;
	a.superClass_ = b.prototype;
	a.prototype = new c;
	a.prototype.constructor = a;
	a.base = function(a, c, f) {
		var g = Array.prototype.slice.call(arguments, 2);
		return b.prototype[c].apply(a, g)
	}
};
goog.base = function(a, b, c) {
	var d = arguments.callee.caller;
	if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !d) throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
	if (d.superClass_) return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
	for (var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor; g; g = g.superClass_ && g.superClass_.constructor)
		if (g.prototype[b] === d) f = !0;
		else if (f) return g.prototype[b].apply(a,
		e);
	if (a[b] === d) return a.constructor.prototype[b].apply(a, e);
	throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
	a.call(goog.global)
};
COMPILED || (goog.global.COMPILED = COMPILED);
goog.defineClass = function(a, b) {
	var c = b.constructor,
		d = b.statics;
	c && c != Object.prototype.constructor || (c = function() {
		throw Error("cannot instantiate an interface (no constructor defined).");
	});
	c = goog.defineClass.createSealingConstructor_(c, a);
	a && goog.inherits(c, a);
	delete b.constructor;
	delete b.statics;
	goog.defineClass.applyProperties_(c.prototype, b);
	null != d && (d instanceof Function ? d(c) : goog.defineClass.applyProperties_(c, d));
	return c
};
goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
goog.defineClass.createSealingConstructor_ = function(a, b) {
	if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
		if (b && b.prototype && b.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) return a;
		var c = function() {
			var b = a.apply(this, arguments) || this;
			this.constructor === c && Object.seal(b);
			return b
		};
		return c
	}
	return a
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_ = function(a, b) {
	for (var c in b) Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
	for (var d = 0; d < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; d++) c = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[d], Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c])
};
goog.tagUnsealableClass = function(a) {
	!COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES && (a.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = !0)
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.ui = {};
goog.ui.IdGenerator = function() {};
goog.addSingletonGetter(goog.ui.IdGenerator);
goog.ui.IdGenerator.prototype.nextId_ = 0;
goog.ui.IdGenerator.prototype.getNextUniqueId = function() {
	return ":" + (this.nextId_++).toString(36)
};
var qp = {
	Data: function() {
		this.data_ = {};
		this.idGenerator_ = goog.ui.IdGenerator.getInstance()
	}
};
goog.addSingletonGetter(qp.Data);
goog.exportSymbol("qp.Data", qp.Data);
qp.Data.prototype.DATA_ATTRIBUTE_ID = "data-qp-ui-data-id";
qp.Data.prototype.set = function(a, b, c) {
	var d = a.getAttribute(this.DATA_ATTRIBUTE_ID);
	d || (d = this.idGenerator_.getNextUniqueId(), a.setAttribute(this.DATA_ATTRIBUTE_ID, "qp" + d));
	this.data_.hasOwnProperty(d) || (this.data_[d] = {});
	goog.isDef(c) ? this.data_[d][b] = c : delete this.data_[d][b]
};
qp.Data.prototype.get = function(a, b) {
	var c = a.getAttribute(this.DATA_ATTRIBUTE_ID),
		d, e;
	c && this.data_.hasOwnProperty(c) && (d = this.data_[c]);
	goog.isDef(b) ? d && d.hasOwnProperty(b) && (e = d[b]) : e = d;
	return e
};
goog.dom = {};
goog.dom.NodeType = {
	ELEMENT: 1,
	ATTRIBUTE: 2,
	TEXT: 3,
	CDATA_SECTION: 4,
	ENTITY_REFERENCE: 5,
	ENTITY: 6,
	PROCESSING_INSTRUCTION: 7,
	COMMENT: 8,
	DOCUMENT: 9,
	DOCUMENT_TYPE: 10,
	DOCUMENT_FRAGMENT: 11,
	NOTATION: 12
};
goog.debug = {};
goog.debug.Error = function(a) {
	if (Error.captureStackTrace) Error.captureStackTrace(this, goog.debug.Error);
	else {
		var b = Error().stack;
		b && (this.stack = b)
	}
	a && (this.message = String(a))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.string = {};
goog.string.DETECT_DOUBLE_ESCAPING = !1;
goog.string.Unicode = {
	NBSP: "\u00a0"
};
goog.string.startsWith = function(a, b) {
	return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
	var c = a.length - b.length;
	return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
	return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
	return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.caseInsensitiveEquals = function(a, b) {
	return a.toLowerCase() == b.toLowerCase()
};
goog.string.subs = function(a, b) {
	for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) d += c.shift() + e.shift();
	return d + c.join("%s")
};
goog.string.collapseWhitespace = function(a) {
	return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
	return /^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
	return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
	return !/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
	return !/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
	return !/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
	return !/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
	return " " == a
};
goog.string.isUnicodeChar = function(a) {
	return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
	return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
	return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
	return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
	return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
	return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
	return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
	return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
	return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
	var c = String(a).toLowerCase(),
		d = String(b).toLowerCase();
	return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
	if (a == b) return 0;
	if (!a) return -1;
	if (!b) return 1;
	for (var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0; f < e; f++) {
		var g = c[f],
			h = d[f];
		if (g != h) return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
	}
	return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.urlEncode = function(a) {
	return encodeURIComponent(String(a))
};
goog.string.urlDecode = function(a) {
	return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
	return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
	if (b) a = a.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;"), goog.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(goog.string.E_RE_, "&#101;"));
	else {
		if (!goog.string.ALL_RE_.test(a)) return a; - 1 != a.indexOf("&") && (a = a.replace(goog.string.AMP_RE_, "&amp;")); - 1 != a.indexOf("<") && (a = a.replace(goog.string.LT_RE_,
			"&lt;")); - 1 != a.indexOf(">") && (a = a.replace(goog.string.GT_RE_, "&gt;")); - 1 != a.indexOf('"') && (a = a.replace(goog.string.QUOT_RE_, "&quot;")); - 1 != a.indexOf("'") && (a = a.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;")); - 1 != a.indexOf("\x00") && (a = a.replace(goog.string.NULL_RE_, "&#0;"));
		goog.string.DETECT_DOUBLE_ESCAPING && -1 != a.indexOf("e") && (a = a.replace(goog.string.E_RE_, "&#101;"))
	}
	return a
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(a) {
	return goog.string.contains(a, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesWithDocument = function(a, b) {
	return goog.string.contains(a, "&") ? goog.string.unescapeEntitiesUsingDom_(a, b) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a, b) {
	var c = {
			"&amp;": "&",
			"&lt;": "<",
			"&gt;": ">",
			"&quot;": '"'
		},
		d;
	d = b ? b.createElement("div") : goog.global.document.createElement("div");
	return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, b) {
		var g = c[a];
		if (g) return g;
		if ("#" == b.charAt(0)) {
			var h = Number("0" + b.substr(1));
			isNaN(h) || (g = String.fromCharCode(h))
		}
		g || (d.innerHTML = a + " ", g = d.firstChild.nodeValue.slice(0, -1));
		return c[a] = g
	})
};
goog.string.unescapePureXmlEntities_ = function(a) {
	return a.replace(/&([^;]+);/g, function(a, c) {
		switch (c) {
			case "amp":
				return "&";
			case "lt":
				return "<";
			case "gt":
				return ">";
			case "quot":
				return '"';
			default:
				if ("#" == c.charAt(0)) {
					var d = Number("0" + c.substr(1));
					if (!isNaN(d)) return String.fromCharCode(d)
				}
				return a
		}
	})
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
	return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.preserveSpaces = function(a) {
	return a.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP)
};
goog.string.stripQuotes = function(a, b) {
	for (var c = b.length, d = 0; d < c; d++) {
		var e = 1 == c ? b : b.charAt(d);
		if (a.charAt(0) == e && a.charAt(a.length - 1) == e) return a.substring(1, a.length - 1)
	}
	return a
};
goog.string.truncate = function(a, b, c) {
	c && (a = goog.string.unescapeEntities(a));
	a.length > b && (a = a.substring(0, b - 3) + "...");
	c && (a = goog.string.htmlEscape(a));
	return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
	c && (a = goog.string.unescapeEntities(a));
	if (d && a.length > b) {
		d > b && (d = b);
		var e = a.length - d;
		a = a.substring(0, b - d) + "..." + a.substring(e)
	} else a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e));
	c && (a = goog.string.htmlEscape(a));
	return a
};
goog.string.specialEscapeChars_ = {
	"\x00": "\\0",
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"\t": "\\t",
	"\x0B": "\\x0B",
	'"': '\\"',
	"\\": "\\\\"
};
goog.string.jsEscapeCache_ = {
	"'": "\\'"
};
goog.string.quote = function(a) {
	a = String(a);
	if (a.quote) return a.quote();
	for (var b = ['"'], c = 0; c < a.length; c++) {
		var d = a.charAt(c),
			e = d.charCodeAt(0);
		b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
	}
	b.push('"');
	return b.join("")
};
goog.string.escapeString = function(a) {
	for (var b = [], c = 0; c < a.length; c++) b[c] = goog.string.escapeChar(a.charAt(c));
	return b.join("")
};
goog.string.escapeChar = function(a) {
	if (a in goog.string.jsEscapeCache_) return goog.string.jsEscapeCache_[a];
	if (a in goog.string.specialEscapeChars_) return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a];
	var b = a,
		c = a.charCodeAt(0);
	if (31 < c && 127 > c) b = a;
	else {
		if (256 > c) {
			if (b = "\\x", 16 > c || 256 < c) b += "0"
		} else b = "\\u", 4096 > c && (b += "0");
		b += c.toString(16).toUpperCase()
	}
	return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
	for (var b = {}, c = 0; c < a.length; c++) b[a.charAt(c)] = !0;
	return b
};
goog.string.contains = function(a, b) {
	return -1 != a.indexOf(b)
};
goog.string.caseInsensitiveContains = function(a, b) {
	return goog.string.contains(a.toLowerCase(), b.toLowerCase())
};
goog.string.countOf = function(a, b) {
	return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
	var d = a;
	0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
	return d
};
goog.string.remove = function(a, b) {
	var c = new RegExp(goog.string.regExpEscape(b), "");
	return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
	var c = new RegExp(goog.string.regExpEscape(b), "g");
	return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
	return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
	return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
	a = goog.isDef(c) ? a.toFixed(c) : String(a);
	c = a.indexOf("."); - 1 == c && (c = a.length);
	return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
	return null == a ? "" : String(a)
};
goog.string.buildString = function(a) {
	return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
	return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
	for (var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0; 0 == c && g < f; g++) {
		var h = d[g] || "",
			k = e[g] || "",
			l = RegExp("(\\d*)(\\D*)", "g"),
			m = RegExp("(\\d*)(\\D*)", "g");
		do {
			var n = l.exec(h) || ["", "", ""],
				p = m.exec(k) || ["", "", ""];
			if (0 == n[0].length && 0 == p[0].length) break;
			var c = 0 == n[1].length ? 0 : parseInt(n[1], 10),
				q = 0 == p[1].length ? 0 : parseInt(p[1], 10),
				c = goog.string.compareElements_(c, q) || goog.string.compareElements_(0 ==
					n[2].length, 0 == p[2].length) || goog.string.compareElements_(n[2], p[2])
		} while (0 == c)
	}
	return c
};
goog.string.compareElements_ = function(a, b) {
	return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
	for (var b = 0, c = 0; c < a.length; ++c) b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_;
	return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
	return "goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
	var b = Number(a);
	return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.isLowerCamelCase = function(a) {
	return /^[a-z]+([A-Z][a-z]*)*$/.test(a)
};
goog.string.isUpperCamelCase = function(a) {
	return /^([A-Z][a-z]*)+$/.test(a)
};
goog.string.toCamelCase = function(a) {
	return String(a).replace(/\-([a-z])/g, function(a, c) {
		return c.toUpperCase()
	})
};
goog.string.toSelectorCase = function(a) {
	return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(a, b) {
	var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
	return a.replace(new RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
		return b + c.toUpperCase()
	})
};
goog.string.parseInt = function(a) {
	isFinite(a) && (a = String(a));
	return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.string.splitLimit = function(a, b, c) {
	a = a.split(b);
	for (var d = []; 0 < c && a.length;) d.push(a.shift()), c--;
	a.length && d.push(a.join(b));
	return d
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
	b.unshift(a);
	goog.debug.Error.call(this, goog.string.subs.apply(null, b));
	b.shift();
	this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(a) {
	throw a;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
	var e = "Assertion failed";
	if (c) var e = e + (": " + c),
		f = d;
	else a && (e += ": " + a, f = b);
	a = new goog.asserts.AssertionError("" + e, f || []);
	goog.asserts.errorHandler_(a)
};
goog.asserts.setErrorHandler = function(a) {
	goog.asserts.ENABLE_ASSERTS && (goog.asserts.errorHandler_ = a)
};
goog.asserts.assert = function(a, b, c) {
	goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
	return a
};
goog.asserts.fail = function(a, b) {
	goog.asserts.ENABLE_ASSERTS && goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
};
goog.asserts.assertNumber = function(a, b, c) {
	goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
	return a
};
goog.asserts.assertString = function(a, b, c) {
	goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
	return a
};
goog.asserts.assertFunction = function(a, b, c) {
	goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
	return a
};
goog.asserts.assertObject = function(a, b, c) {
	goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
	return a
};
goog.asserts.assertArray = function(a, b, c) {
	goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
	return a
};
goog.asserts.assertBoolean = function(a, b, c) {
	goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
	return a
};
goog.asserts.assertElement = function(a, b, c) {
	!goog.asserts.ENABLE_ASSERTS || goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
	return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
	!goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
	return a
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
	for (var a in Object.prototype) goog.asserts.fail(a + " should not be enumerable in Object.prototype.")
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.ASSUME_NATIVE_FUNCTIONS = !1;
goog.array.peek = function(a) {
	return a[a.length - 1]
};
goog.array.last = goog.array.peek;
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.indexOf) ? function(a, b, c) {
	goog.asserts.assert(null != a.length);
	return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
	c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
	if (goog.isString(a)) return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1;
	for (; c < a.length; c++)
		if (c in a && a[c] === b) return c;
	return -1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ? function(a, b, c) {
	goog.asserts.assert(null != a.length);
	return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function(a, b, c) {
	c = null == c ? a.length - 1 : c;
	0 > c && (c = Math.max(0, a.length + c));
	if (goog.isString(a)) return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1;
	for (; 0 <= c; c--)
		if (c in a && a[c] === b) return c;
	return -1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.forEach) ? function(a, b, c) {
	goog.asserts.assert(null != a.length);
	goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
	for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) f in e && b.call(c, e[f], f, a)
};
goog.array.forEachRight = function(a, b, c) {
	for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1; 0 <= d; --d) d in e && b.call(c, e[d], d, a)
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.filter) ? function(a, b, c) {
	goog.asserts.assert(null != a.length);
	return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
	for (var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0; h < d; h++)
		if (h in g) {
			var k = g[h];
			b.call(c, k, h, a) && (e[f++] = k)
		}
	return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.map) ? function(a, b, c) {
	goog.asserts.assert(null != a.length);
	return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
	for (var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0; g < d; g++) g in f && (e[g] = b.call(c, f[g], g, a));
	return e
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduce) ? function(a, b, c, d) {
	goog.asserts.assert(null != a.length);
	d && (b = goog.bind(b, d));
	return goog.array.ARRAY_PROTOTYPE_.reduce.call(a, b, c)
} : function(a, b, c, d) {
	var e = c;
	goog.array.forEach(a, function(c, g) {
		e = b.call(d, e, c, g, a)
	});
	return e
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduceRight) ? function(a, b, c, d) {
	goog.asserts.assert(null != a.length);
	d && (b = goog.bind(b, d));
	return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(a, b, c)
} : function(a, b, c, d) {
	var e = c;
	goog.array.forEachRight(a, function(c, g) {
		e = b.call(d, e, c, g, a)
	});
	return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.some) ? function(a, b, c) {
	goog.asserts.assert(null != a.length);
	return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
	for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++)
		if (f in e && b.call(c, e[f], f, a)) return !0;
	return !1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.every) ? function(a, b, c) {
	goog.asserts.assert(null != a.length);
	return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
	for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++)
		if (f in e && !b.call(c, e[f], f, a)) return !1;
	return !0
};
goog.array.count = function(a, b, c) {
	var d = 0;
	goog.array.forEach(a, function(a, f, g) {
		b.call(c, a, f, g) && ++d
	}, c);
	return d
};
goog.array.find = function(a, b, c) {
	b = goog.array.findIndex(a, b, c);
	return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
	for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++)
		if (f in e && b.call(c, e[f], f, a)) return f;
	return -1
};
goog.array.findRight = function(a, b, c) {
	b = goog.array.findIndexRight(a, b, c);
	return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
	for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1; 0 <= d; d--)
		if (d in e && b.call(c, e[d], d, a)) return d;
	return -1
};
goog.array.contains = function(a, b) {
	return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function(a) {
	return 0 == a.length
};
goog.array.clear = function(a) {
	if (!goog.isArray(a))
		for (var b = a.length - 1; 0 <= b; b--) delete a[b];
	a.length = 0
};
goog.array.insert = function(a, b) {
	goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
	goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
	goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
	var d;
	2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
	var c = goog.array.indexOf(a, b),
		d;
	(d = 0 <= c) && goog.array.removeAt(a, c);
	return d
};
goog.array.removeAt = function(a, b) {
	goog.asserts.assert(null != a.length);
	return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function(a, b, c) {
	b = goog.array.findIndex(a, b, c);
	return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
	return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.join = function(a) {
	return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function(a) {
	var b = a.length;
	if (0 < b) {
		for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
		return c
	}
	return []
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
	for (var c = 1; c < arguments.length; c++) {
		var d = arguments[c],
			e;
		if (goog.isArray(d) || (e = goog.isArrayLike(d)) && Object.prototype.hasOwnProperty.call(d, "callee")) a.push.apply(a, d);
		else if (e)
			for (var f = a.length, g = d.length, h = 0; h < g; h++) a[f + h] = d[h];
		else a.push(d)
	}
};
goog.array.splice = function(a, b, c, d) {
	goog.asserts.assert(null != a.length);
	return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
	goog.asserts.assert(null != a.length);
	return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b, c) {
	b = b || a;
	var d = function(a) {
		return goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g
	};
	c = c || d;
	for (var d = {}, e = 0, f = 0; f < a.length;) {
		var g = a[f++],
			h = c(g);
		Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, b[e++] = g)
	}
	b.length = e
};
goog.array.binarySearch = function(a, b, c) {
	return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
	return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
	for (var f = 0, g = a.length, h; f < g;) {
		var k = f + g >> 1,
			l;
		l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
		0 < l ? f = k + 1 : (g = k, h = !l)
	}
	return h ? f : ~f
};
goog.array.sort = function(a, b) {
	a.sort(b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
	for (var c = 0; c < a.length; c++) a[c] = {
		index: c,
		value: a[c]
	};
	var d = b || goog.array.defaultCompare;
	goog.array.sort(a, function(a, b) {
		return d(a.value, b.value) || a.index - b.index
	});
	for (c = 0; c < a.length; c++) a[c] = a[c].value
};
goog.array.sortObjectsByKey = function(a, b, c) {
	var d = c || goog.array.defaultCompare;
	goog.array.sort(a, function(a, c) {
		return d(a[b], c[b])
	})
};
goog.array.isSorted = function(a, b, c) {
	b = b || goog.array.defaultCompare;
	for (var d = 1; d < a.length; d++) {
		var e = b(a[d - 1], a[d]);
		if (0 < e || 0 == e && c) return !1
	}
	return !0
};
goog.array.equals = function(a, b, c) {
	if (!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) return !1;
	var d = a.length;
	c = c || goog.array.defaultCompareEquality;
	for (var e = 0; e < d; e++)
		if (!c(a[e], b[e])) return !1;
	return !0
};
goog.array.compare3 = function(a, b, c) {
	c = c || goog.array.defaultCompare;
	for (var d = Math.min(a.length, b.length), e = 0; e < d; e++) {
		var f = c(a[e], b[e]);
		if (0 != f) return f
	}
	return goog.array.defaultCompare(a.length, b.length)
};
goog.array.defaultCompare = function(a, b) {
	return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
	return a === b
};
goog.array.binaryInsert = function(a, b, c) {
	c = goog.array.binarySearch(a, b, c);
	return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
	b = goog.array.binarySearch(a, b, c);
	return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b, c) {
	for (var d = {}, e = 0; e < a.length; e++) {
		var f = a[e],
			g = b.call(c, f, e, a);
		goog.isDef(g) && (d[g] || (d[g] = [])).push(f)
	}
	return d
};
goog.array.toObject = function(a, b, c) {
	var d = {};
	goog.array.forEach(a, function(e, f) {
		d[b.call(c, e, f, a)] = e
	});
	return d
};
goog.array.range = function(a, b, c) {
	var d = [],
		e = 0,
		f = a;
	c = c || 1;
	void 0 !== b && (e = a, f = b);
	if (0 > c * (f - e)) return [];
	if (0 < c)
		for (a = e; a < f; a += c) d.push(a);
	else
		for (a = e; a > f; a += c) d.push(a);
	return d
};
goog.array.repeat = function(a, b) {
	for (var c = [], d = 0; d < b; d++) c[d] = a;
	return c
};
goog.array.flatten = function(a) {
	for (var b = [], c = 0; c < arguments.length; c++) {
		var d = arguments[c];
		goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
	}
	return b
};
goog.array.rotate = function(a, b) {
	goog.asserts.assert(null != a.length);
	a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
	return a
};
goog.array.moveItem = function(a, b, c) {
	goog.asserts.assert(0 <= b && b < a.length);
	goog.asserts.assert(0 <= c && c < a.length);
	b = goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1);
	goog.array.ARRAY_PROTOTYPE_.splice.call(a, c, 0, b[0])
};
goog.array.zip = function(a) {
	if (!arguments.length) return [];
	for (var b = [], c = 0;; c++) {
		for (var d = [], e = 0; e < arguments.length; e++) {
			var f = arguments[e];
			if (c >= f.length) return b;
			d.push(f[c])
		}
		b.push(d)
	}
};
goog.array.shuffle = function(a, b) {
	for (var c = b || Math.random, d = a.length - 1; 0 < d; d--) {
		var e = Math.floor(c() * (d + 1)),
			f = a[d];
		a[d] = a[e];
		a[e] = f
	}
};
goog.dom.classes = {};
goog.dom.classes.set = function(a, b) {
	a.className = b
};
goog.dom.classes.get = function(a) {
	a = a.className;
	return goog.isString(a) && a.match(/\S+/g) || []
};
goog.dom.classes.add = function(a, b) {
	var c = goog.dom.classes.get(a),
		d = goog.array.slice(arguments, 1),
		e = c.length + d.length;
	goog.dom.classes.add_(c, d);
	goog.dom.classes.set(a, c.join(" "));
	return c.length == e
};
goog.dom.classes.remove = function(a, b) {
	var c = goog.dom.classes.get(a),
		d = goog.array.slice(arguments, 1),
		e = goog.dom.classes.getDifference_(c, d);
	goog.dom.classes.set(a, e.join(" "));
	return e.length == c.length - d.length
};
goog.dom.classes.add_ = function(a, b) {
	for (var c = 0; c < b.length; c++) goog.array.contains(a, b[c]) || a.push(b[c])
};
goog.dom.classes.getDifference_ = function(a, b) {
	return goog.array.filter(a, function(a) {
		return !goog.array.contains(b, a)
	})
};
goog.dom.classes.swap = function(a, b, c) {
	for (var d = goog.dom.classes.get(a), e = !1, f = 0; f < d.length; f++) d[f] == b && (goog.array.splice(d, f--, 1), e = !0);
	e && (d.push(c), goog.dom.classes.set(a, d.join(" ")));
	return e
};
goog.dom.classes.addRemove = function(a, b, c) {
	var d = goog.dom.classes.get(a);
	goog.isString(b) ? goog.array.remove(d, b) : goog.isArray(b) && (d = goog.dom.classes.getDifference_(d, b));
	goog.isString(c) && !goog.array.contains(d, c) ? d.push(c) : goog.isArray(c) && goog.dom.classes.add_(d, c);
	goog.dom.classes.set(a, d.join(" "))
};
goog.dom.classes.has = function(a, b) {
	return goog.array.contains(goog.dom.classes.get(a), b)
};
goog.dom.classes.enable = function(a, b, c) {
	c ? goog.dom.classes.add(a, b) : goog.dom.classes.remove(a, b)
};
goog.dom.classes.toggle = function(a, b) {
	var c = !goog.dom.classes.has(a, b);
	goog.dom.classes.enable(a, b, c);
	return c
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
	for (var d in a) b.call(c, a[d], d, a)
};
goog.object.filter = function(a, b, c) {
	var d = {},
		e;
	for (e in a) b.call(c, a[e], e, a) && (d[e] = a[e]);
	return d
};
goog.object.map = function(a, b, c) {
	var d = {},
		e;
	for (e in a) d[e] = b.call(c, a[e], e, a);
	return d
};
goog.object.some = function(a, b, c) {
	for (var d in a)
		if (b.call(c, a[d], d, a)) return !0;
	return !1
};
goog.object.every = function(a, b, c) {
	for (var d in a)
		if (!b.call(c, a[d], d, a)) return !1;
	return !0
};
goog.object.getCount = function(a) {
	var b = 0,
		c;
	for (c in a) b++;
	return b
};
goog.object.getAnyKey = function(a) {
	for (var b in a) return b
};
goog.object.getAnyValue = function(a) {
	for (var b in a) return a[b]
};
goog.object.contains = function(a, b) {
	return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
	var b = [],
		c = 0,
		d;
	for (d in a) b[c++] = a[d];
	return b
};
goog.object.getKeys = function(a) {
	var b = [],
		c = 0,
		d;
	for (d in a) b[c++] = d;
	return b
};
goog.object.getValueByKeys = function(a, b) {
	for (var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1; c < d.length && (a = a[d[c]], goog.isDef(a)); c++);
	return a
};
goog.object.containsKey = function(a, b) {
	return b in a
};
goog.object.containsValue = function(a, b) {
	for (var c in a)
		if (a[c] == b) return !0;
	return !1
};
goog.object.findKey = function(a, b, c) {
	for (var d in a)
		if (b.call(c, a[d], d, a)) return d
};
goog.object.findValue = function(a, b, c) {
	return (b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
	for (var b in a) return !1;
	return !0
};
goog.object.clear = function(a) {
	for (var b in a) delete a[b]
};
goog.object.remove = function(a, b) {
	var c;
	(c = b in a) && delete a[b];
	return c
};
goog.object.add = function(a, b, c) {
	if (b in a) throw Error('The object already contains the key "' + b + '"');
	goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
	return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
	a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
	return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
	var b = {},
		c;
	for (c in a) b[c] = a[c];
	return b
};
goog.object.unsafeClone = function(a) {
	var b = goog.typeOf(a);
	if ("object" == b || "array" == b) {
		if (a.clone) return a.clone();
		var b = "array" == b ? [] : {},
			c;
		for (c in a) b[c] = goog.object.unsafeClone(a[c]);
		return b
	}
	return a
};
goog.object.transpose = function(a) {
	var b = {},
		c;
	for (c in a) b[a[c]] = c;
	return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
	for (var c, d, e = 1; e < arguments.length; e++) {
		d = arguments[e];
		for (c in d) a[c] = d[c];
		for (var f = 0; f < goog.object.PROTOTYPE_FIELDS_.length; f++) c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
	}
};
goog.object.create = function(a) {
	var b = arguments.length;
	if (1 == b && goog.isArray(arguments[0])) return goog.object.create.apply(null, arguments[0]);
	if (b % 2) throw Error("Uneven number of arguments");
	for (var c = {}, d = 0; d < b; d += 2) c[arguments[d]] = arguments[d + 1];
	return c
};
goog.object.createSet = function(a) {
	var b = arguments.length;
	if (1 == b && goog.isArray(arguments[0])) return goog.object.createSet.apply(null, arguments[0]);
	for (var c = {}, d = 0; d < b; d++) c[arguments[d]] = !0;
	return c
};
goog.object.createImmutableView = function(a) {
	var b = a;
	Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
	return b
};
goog.object.isImmutableView = function(a) {
	return !!Object.isFrozen && Object.isFrozen(a)
};
goog.math = {};
goog.math.randomInt = function(a) {
	return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, b) {
	return a + Math.random() * (b - a)
};
goog.math.clamp = function(a, b, c) {
	return Math.min(Math.max(a, b), c)
};
goog.math.modulo = function(a, b) {
	var c = a % b;
	return 0 > c * b ? c + b : c
};
goog.math.lerp = function(a, b, c) {
	return a + c * (b - a)
};
goog.math.nearlyEquals = function(a, b, c) {
	return Math.abs(a - b) <= (c || 1E-6)
};
goog.math.standardAngle = function(a) {
	return goog.math.modulo(a, 360)
};
goog.math.standardAngleInRadians = function(a) {
	return goog.math.modulo(a, 2 * Math.PI)
};
goog.math.toRadians = function(a) {
	return a * Math.PI / 180
};
goog.math.toDegrees = function(a) {
	return 180 * a / Math.PI
};
goog.math.angleDx = function(a, b) {
	return b * Math.cos(goog.math.toRadians(a))
};
goog.math.angleDy = function(a, b) {
	return b * Math.sin(goog.math.toRadians(a))
};
goog.math.angle = function(a, b, c, d) {
	return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)))
};
goog.math.angleDifference = function(a, b) {
	var c = goog.math.standardAngle(b) - goog.math.standardAngle(a);
	180 < c ? c -= 360 : -180 >= c && (c = 360 + c);
	return c
};
goog.math.sign = function(a) {
	return 0 == a ? 0 : 0 > a ? -1 : 1
};
goog.math.longestCommonSubsequence = function(a, b, c, d) {
	c = c || function(a, b) {
		return a == b
	};
	d = d || function(b, c) {
		return a[b]
	};
	for (var e = a.length, f = b.length, g = [], h = 0; h < e + 1; h++) g[h] = [], g[h][0] = 0;
	for (var k = 0; k < f + 1; k++) g[0][k] = 0;
	for (h = 1; h <= e; h++)
		for (k = 1; k <= f; k++) c(a[h - 1], b[k - 1]) ? g[h][k] = g[h - 1][k - 1] + 1 : g[h][k] = Math.max(g[h - 1][k], g[h][k - 1]);
	for (var l = [], h = e, k = f; 0 < h && 0 < k;) c(a[h - 1], b[k - 1]) ? (l.unshift(d(h - 1, k - 1)), h--, k--) : g[h - 1][k] > g[h][k - 1] ? h-- : k--;
	return l
};
goog.math.sum = function(a) {
	return goog.array.reduce(arguments, function(a, c) {
		return a + c
	}, 0)
};
goog.math.average = function(a) {
	return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.sampleVariance = function(a) {
	var b = arguments.length;
	if (2 > b) return 0;
	var c = goog.math.average.apply(null, arguments);
	return goog.math.sum.apply(null, goog.array.map(arguments, function(a) {
		return Math.pow(a - c, 2)
	})) / (b - 1)
};
goog.math.standardDeviation = function(a) {
	return Math.sqrt(goog.math.sampleVariance.apply(null, arguments))
};
goog.math.isInt = function(a) {
	return isFinite(a) && 0 == a % 1
};
goog.math.isFiniteNumber = function(a) {
	return isFinite(a) && !isNaN(a)
};
goog.math.log10Floor = function(a) {
	if (0 < a) {
		var b = Math.round(Math.log(a) * Math.LOG10E);
		return b - (parseFloat("1e" + b) > a)
	}
	return 0 == a ? -Infinity : NaN
};
goog.math.safeFloor = function(a, b) {
	goog.asserts.assert(!goog.isDef(b) || 0 < b);
	return Math.floor(a + (b || 2E-15))
};
goog.math.safeCeil = function(a, b) {
	goog.asserts.assert(!goog.isDef(b) || 0 < b);
	return Math.ceil(a - (b || 2E-15))
};
goog.math.Coordinate = function(a, b) {
	this.x = goog.isDef(a) ? a : 0;
	this.y = goog.isDef(b) ? b : 0
};
goog.math.Coordinate.prototype.clone = function() {
	return new goog.math.Coordinate(this.x, this.y)
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
	return "(" + this.x + ", " + this.y + ")"
});
goog.math.Coordinate.equals = function(a, b) {
	return a == b ? !0 : a && b ? a.x == b.x && a.y == b.y : !1
};
goog.math.Coordinate.distance = function(a, b) {
	var c = a.x - b.x,
		d = a.y - b.y;
	return Math.sqrt(c * c + d * d)
};
goog.math.Coordinate.magnitude = function(a) {
	return Math.sqrt(a.x * a.x + a.y * a.y)
};
goog.math.Coordinate.azimuth = function(a) {
	return goog.math.angle(0, 0, a.x, a.y)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
	var c = a.x - b.x,
		d = a.y - b.y;
	return c * c + d * d
};
goog.math.Coordinate.difference = function(a, b) {
	return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
	return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};
goog.math.Coordinate.prototype.ceil = function() {
	this.x = Math.ceil(this.x);
	this.y = Math.ceil(this.y);
	return this
};
goog.math.Coordinate.prototype.floor = function() {
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
	return this
};
goog.math.Coordinate.prototype.round = function() {
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
	return this
};
goog.math.Coordinate.prototype.translate = function(a, b) {
	a instanceof goog.math.Coordinate ? (this.x += a.x, this.y += a.y) : (this.x += a, goog.isNumber(b) && (this.y += b));
	return this
};
goog.math.Coordinate.prototype.scale = function(a, b) {
	var c = goog.isNumber(b) ? b : a;
	this.x *= a;
	this.y *= c;
	return this
};
goog.math.Coordinate.prototype.rotateRadians = function(a, b) {
	var c = b || new goog.math.Coordinate(0, 0),
		d = this.x,
		e = this.y,
		f = Math.cos(a),
		g = Math.sin(a);
	this.x = (d - c.x) * f - (e - c.y) * g + c.x;
	this.y = (d - c.x) * g + (e - c.y) * f + c.y
};
goog.math.Coordinate.prototype.rotateDegrees = function(a, b) {
	this.rotateRadians(goog.math.toRadians(a), b)
};
goog.math.Box = function(a, b, c, d) {
	this.top = a;
	this.right = b;
	this.bottom = c;
	this.left = d
};
goog.math.Box.boundingBox = function(a) {
	for (var b = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x), c = 1; c < arguments.length; c++) {
		var d = arguments[c];
		b.top = Math.min(b.top, d.y);
		b.right = Math.max(b.right, d.x);
		b.bottom = Math.max(b.bottom, d.y);
		b.left = Math.min(b.left, d.x)
	}
	return b
};
goog.math.Box.prototype.getWidth = function() {
	return this.right - this.left
};
goog.math.Box.prototype.getHeight = function() {
	return this.bottom - this.top
};
goog.math.Box.prototype.clone = function() {
	return new goog.math.Box(this.top, this.right, this.bottom, this.left)
};
goog.DEBUG && (goog.math.Box.prototype.toString = function() {
	return "(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
});
goog.math.Box.prototype.contains = function(a) {
	return goog.math.Box.contains(this, a)
};
goog.math.Box.prototype.expand = function(a, b, c, d) {
	goog.isObject(a) ? (this.top -= a.top, this.right += a.right, this.bottom += a.bottom, this.left -= a.left) : (this.top -= a, this.right += b, this.bottom += c, this.left -= d);
	return this
};
goog.math.Box.prototype.expandToInclude = function(a) {
	this.left = Math.min(this.left, a.left);
	this.top = Math.min(this.top, a.top);
	this.right = Math.max(this.right, a.right);
	this.bottom = Math.max(this.bottom, a.bottom)
};
goog.math.Box.equals = function(a, b) {
	return a == b ? !0 : a && b ? a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left : !1
};
goog.math.Box.contains = function(a, b) {
	return a && b ? b instanceof goog.math.Box ? b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom : b.x >= a.left && b.x <= a.right && b.y >= a.top && b.y <= a.bottom : !1
};
goog.math.Box.relativePositionX = function(a, b) {
	return b.x < a.left ? b.x - a.left : b.x > a.right ? b.x - a.right : 0
};
goog.math.Box.relativePositionY = function(a, b) {
	return b.y < a.top ? b.y - a.top : b.y > a.bottom ? b.y - a.bottom : 0
};
goog.math.Box.distance = function(a, b) {
	var c = goog.math.Box.relativePositionX(a, b),
		d = goog.math.Box.relativePositionY(a, b);
	return Math.sqrt(c * c + d * d)
};
goog.math.Box.intersects = function(a, b) {
	return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom
};
goog.math.Box.intersectsWithPadding = function(a, b, c) {
	return a.left <= b.right + c && b.left <= a.right + c && a.top <= b.bottom + c && b.top <= a.bottom + c
};
goog.math.Box.prototype.ceil = function() {
	this.top = Math.ceil(this.top);
	this.right = Math.ceil(this.right);
	this.bottom = Math.ceil(this.bottom);
	this.left = Math.ceil(this.left);
	return this
};
goog.math.Box.prototype.floor = function() {
	this.top = Math.floor(this.top);
	this.right = Math.floor(this.right);
	this.bottom = Math.floor(this.bottom);
	this.left = Math.floor(this.left);
	return this
};
goog.math.Box.prototype.round = function() {
	this.top = Math.round(this.top);
	this.right = Math.round(this.right);
	this.bottom = Math.round(this.bottom);
	this.left = Math.round(this.left);
	return this
};
goog.math.Box.prototype.translate = function(a, b) {
	a instanceof goog.math.Coordinate ? (this.left += a.x, this.right += a.x, this.top += a.y, this.bottom += a.y) : (this.left += a, this.right += a, goog.isNumber(b) && (this.top += b, this.bottom += b));
	return this
};
goog.math.Box.prototype.scale = function(a, b) {
	var c = goog.isNumber(b) ? b : a;
	this.left *= a;
	this.right *= a;
	this.top *= c;
	this.bottom *= c;
	return this
};
goog.labs = {};
goog.labs.userAgent = {};
goog.labs.userAgent.util = {};
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
	var a = goog.labs.userAgent.util.getNavigator_();
	return a && (a = a.userAgent) ? a : ""
};
goog.labs.userAgent.util.getNavigator_ = function() {
	return goog.global.navigator
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(a) {
	goog.labs.userAgent.util.userAgent_ = a || goog.labs.userAgent.util.getNativeUserAgentString_()
};
goog.labs.userAgent.util.getUserAgent = function() {
	return goog.labs.userAgent.util.userAgent_
};
goog.labs.userAgent.util.matchUserAgent = function(a) {
	var b = goog.labs.userAgent.util.getUserAgent();
	return goog.string.contains(b, a)
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(a) {
	var b = goog.labs.userAgent.util.getUserAgent();
	return goog.string.caseInsensitiveContains(b, a)
};
goog.labs.userAgent.util.extractVersionTuples = function(a) {
	for (var b = RegExp("(\\w[\\w ]+)/([^\\s]+)\\s*(?:\\((.*?)\\))?", "g"), c = [], d; d = b.exec(a);) c.push([d[1], d[2], d[3] || void 0]);
	return c
};
goog.labs.userAgent.browser = {};
goog.labs.userAgent.browser.matchOpera_ = function() {
	return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR")
};
goog.labs.userAgent.browser.matchIE_ = function() {
	return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE")
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
	return goog.labs.userAgent.util.matchUserAgent("Firefox")
};
goog.labs.userAgent.browser.matchSafari_ = function() {
	return goog.labs.userAgent.util.matchUserAgent("Safari") && !goog.labs.userAgent.util.matchUserAgent("Chrome") && !goog.labs.userAgent.util.matchUserAgent("CriOS") && !goog.labs.userAgent.util.matchUserAgent("Android")
};
goog.labs.userAgent.browser.matchChrome_ = function() {
	return goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS")
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
	return goog.labs.userAgent.util.matchUserAgent("Android") && !goog.labs.userAgent.util.matchUserAgent("Chrome") && !goog.labs.userAgent.util.matchUserAgent("CriOS")
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
	return goog.labs.userAgent.util.matchUserAgent("Silk")
};
goog.labs.userAgent.browser.getVersion = function() {
	var a = goog.labs.userAgent.util.getUserAgent();
	if (goog.labs.userAgent.browser.isIE()) return goog.labs.userAgent.browser.getIEVersion_(a);
	if (goog.labs.userAgent.browser.isOpera()) return goog.labs.userAgent.browser.getOperaVersion_(a);
	a = goog.labs.userAgent.util.extractVersionTuples(a);
	return goog.labs.userAgent.browser.getVersionFromTuples_(a)
};
goog.labs.userAgent.browser.isVersionOrHigher = function(a) {
	return 0 <= goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), a)
};
goog.labs.userAgent.browser.getIEVersion_ = function(a) {
	var b = /rv: *([\d\.]*)/.exec(a);
	if (b && b[1]) return b[1];
	var b = "",
		c = /MSIE +([\d\.]+)/.exec(a);
	if (c && c[1])
		if (a = /Trident\/(\d.\d)/.exec(a), "7.0" == c[1])
			if (a && a[1]) switch (a[1]) {
				case "4.0":
					b = "8.0";
					break;
				case "5.0":
					b = "9.0";
					break;
				case "6.0":
					b = "10.0";
					break;
				case "7.0":
					b = "11.0"
			} else b = "7.0";
			else b = c[1];
	return b
};
goog.labs.userAgent.browser.getOperaVersion_ = function(a) {
	a = goog.labs.userAgent.util.extractVersionTuples(a);
	var b = goog.array.peek(a);
	return "OPR" == b[0] && b[1] ? b[1] : goog.labs.userAgent.browser.getVersionFromTuples_(a)
};
goog.labs.userAgent.browser.getVersionFromTuples_ = function(a) {
	goog.asserts.assert(2 < a.length, "Couldn't extract version tuple from user agent string");
	return a[2] && a[2][1] ? a[2][1] : ""
};
goog.labs.userAgent.engine = {};
goog.labs.userAgent.engine.isPresto = function() {
	return goog.labs.userAgent.util.matchUserAgent("Presto")
};
goog.labs.userAgent.engine.isTrident = function() {
	return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE")
};
goog.labs.userAgent.engine.isWebKit = function() {
	return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit")
};
goog.labs.userAgent.engine.isGecko = function() {
	return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident()
};
goog.labs.userAgent.engine.getVersion = function() {
	var a = goog.labs.userAgent.util.getUserAgent();
	if (a) {
		var a = goog.labs.userAgent.util.extractVersionTuples(a),
			b = a[1];
		if (b) return "Gecko" == b[0] ? goog.labs.userAgent.engine.getVersionForKey_(a, "Firefox") : b[1];
		var a = a[0],
			c;
		if (a && (c = a[2]) && (c = /Trident\/([^\s;]+)/.exec(c))) return c[1]
	}
	return ""
};
goog.labs.userAgent.engine.isVersionOrHigher = function(a) {
	return 0 <= goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), a)
};
goog.labs.userAgent.engine.getVersionForKey_ = function(a, b) {
	var c = goog.array.find(a, function(a) {
		return b == a[0]
	});
	return c && c[1] || ""
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
	return goog.labs.userAgent.util.getUserAgent()
};
goog.userAgent.getNavigator = function() {
	return goog.global.navigator || null
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
	return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile")
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
	var a = goog.userAgent.getNavigator();
	return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.initPlatform_ = function() {
	goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
	goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
	goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
	goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11");
	var a = goog.userAgent.getUserAgentString();
	goog.userAgent.detectedAndroid_ = !!a &&
		goog.string.contains(a, "Android");
	goog.userAgent.detectedIPhone_ = !!a && goog.string.contains(a, "iPhone");
	goog.userAgent.detectedIPad_ = !!a && goog.string.contains(a, "iPad")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.userAgent.detectedAndroid_;
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.userAgent.detectedIPhone_;
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.userAgent.detectedIPad_;
goog.userAgent.determineVersion_ = function() {
	var a = "",
		b;
	if (goog.userAgent.OPERA && goog.global.opera) return a = goog.global.opera.version, goog.isFunction(a) ? a() : a;
	goog.userAgent.GECKO ? b = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? b = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (b = /WebKit\/(\S+)/);
	b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : "");
	return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a)) ? String(b) : a
};
goog.userAgent.getDocumentMode_ = function() {
	var a = goog.global.document;
	return a ? a.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
	return goog.string.compareVersions(a, b)
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(a) {
	return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[a] || (goog.userAgent.isVersionOrHigherCache_[a] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a))
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(a) {
	return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= a
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
	var a = goog.global.document;
	return a && goog.userAgent.IE ? goog.userAgent.getDocumentMode_() || ("CSS1Compat" == a.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5) : void 0
}();
goog.math.Size = function(a, b) {
	this.width = a;
	this.height = b
};
goog.math.Size.equals = function(a, b) {
	return a == b ? !0 : a && b ? a.width == b.width && a.height == b.height : !1
};
goog.math.Size.prototype.clone = function() {
	return new goog.math.Size(this.width, this.height)
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
	return "(" + this.width + " x " + this.height + ")"
});
goog.math.Size.prototype.getLongest = function() {
	return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
	return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
	return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
	return 2 * (this.width + this.height)
};
goog.math.Size.prototype.aspectRatio = function() {
	return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
	return !this.area()
};
goog.math.Size.prototype.ceil = function() {
	this.width = Math.ceil(this.width);
	this.height = Math.ceil(this.height);
	return this
};
goog.math.Size.prototype.fitsInside = function(a) {
	return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
	this.width = Math.floor(this.width);
	this.height = Math.floor(this.height);
	return this
};
goog.math.Size.prototype.round = function() {
	this.width = Math.round(this.width);
	this.height = Math.round(this.height);
	return this
};
goog.math.Size.prototype.scale = function(a, b) {
	var c = goog.isNumber(b) ? b : a;
	this.width *= a;
	this.height *= c;
	return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
	a = this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height;
	return this.scale(a)
};
goog.math.Rect = function(a, b, c, d) {
	this.left = a;
	this.top = b;
	this.width = c;
	this.height = d
};
goog.math.Rect.prototype.clone = function() {
	return new goog.math.Rect(this.left, this.top, this.width, this.height)
};
goog.math.Rect.prototype.toBox = function() {
	return new goog.math.Box(this.top, this.left + this.width, this.top + this.height, this.left)
};
goog.math.Rect.createFromBox = function(a) {
	return new goog.math.Rect(a.left, a.top, a.right - a.left, a.bottom - a.top)
};
goog.DEBUG && (goog.math.Rect.prototype.toString = function() {
	return "(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
});
goog.math.Rect.equals = function(a, b) {
	return a == b ? !0 : a && b ? a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height : !1
};
goog.math.Rect.prototype.intersection = function(a) {
	var b = Math.max(this.left, a.left),
		c = Math.min(this.left + this.width, a.left + a.width);
	if (b <= c) {
		var d = Math.max(this.top, a.top);
		a = Math.min(this.top + this.height, a.top + a.height);
		if (d <= a) return this.left = b, this.top = d, this.width = c - b, this.height = a - d, !0
	}
	return !1
};
goog.math.Rect.intersection = function(a, b) {
	var c = Math.max(a.left, b.left),
		d = Math.min(a.left + a.width, b.left + b.width);
	if (c <= d) {
		var e = Math.max(a.top, b.top),
			f = Math.min(a.top + a.height, b.top + b.height);
		if (e <= f) return new goog.math.Rect(c, e, d - c, f - e)
	}
	return null
};
goog.math.Rect.intersects = function(a, b) {
	return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height
};
goog.math.Rect.prototype.intersects = function(a) {
	return goog.math.Rect.intersects(this, a)
};
goog.math.Rect.difference = function(a, b) {
	var c = goog.math.Rect.intersection(a, b);
	if (!c || !c.height || !c.width) return [a.clone()];
	var c = [],
		d = a.top,
		e = a.height,
		f = a.left + a.width,
		g = a.top + a.height,
		h = b.left + b.width,
		k = b.top + b.height;
	b.top > a.top && (c.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top)), d = b.top, e -= b.top - a.top);
	k < g && (c.push(new goog.math.Rect(a.left, k, a.width, g - k)), e = k - d);
	b.left > a.left && c.push(new goog.math.Rect(a.left, d, b.left - a.left, e));
	h < f && c.push(new goog.math.Rect(h, d, f - h, e));
	return c
};
goog.math.Rect.prototype.difference = function(a) {
	return goog.math.Rect.difference(this, a)
};
goog.math.Rect.prototype.boundingRect = function(a) {
	var b = Math.max(this.left + this.width, a.left + a.width),
		c = Math.max(this.top + this.height, a.top + a.height);
	this.left = Math.min(this.left, a.left);
	this.top = Math.min(this.top, a.top);
	this.width = b - this.left;
	this.height = c - this.top
};
goog.math.Rect.boundingRect = function(a, b) {
	if (!a || !b) return null;
	var c = a.clone();
	c.boundingRect(b);
	return c
};
goog.math.Rect.prototype.contains = function(a) {
	return a instanceof goog.math.Rect ? this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height : a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height
};
goog.math.Rect.prototype.squaredDistance = function(a) {
	var b = a.x < this.left ? this.left - a.x : Math.max(a.x - (this.left + this.width), 0);
	a = a.y < this.top ? this.top - a.y : Math.max(a.y - (this.top + this.height), 0);
	return b * b + a * a
};
goog.math.Rect.prototype.distance = function(a) {
	return Math.sqrt(this.squaredDistance(a))
};
goog.math.Rect.prototype.getSize = function() {
	return new goog.math.Size(this.width, this.height)
};
goog.math.Rect.prototype.getTopLeft = function() {
	return new goog.math.Coordinate(this.left, this.top)
};
goog.math.Rect.prototype.getCenter = function() {
	return new goog.math.Coordinate(this.left + this.width / 2, this.top + this.height / 2)
};
goog.math.Rect.prototype.getBottomRight = function() {
	return new goog.math.Coordinate(this.left + this.width, this.top + this.height)
};
goog.math.Rect.prototype.ceil = function() {
	this.left = Math.ceil(this.left);
	this.top = Math.ceil(this.top);
	this.width = Math.ceil(this.width);
	this.height = Math.ceil(this.height);
	return this
};
goog.math.Rect.prototype.floor = function() {
	this.left = Math.floor(this.left);
	this.top = Math.floor(this.top);
	this.width = Math.floor(this.width);
	this.height = Math.floor(this.height);
	return this
};
goog.math.Rect.prototype.round = function() {
	this.left = Math.round(this.left);
	this.top = Math.round(this.top);
	this.width = Math.round(this.width);
	this.height = Math.round(this.height);
	return this
};
goog.math.Rect.prototype.translate = function(a, b) {
	a instanceof goog.math.Coordinate ? (this.left += a.x, this.top += a.y) : (this.left += a, goog.isNumber(b) && (this.top += b));
	return this
};
goog.math.Rect.prototype.scale = function(a, b) {
	var c = goog.isNumber(b) ? b : a;
	this.left *= a;
	this.width *= a;
	this.top *= c;
	this.height *= c;
	return this
};
goog.dom.vendor = {};
goog.dom.vendor.getVendorJsPrefix = function() {
	return goog.userAgent.WEBKIT ? "Webkit" : goog.userAgent.GECKO ? "Moz" : goog.userAgent.IE ? "ms" : goog.userAgent.OPERA ? "O" : null
};
goog.dom.vendor.getVendorPrefix = function() {
	return goog.userAgent.WEBKIT ? "-webkit" : goog.userAgent.GECKO ? "-moz" : goog.userAgent.IE ? "-ms" : goog.userAgent.OPERA ? "-o" : null
};
goog.dom.vendor.getPrefixedPropertyName = function(a, b) {
	if (b && a in b) return a;
	var c = goog.dom.vendor.getVendorJsPrefix();
	return c ? (c = c.toLowerCase(), c += goog.string.toTitleCase(a), !goog.isDef(b) || c in b ? c : null) : null
};
goog.dom.vendor.getPrefixedEventType = function(a) {
	return ((goog.dom.vendor.getVendorJsPrefix() || "") + a).toLowerCase()
};
goog.dom.TagName = {
	A: "A",
	ABBR: "ABBR",
	ACRONYM: "ACRONYM",
	ADDRESS: "ADDRESS",
	APPLET: "APPLET",
	AREA: "AREA",
	ARTICLE: "ARTICLE",
	ASIDE: "ASIDE",
	AUDIO: "AUDIO",
	B: "B",
	BASE: "BASE",
	BASEFONT: "BASEFONT",
	BDI: "BDI",
	BDO: "BDO",
	BIG: "BIG",
	BLOCKQUOTE: "BLOCKQUOTE",
	BODY: "BODY",
	BR: "BR",
	BUTTON: "BUTTON",
	CANVAS: "CANVAS",
	CAPTION: "CAPTION",
	CENTER: "CENTER",
	CITE: "CITE",
	CODE: "CODE",
	COL: "COL",
	COLGROUP: "COLGROUP",
	COMMAND: "COMMAND",
	DATA: "DATA",
	DATALIST: "DATALIST",
	DD: "DD",
	DEL: "DEL",
	DETAILS: "DETAILS",
	DFN: "DFN",
	DIALOG: "DIALOG",
	DIR: "DIR",
	DIV: "DIV",
	DL: "DL",
	DT: "DT",
	EM: "EM",
	EMBED: "EMBED",
	FIELDSET: "FIELDSET",
	FIGCAPTION: "FIGCAPTION",
	FIGURE: "FIGURE",
	FONT: "FONT",
	FOOTER: "FOOTER",
	FORM: "FORM",
	FRAME: "FRAME",
	FRAMESET: "FRAMESET",
	H1: "H1",
	H2: "H2",
	H3: "H3",
	H4: "H4",
	H5: "H5",
	H6: "H6",
	HEAD: "HEAD",
	HEADER: "HEADER",
	HGROUP: "HGROUP",
	HR: "HR",
	HTML: "HTML",
	I: "I",
	IFRAME: "IFRAME",
	IMG: "IMG",
	INPUT: "INPUT",
	INS: "INS",
	ISINDEX: "ISINDEX",
	KBD: "KBD",
	KEYGEN: "KEYGEN",
	LABEL: "LABEL",
	LEGEND: "LEGEND",
	LI: "LI",
	LINK: "LINK",
	MAP: "MAP",
	MARK: "MARK",
	MATH: "MATH",
	MENU: "MENU",
	META: "META",
	METER: "METER",
	NAV: "NAV",
	NOFRAMES: "NOFRAMES",
	NOSCRIPT: "NOSCRIPT",
	OBJECT: "OBJECT",
	OL: "OL",
	OPTGROUP: "OPTGROUP",
	OPTION: "OPTION",
	OUTPUT: "OUTPUT",
	P: "P",
	PARAM: "PARAM",
	PRE: "PRE",
	PROGRESS: "PROGRESS",
	Q: "Q",
	RP: "RP",
	RT: "RT",
	RUBY: "RUBY",
	S: "S",
	SAMP: "SAMP",
	SCRIPT: "SCRIPT",
	SECTION: "SECTION",
	SELECT: "SELECT",
	SMALL: "SMALL",
	SOURCE: "SOURCE",
	SPAN: "SPAN",
	STRIKE: "STRIKE",
	STRONG: "STRONG",
	STYLE: "STYLE",
	SUB: "SUB",
	SUMMARY: "SUMMARY",
	SUP: "SUP",
	SVG: "SVG",
	TABLE: "TABLE",
	TBODY: "TBODY",
	TD: "TD",
	TEXTAREA: "TEXTAREA",
	TFOOT: "TFOOT",
	TH: "TH",
	THEAD: "THEAD",
	TIME: "TIME",
	TITLE: "TITLE",
	TR: "TR",
	TRACK: "TRACK",
	TT: "TT",
	U: "U",
	UL: "UL",
	VAR: "VAR",
	VIDEO: "VIDEO",
	WBR: "WBR"
};
goog.functions = {};
goog.functions.constant = function(a) {
	return function() {
		return a
	}
};
goog.functions.FALSE = goog.functions.constant(!1);
goog.functions.TRUE = goog.functions.constant(!0);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(a, b) {
	return a
};
goog.functions.error = function(a) {
	return function() {
		throw Error(a);
	}
};
goog.functions.fail = function(a) {
	return function() {
		throw a;
	}
};
goog.functions.lock = function(a, b) {
	b = b || 0;
	return function() {
		return a.apply(this, Array.prototype.slice.call(arguments, 0, b))
	}
};
goog.functions.nth = function(a) {
	return function() {
		return arguments[a]
	}
};
goog.functions.withReturnValue = function(a, b) {
	return goog.functions.sequence(a, goog.functions.constant(b))
};
goog.functions.compose = function(a, b) {
	var c = arguments,
		d = c.length;
	return function() {
		var a;
		d && (a = c[d - 1].apply(this, arguments));
		for (var b = d - 2; 0 <= b; b--) a = c[b].call(this, a);
		return a
	}
};
goog.functions.sequence = function(a) {
	var b = arguments,
		c = b.length;
	return function() {
		for (var a, e = 0; e < c; e++) a = b[e].apply(this, arguments);
		return a
	}
};
goog.functions.and = function(a) {
	var b = arguments,
		c = b.length;
	return function() {
		for (var a = 0; a < c; a++)
			if (!b[a].apply(this, arguments)) return !1;
		return !0
	}
};
goog.functions.or = function(a) {
	var b = arguments,
		c = b.length;
	return function() {
		for (var a = 0; a < c; a++)
			if (b[a].apply(this, arguments)) return !0;
		return !1
	}
};
goog.functions.not = function(a) {
	return function() {
		return !a.apply(this, arguments)
	}
};
goog.functions.create = function(a, b) {
	var c = function() {};
	c.prototype = a.prototype;
	c = new c;
	a.apply(c, Array.prototype.slice.call(arguments, 1));
	return c
};
goog.functions.CACHE_RETURN_VALUE = !0;
goog.functions.cacheReturnValue = function(a) {
	var b = !1,
		c;
	return function() {
		if (!goog.functions.CACHE_RETURN_VALUE) return a();
		b || (c = a(), b = !0);
		return c
	}
};
goog.dom.BrowserFeature = {
	CAN_ADD_NAME_OR_TYPE_ATTRIBUTES: !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9),
	CAN_USE_CHILDREN_ATTRIBUTE: !goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9) || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.1"),
	CAN_USE_INNER_TEXT: goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"),
	CAN_USE_PARENT_ELEMENT_PROPERTY: goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT,
	INNER_HTML_NEEDS_SCOPED_ELEMENT: goog.userAgent.IE,
	LEGACY_IE_RANGES: goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.getDomHelper = function(a) {
	return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function() {
	return document
};
goog.dom.getElement = function(a) {
	return goog.dom.getElementHelper_(document, a)
};
goog.dom.getElementHelper_ = function(a, b) {
	return goog.isString(b) ? a.getElementById(b) : b
};
goog.dom.getRequiredElement = function(a) {
	return goog.dom.getRequiredElementHelper_(document, a)
};
goog.dom.getRequiredElementHelper_ = function(a, b) {
	goog.asserts.assertString(b);
	var c = goog.dom.getElementHelper_(a, b);
	return c = goog.asserts.assertElement(c, "No element found with id: " + b)
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(a, b, c) {
	return goog.dom.getElementsByTagNameAndClass_(document, a, b, c)
};
goog.dom.getElementsByClass = function(a, b) {
	var c = b || document;
	return goog.dom.canUseQuerySelector_(c) ? c.querySelectorAll("." + a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)
};
goog.dom.getElementByClass = function(a, b) {
	var c = b || document,
		d = null;
	return (d = goog.dom.canUseQuerySelector_(c) ? c.querySelector("." + a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)[0]) || null
};
goog.dom.getRequiredElementByClass = function(a, b) {
	var c = goog.dom.getElementByClass(a, b);
	return goog.asserts.assert(c, "No element found with className: " + a)
};
goog.dom.canUseQuerySelector_ = function(a) {
	return !(!a.querySelectorAll || !a.querySelector)
};
goog.dom.getElementsByTagNameAndClass_ = function(a, b, c, d) {
	a = d || a;
	b = b && "*" != b ? b.toUpperCase() : "";
	if (goog.dom.canUseQuerySelector_(a) && (b || c)) return a.querySelectorAll(b + (c ? "." + c : ""));
	if (c && a.getElementsByClassName) {
		a = a.getElementsByClassName(c);
		if (b) {
			d = {};
			for (var e = 0, f = 0, g; g = a[f]; f++) b == g.nodeName && (d[e++] = g);
			d.length = e;
			return d
		}
		return a
	}
	a = a.getElementsByTagName(b || "*");
	if (c) {
		d = {};
		for (f = e = 0; g = a[f]; f++) b = g.className, "function" == typeof b.split && goog.array.contains(b.split(/\s+/), c) && (d[e++] = g);
		d.length =
			e;
		return d
	}
	return a
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, b) {
	goog.object.forEach(b, function(b, d) {
		"style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in goog.dom.DIRECT_ATTRIBUTE_MAP_ ? a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d], b) : goog.string.startsWith(d, "aria-") || goog.string.startsWith(d, "data-") ? a.setAttribute(d, b) : a[d] = b
	})
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {
	cellpadding: "cellPadding",
	cellspacing: "cellSpacing",
	colspan: "colSpan",
	frameborder: "frameBorder",
	height: "height",
	maxlength: "maxLength",
	role: "role",
	rowspan: "rowSpan",
	type: "type",
	usemap: "useMap",
	valign: "vAlign",
	width: "width"
};
goog.dom.getViewportSize = function(a) {
	return goog.dom.getViewportSize_(a || window)
};
goog.dom.getViewportSize_ = function(a) {
	a = a.document;
	a = goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body;
	return new goog.math.Size(a.clientWidth, a.clientHeight)
};
goog.dom.getDocumentHeight = function() {
	return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(a) {
	var b = a.document,
		c = 0;
	if (b) {
		var c = b.body,
			d = b.documentElement;
		if (!c && !d) return 0;
		a = goog.dom.getViewportSize_(a).height;
		if (goog.dom.isCss1CompatMode_(b) && d.scrollHeight) c = d.scrollHeight != a ? d.scrollHeight : d.offsetHeight;
		else {
			var b = d.scrollHeight,
				e = d.offsetHeight;
			d.clientHeight != e && (b = c.scrollHeight, e = c.offsetHeight);
			c = b > a ? b > e ? b : e : b < e ? b : e
		}
	}
	return c
};
goog.dom.getPageScroll = function(a) {
	return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
	return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(a) {
	var b = goog.dom.getDocumentScrollElement_(a);
	a = goog.dom.getWindow_(a);
	return goog.userAgent.IE && goog.userAgent.isVersionOrHigher("10") && a.pageYOffset != b.scrollTop ? new goog.math.Coordinate(b.scrollLeft, b.scrollTop) : new goog.math.Coordinate(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
	return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(a) {
	return !goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body || a.documentElement
};
goog.dom.getWindow = function(a) {
	return a ? goog.dom.getWindow_(a) : window
};
goog.dom.getWindow_ = function(a) {
	return a.parentWindow || a.defaultView
};
goog.dom.createDom = function(a, b, c) {
	return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(a, b) {
	var c = b[0],
		d = b[1];
	if (!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && d && (d.name || d.type)) {
		c = ["<", c];
		d.name && c.push(' name="', goog.string.htmlEscape(d.name), '"');
		if (d.type) {
			c.push(' type="', goog.string.htmlEscape(d.type), '"');
			var e = {};
			goog.object.extend(e, d);
			delete e.type;
			d = e
		}
		c.push(">");
		c = c.join("")
	}
	c = a.createElement(c);
	d && (goog.isString(d) ? c.className = d : goog.isArray(d) ? c.className = d.join(" ") : goog.dom.setProperties(c, d));
	2 < b.length && goog.dom.append_(a,
		c, b, 2);
	return c
};
goog.dom.append_ = function(a, b, c, d) {
	function e(c) {
		c && b.appendChild(goog.isString(c) ? a.createTextNode(c) : c)
	}
	for (; d < c.length; d++) {
		var f = c[d];
		goog.isArrayLike(f) && !goog.dom.isNodeLike(f) ? goog.array.forEach(goog.dom.isNodeList(f) ? goog.array.toArray(f) : f, e) : e(f)
	}
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
	return document.createElement(a)
};
goog.dom.createTextNode = function(a) {
	return document.createTextNode(String(a))
};
goog.dom.createTable = function(a, b, c) {
	return goog.dom.createTable_(document, a, b, !!c)
};
goog.dom.createTable_ = function(a, b, c, d) {
	for (var e = ["<tr>"], f = 0; f < c; f++) e.push(d ? "<td>&nbsp;</td>" : "<td></td>");
	e.push("</tr>");
	e = e.join("");
	c = ["<table>"];
	for (f = 0; f < b; f++) c.push(e);
	c.push("</table>");
	a = a.createElement(goog.dom.TagName.DIV);
	a.innerHTML = c.join("");
	return a.removeChild(a.firstChild)
};
goog.dom.htmlToDocumentFragment = function(a) {
	return goog.dom.htmlToDocumentFragment_(document, a)
};
goog.dom.htmlToDocumentFragment_ = function(a, b) {
	var c = a.createElement("div");
	goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (c.innerHTML = "<br>" + b, c.removeChild(c.firstChild)) : c.innerHTML = b;
	if (1 == c.childNodes.length) return c.removeChild(c.firstChild);
	for (var d = a.createDocumentFragment(); c.firstChild;) d.appendChild(c.firstChild);
	return d
};
goog.dom.isCss1CompatMode = function() {
	return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(a) {
	return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == a.compatMode
};
goog.dom.canHaveChildren = function(a) {
	if (a.nodeType != goog.dom.NodeType.ELEMENT) return !1;
	switch (a.tagName) {
		case goog.dom.TagName.APPLET:
		case goog.dom.TagName.AREA:
		case goog.dom.TagName.BASE:
		case goog.dom.TagName.BR:
		case goog.dom.TagName.COL:
		case goog.dom.TagName.COMMAND:
		case goog.dom.TagName.EMBED:
		case goog.dom.TagName.FRAME:
		case goog.dom.TagName.HR:
		case goog.dom.TagName.IMG:
		case goog.dom.TagName.INPUT:
		case goog.dom.TagName.IFRAME:
		case goog.dom.TagName.ISINDEX:
		case goog.dom.TagName.KEYGEN:
		case goog.dom.TagName.LINK:
		case goog.dom.TagName.NOFRAMES:
		case goog.dom.TagName.NOSCRIPT:
		case goog.dom.TagName.META:
		case goog.dom.TagName.OBJECT:
		case goog.dom.TagName.PARAM:
		case goog.dom.TagName.SCRIPT:
		case goog.dom.TagName.SOURCE:
		case goog.dom.TagName.STYLE:
		case goog.dom.TagName.TRACK:
		case goog.dom.TagName.WBR:
			return !1
	}
	return !0
};
goog.dom.appendChild = function(a, b) {
	a.appendChild(b)
};
goog.dom.append = function(a, b) {
	goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1)
};
goog.dom.removeChildren = function(a) {
	for (var b; b = a.firstChild;) a.removeChild(b)
};
goog.dom.insertSiblingBefore = function(a, b) {
	b.parentNode && b.parentNode.insertBefore(a, b)
};
goog.dom.insertSiblingAfter = function(a, b) {
	b.parentNode && b.parentNode.insertBefore(a, b.nextSibling)
};
goog.dom.insertChildAt = function(a, b, c) {
	a.insertBefore(b, a.childNodes[c] || null)
};
goog.dom.removeNode = function(a) {
	return a && a.parentNode ? a.parentNode.removeChild(a) : null
};
goog.dom.replaceNode = function(a, b) {
	var c = b.parentNode;
	c && c.replaceChild(a, b)
};
goog.dom.flattenElement = function(a) {
	var b, c = a.parentNode;
	if (c && c.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
		if (a.removeNode) return a.removeNode(!1);
		for (; b = a.firstChild;) c.insertBefore(b, a);
		return goog.dom.removeNode(a)
	}
};
goog.dom.getChildren = function(a) {
	return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children ? a.children : goog.array.filter(a.childNodes, function(a) {
		return a.nodeType == goog.dom.NodeType.ELEMENT
	})
};
goog.dom.getFirstElementChild = function(a) {
	return void 0 != a.firstElementChild ? a.firstElementChild : goog.dom.getNextElementNode_(a.firstChild, !0)
};
goog.dom.getLastElementChild = function(a) {
	return void 0 != a.lastElementChild ? a.lastElementChild : goog.dom.getNextElementNode_(a.lastChild, !1)
};
goog.dom.getNextElementSibling = function(a) {
	return void 0 != a.nextElementSibling ? a.nextElementSibling : goog.dom.getNextElementNode_(a.nextSibling, !0)
};
goog.dom.getPreviousElementSibling = function(a) {
	return void 0 != a.previousElementSibling ? a.previousElementSibling : goog.dom.getNextElementNode_(a.previousSibling, !1)
};
goog.dom.getNextElementNode_ = function(a, b) {
	for (; a && a.nodeType != goog.dom.NodeType.ELEMENT;) a = b ? a.nextSibling : a.previousSibling;
	return a
};
goog.dom.getNextNode = function(a) {
	if (!a) return null;
	if (a.firstChild) return a.firstChild;
	for (; a && !a.nextSibling;) a = a.parentNode;
	return a ? a.nextSibling : null
};
goog.dom.getPreviousNode = function(a) {
	if (!a) return null;
	if (!a.previousSibling) return a.parentNode;
	for (a = a.previousSibling; a && a.lastChild;) a = a.lastChild;
	return a
};
goog.dom.isNodeLike = function(a) {
	return goog.isObject(a) && 0 < a.nodeType
};
goog.dom.isElement = function(a) {
	return goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT
};
goog.dom.isWindow = function(a) {
	return goog.isObject(a) && a.window == a
};
goog.dom.getParentElement = function(a) {
	var b;
	if (goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY && !(goog.userAgent.IE && goog.userAgent.isVersionOrHigher("9") && !goog.userAgent.isVersionOrHigher("10") && goog.global.SVGElement && a instanceof goog.global.SVGElement) && (b = a.parentElement)) return b;
	b = a.parentNode;
	return goog.dom.isElement(b) ? b : null
};
goog.dom.contains = function(a, b) {
	if (a.contains && b.nodeType == goog.dom.NodeType.ELEMENT) return a == b || a.contains(b);
	if ("undefined" != typeof a.compareDocumentPosition) return a == b || Boolean(a.compareDocumentPosition(b) & 16);
	for (; b && a != b;) b = b.parentNode;
	return b == a
};
goog.dom.compareNodeOrder = function(a, b) {
	if (a == b) return 0;
	if (a.compareDocumentPosition) return a.compareDocumentPosition(b) & 2 ? 1 : -1;
	if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
		if (a.nodeType == goog.dom.NodeType.DOCUMENT) return -1;
		if (b.nodeType == goog.dom.NodeType.DOCUMENT) return 1
	}
	if ("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
		var c = a.nodeType == goog.dom.NodeType.ELEMENT,
			d = b.nodeType == goog.dom.NodeType.ELEMENT;
		if (c && d) return a.sourceIndex - b.sourceIndex;
		var e = a.parentNode,
			f = b.parentNode;
		return e == f ? goog.dom.compareSiblingOrder_(a, b) : !c && goog.dom.contains(e, b) ? -1 * goog.dom.compareParentsDescendantNodeIe_(a, b) : !d && goog.dom.contains(f, a) ? goog.dom.compareParentsDescendantNodeIe_(b, a) : (c ? a.sourceIndex : e.sourceIndex) - (d ? b.sourceIndex : f.sourceIndex)
	}
	d = goog.dom.getOwnerDocument(a);
	c = d.createRange();
	c.selectNode(a);
	c.collapse(!0);
	d = d.createRange();
	d.selectNode(b);
	d.collapse(!0);
	return c.compareBoundaryPoints(goog.global.Range.START_TO_END, d)
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, b) {
	var c = a.parentNode;
	if (c == b) return -1;
	for (var d = b; d.parentNode != c;) d = d.parentNode;
	return goog.dom.compareSiblingOrder_(d, a)
};
goog.dom.compareSiblingOrder_ = function(a, b) {
	for (var c = b; c = c.previousSibling;)
		if (c == a) return -1;
	return 1
};
goog.dom.findCommonAncestor = function(a) {
	var b, c = arguments.length;
	if (!c) return null;
	if (1 == c) return arguments[0];
	var d = [],
		e = Infinity;
	for (b = 0; b < c; b++) {
		for (var f = [], g = arguments[b]; g;) f.unshift(g), g = g.parentNode;
		d.push(f);
		e = Math.min(e, f.length)
	}
	f = null;
	for (b = 0; b < e; b++) {
		for (var g = d[0][b], h = 1; h < c; h++)
			if (g != d[h][b]) return f;
		f = g
	}
	return f
};
goog.dom.getOwnerDocument = function(a) {
	goog.asserts.assert(a, "Node cannot be null or undefined.");
	return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document
};
goog.dom.getFrameContentDocument = function(a) {
	return a.contentDocument || a.contentWindow.document
};
goog.dom.getFrameContentWindow = function(a) {
	return a.contentWindow || goog.dom.getWindow(goog.dom.getFrameContentDocument(a))
};
goog.dom.setTextContent = function(a, b) {
	goog.asserts.assert(null != a, "goog.dom.setTextContent expects a non-null value for node");
	if ("textContent" in a) a.textContent = b;
	else if (a.nodeType == goog.dom.NodeType.TEXT) a.data = b;
	else if (a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
		for (; a.lastChild != a.firstChild;) a.removeChild(a.lastChild);
		a.firstChild.data = b
	} else {
		goog.dom.removeChildren(a);
		var c = goog.dom.getOwnerDocument(a);
		a.appendChild(c.createTextNode(String(b)))
	}
};
goog.dom.getOuterHtml = function(a) {
	if ("outerHTML" in a) return a.outerHTML;
	var b = goog.dom.getOwnerDocument(a).createElement("div");
	b.appendChild(a.cloneNode(!0));
	return b.innerHTML
};
goog.dom.findNode = function(a, b) {
	var c = [];
	return goog.dom.findNodes_(a, b, c, !0) ? c[0] : void 0
};
goog.dom.findNodes = function(a, b) {
	var c = [];
	goog.dom.findNodes_(a, b, c, !1);
	return c
};
goog.dom.findNodes_ = function(a, b, c, d) {
	if (null != a)
		for (a = a.firstChild; a;) {
			if (b(a) && (c.push(a), d) || goog.dom.findNodes_(a, b, c, d)) return !0;
			a = a.nextSibling
		}
	return !1
};
goog.dom.TAGS_TO_IGNORE_ = {
	SCRIPT: 1,
	STYLE: 1,
	HEAD: 1,
	IFRAME: 1,
	OBJECT: 1
};
goog.dom.PREDEFINED_TAG_VALUES_ = {
	IMG: " ",
	BR: "\n"
};
goog.dom.isFocusableTabIndex = function(a) {
	return goog.dom.hasSpecifiedTabIndex_(a) && goog.dom.isTabIndexFocusable_(a)
};
goog.dom.setFocusableTabIndex = function(a, b) {
	b ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"))
};
goog.dom.isFocusable = function(a) {
	var b;
	return (b = goog.dom.nativelySupportsFocus_(a) ? !a.disabled && (!goog.dom.hasSpecifiedTabIndex_(a) || goog.dom.isTabIndexFocusable_(a)) : goog.dom.isFocusableTabIndex(a)) && goog.userAgent.IE ? goog.dom.hasNonZeroBoundingRect_(a) : b
};
goog.dom.hasSpecifiedTabIndex_ = function(a) {
	a = a.getAttributeNode("tabindex");
	return goog.isDefAndNotNull(a) && a.specified
};
goog.dom.isTabIndexFocusable_ = function(a) {
	a = a.tabIndex;
	return goog.isNumber(a) && 0 <= a && 32768 > a
};
goog.dom.nativelySupportsFocus_ = function(a) {
	return a.tagName == goog.dom.TagName.A || a.tagName == goog.dom.TagName.INPUT || a.tagName == goog.dom.TagName.TEXTAREA || a.tagName == goog.dom.TagName.SELECT || a.tagName == goog.dom.TagName.BUTTON
};
goog.dom.hasNonZeroBoundingRect_ = function(a) {
	a = goog.isFunction(a.getBoundingClientRect) ? a.getBoundingClientRect() : {
		height: a.offsetHeight,
		width: a.offsetWidth
	};
	return goog.isDefAndNotNull(a) && 0 < a.height && 0 < a.width
};
goog.dom.getTextContent = function(a) {
	if (goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in a) a = goog.string.canonicalizeNewlines(a.innerText);
	else {
		var b = [];
		goog.dom.getTextContent_(a, b, !0);
		a = b.join("")
	}
	a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
	a = a.replace(/\u200B/g, "");
	goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
	" " != a && (a = a.replace(/^\s*/, ""));
	return a
};
goog.dom.getRawTextContent = function(a) {
	var b = [];
	goog.dom.getTextContent_(a, b, !1);
	return b.join("")
};
goog.dom.getTextContent_ = function(a, b, c) {
	if (!(a.nodeName in goog.dom.TAGS_TO_IGNORE_))
		if (a.nodeType == goog.dom.NodeType.TEXT) c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue);
		else if (a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName]);
	else
		for (a = a.firstChild; a;) goog.dom.getTextContent_(a, b, c), a = a.nextSibling
};
goog.dom.getNodeTextLength = function(a) {
	return goog.dom.getTextContent(a).length
};
goog.dom.getNodeTextOffset = function(a, b) {
	for (var c = b || goog.dom.getOwnerDocument(a).body, d = []; a && a != c;) {
		for (var e = a; e = e.previousSibling;) d.unshift(goog.dom.getTextContent(e));
		a = a.parentNode
	}
	return goog.string.trimLeft(d.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(a, b, c) {
	a = [a];
	for (var d = 0, e = null; 0 < a.length && d < b;)
		if (e = a.pop(), !(e.nodeName in goog.dom.TAGS_TO_IGNORE_))
			if (e.nodeType == goog.dom.NodeType.TEXT) var f = e.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "),
				d = d + f.length;
			else if (e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) d += goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length;
	else
		for (f = e.childNodes.length - 1; 0 <= f; f--) a.push(e.childNodes[f]);
	goog.isObject(c) && (c.remainder = e ? e.nodeValue.length + b - d - 1 : 0, c.node = e);
	return e
};
goog.dom.isNodeList = function(a) {
	if (a && "number" == typeof a.length) {
		if (goog.isObject(a)) return "function" == typeof a.item || "string" == typeof a.item;
		if (goog.isFunction(a)) return "function" == typeof a.item
	}
	return !1
};
goog.dom.getAncestorByTagNameAndClass = function(a, b, c) {
	if (!b && !c) return null;
	var d = b ? b.toUpperCase() : null;
	return goog.dom.getAncestor(a, function(a) {
		return (!d || a.nodeName == d) && (!c || goog.isString(a.className) && goog.array.contains(a.className.split(/\s+/), c))
	}, !0)
};
goog.dom.getAncestorByClass = function(a, b) {
	return goog.dom.getAncestorByTagNameAndClass(a, null, b)
};
goog.dom.getAncestor = function(a, b, c, d) {
	c || (a = a.parentNode);
	c = null == d;
	for (var e = 0; a && (c || e <= d);) {
		if (b(a)) return a;
		a = a.parentNode;
		e++
	}
	return null
};
goog.dom.getActiveElement = function(a) {
	try {
		return a && a.activeElement
	} catch (b) {}
	return null
};
goog.dom.getPixelRatio = goog.functions.cacheReturnValue(function() {
	var a = goog.dom.getWindow(),
		b = goog.userAgent.GECKO && goog.userAgent.MOBILE;
	return goog.isDef(a.devicePixelRatio) && !b ? a.devicePixelRatio : a.matchMedia ? goog.dom.matchesPixelRatio_(.75) || goog.dom.matchesPixelRatio_(1.5) || goog.dom.matchesPixelRatio_(2) || goog.dom.matchesPixelRatio_(3) || 1 : 1
});
goog.dom.matchesPixelRatio_ = function(a) {
	return goog.dom.getWindow().matchMedia("(-webkit-min-device-pixel-ratio: " + a + "),(min--moz-device-pixel-ratio: " + a + "),(min-resolution: " + a + "dppx)").matches ? a : 0
};
goog.dom.DomHelper = function(a) {
	this.document_ = a || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
	this.document_ = a
};
goog.dom.DomHelper.prototype.getDocument = function() {
	return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(a) {
	return goog.dom.getElementHelper_(this.document_, a)
};
goog.dom.DomHelper.prototype.getRequiredElement = function(a) {
	return goog.dom.getRequiredElementHelper_(this.document_, a)
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, b, c) {
	return goog.dom.getElementsByTagNameAndClass_(this.document_, a, b, c)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, b) {
	return goog.dom.getElementsByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, b) {
	return goog.dom.getElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getRequiredElementByClass = function(a, b) {
	return goog.dom.getRequiredElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
	return goog.dom.getViewportSize(a || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
	return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.DomHelper.prototype.createDom = function(a, b, c) {
	return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
	return this.document_.createElement(a)
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
	return this.document_.createTextNode(String(a))
};
goog.dom.DomHelper.prototype.createTable = function(a, b, c) {
	return goog.dom.createTable_(this.document_, a, b, !!c)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(a) {
	return goog.dom.htmlToDocumentFragment_(this.document_, a)
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
	return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function() {
	return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
	return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
	return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.getActiveElement = function(a) {
	return goog.dom.getActiveElement(a || this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.isFocusable = goog.dom.isFocusable;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
goog.style = {};
goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS = !1;
goog.style.setStyle = function(a, b, c) {
	goog.isString(b) ? goog.style.setStyle_(a, c, b) : goog.object.forEach(b, goog.partial(goog.style.setStyle_, a))
};
goog.style.setStyle_ = function(a, b, c) {
	(c = goog.style.getVendorJsStyleName_(a, c)) && (a.style[c] = b)
};
goog.style.getVendorJsStyleName_ = function(a, b) {
	var c = goog.string.toCamelCase(b);
	if (void 0 === a.style[c]) {
		var d = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(c);
		if (void 0 !== a.style[d]) return d
	}
	return c
};
goog.style.getVendorStyleName_ = function(a, b) {
	var c = goog.string.toCamelCase(b);
	return void 0 === a.style[c] && (c = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(c), void 0 !== a.style[c]) ? goog.dom.vendor.getVendorPrefix() + "-" + b : b
};
goog.style.getStyle = function(a, b) {
	var c = a.style[goog.string.toCamelCase(b)];
	return "undefined" !== typeof c ? c : a.style[goog.style.getVendorJsStyleName_(a, b)] || ""
};
goog.style.getComputedStyle = function(a, b) {
	var c = goog.dom.getOwnerDocument(a);
	return c.defaultView && c.defaultView.getComputedStyle && (c = c.defaultView.getComputedStyle(a, null)) ? c[b] || c.getPropertyValue(b) || "" : ""
};
goog.style.getCascadedStyle = function(a, b) {
	return a.currentStyle ? a.currentStyle[b] : null
};
goog.style.getStyle_ = function(a, b) {
	return goog.style.getComputedStyle(a, b) || goog.style.getCascadedStyle(a, b) || a.style && a.style[b]
};
goog.style.getComputedBoxSizing = function(a) {
	return goog.style.getStyle_(a, "boxSizing") || goog.style.getStyle_(a, "MozBoxSizing") || goog.style.getStyle_(a, "WebkitBoxSizing") || null
};
goog.style.getComputedPosition = function(a) {
	return goog.style.getStyle_(a, "position")
};
goog.style.getBackgroundColor = function(a) {
	return goog.style.getStyle_(a, "backgroundColor")
};
goog.style.getComputedOverflowX = function(a) {
	return goog.style.getStyle_(a, "overflowX")
};
goog.style.getComputedOverflowY = function(a) {
	return goog.style.getStyle_(a, "overflowY")
};
goog.style.getComputedZIndex = function(a) {
	return goog.style.getStyle_(a, "zIndex")
};
goog.style.getComputedTextAlign = function(a) {
	return goog.style.getStyle_(a, "textAlign")
};
goog.style.getComputedCursor = function(a) {
	return goog.style.getStyle_(a, "cursor")
};
goog.style.getComputedTransform = function(a) {
	var b = goog.style.getVendorStyleName_(a, "transform");
	return goog.style.getStyle_(a, b) || goog.style.getStyle_(a, "transform")
};
goog.style.setPosition = function(a, b, c) {
	var d, e = goog.userAgent.GECKO && (goog.userAgent.MAC || goog.userAgent.X11) && goog.userAgent.isVersionOrHigher("1.9");
	b instanceof goog.math.Coordinate ? (d = b.x, b = b.y) : (d = b, b = c);
	a.style.left = goog.style.getPixelStyleValue_(d, e);
	a.style.top = goog.style.getPixelStyleValue_(b, e)
};
goog.style.getPosition = function(a) {
	return new goog.math.Coordinate(a.offsetLeft, a.offsetTop)
};
goog.style.getClientViewportElement = function(a) {
	a = a ? goog.dom.getOwnerDocument(a) : goog.dom.getDocument();
	return !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9) || goog.dom.getDomHelper(a).isCss1CompatMode() ? a.documentElement : a.body
};
goog.style.getViewportPageOffset = function(a) {
	var b = a.body;
	a = a.documentElement;
	return new goog.math.Coordinate(b.scrollLeft || a.scrollLeft, b.scrollTop || a.scrollTop)
};
goog.style.getBoundingClientRect_ = function(a) {
	var b;
	try {
		b = a.getBoundingClientRect()
	} catch (c) {
		return {
			left: 0,
			top: 0,
			right: 0,
			bottom: 0
		}
	}
	goog.userAgent.IE && a.ownerDocument.body && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
	return b
};
goog.style.getOffsetParent = function(a) {
	if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8)) return a.offsetParent;
	var b = goog.dom.getOwnerDocument(a),
		c = goog.style.getStyle_(a, "position"),
		d = "fixed" == c || "absolute" == c;
	for (a = a.parentNode; a && a != b; a = a.parentNode)
		if (c = goog.style.getStyle_(a, "position"), d = d && "static" == c && a != b.documentElement && a != b.body, !d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || "fixed" == c || "absolute" == c || "relative" == c)) return a;
	return null
};
goog.style.getVisibleRectForElement = function(a) {
	for (var b = new goog.math.Box(0, Infinity, Infinity, 0), c = goog.dom.getDomHelper(a), d = c.getDocument().body, e = c.getDocument().documentElement, f = c.getDocumentScrollElement(); a = goog.style.getOffsetParent(a);)
		if (!(goog.userAgent.IE && 0 == a.clientWidth || goog.userAgent.WEBKIT && 0 == a.clientHeight && a == d) && a != d && a != e && "visible" != goog.style.getStyle_(a, "overflow")) {
			var g = goog.style.getPageOffset(a),
				h = goog.style.getClientLeftTop(a);
			g.x += h.x;
			g.y += h.y;
			b.top = Math.max(b.top,
				g.y);
			b.right = Math.min(b.right, g.x + a.clientWidth);
			b.bottom = Math.min(b.bottom, g.y + a.clientHeight);
			b.left = Math.max(b.left, g.x)
		}
	d = f.scrollLeft;
	f = f.scrollTop;
	b.left = Math.max(b.left, d);
	b.top = Math.max(b.top, f);
	c = c.getViewportSize();
	b.right = Math.min(b.right, d + c.width);
	b.bottom = Math.min(b.bottom, f + c.height);
	return 0 <= b.top && 0 <= b.left && b.bottom > b.top && b.right > b.left ? b : null
};
goog.style.getContainerOffsetToScrollInto = function(a, b, c) {
	var d = goog.style.getPageOffset(a),
		e = goog.style.getPageOffset(b),
		f = goog.style.getBorderBox(b),
		g = d.x - e.x - f.left,
		d = d.y - e.y - f.top,
		e = b.clientWidth - a.offsetWidth;
	a = b.clientHeight - a.offsetHeight;
	f = b.scrollLeft;
	b = b.scrollTop;
	c ? (f += g - e / 2, b += d - a / 2) : (f += Math.min(g, Math.max(g - e, 0)), b += Math.min(d, Math.max(d - a, 0)));
	return new goog.math.Coordinate(f, b)
};
goog.style.scrollIntoContainerView = function(a, b, c) {
	a = goog.style.getContainerOffsetToScrollInto(a, b, c);
	b.scrollLeft = a.x;
	b.scrollTop = a.y
};
goog.style.getClientLeftTop = function(a) {
	if (goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("1.9")) {
		var b = parseFloat(goog.style.getComputedStyle(a, "borderLeftWidth"));
		if (goog.style.isRightToLeft(a)) var c = a.offsetWidth - a.clientWidth - b - parseFloat(goog.style.getComputedStyle(a, "borderRightWidth")),
			b = b + c;
		return new goog.math.Coordinate(b, parseFloat(goog.style.getComputedStyle(a, "borderTopWidth")))
	}
	return new goog.math.Coordinate(a.clientLeft, a.clientTop)
};
goog.style.getPageOffset = function(a) {
	var b, c = goog.dom.getOwnerDocument(a),
		d = goog.style.getStyle_(a, "position");
	goog.asserts.assertObject(a, "Parameter is required");
	var e = !goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS && goog.userAgent.GECKO && c.getBoxObjectFor && !a.getBoundingClientRect && "absolute" == d && (b = c.getBoxObjectFor(a)) && (0 > b.screenX || 0 > b.screenY),
		f = new goog.math.Coordinate(0, 0),
		g = goog.style.getClientViewportElement(c);
	if (a == g) return f;
	if (goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS ||
		a.getBoundingClientRect) b = goog.style.getBoundingClientRect_(a), a = goog.dom.getDomHelper(c).getDocumentScroll(), f.x = b.left + a.x, f.y = b.top + a.y;
	else if (c.getBoxObjectFor && !e) b = c.getBoxObjectFor(a), a = c.getBoxObjectFor(g), f.x = b.screenX - a.screenX, f.y = b.screenY - a.screenY;
	else {
		b = a;
		do {
			f.x += b.offsetLeft;
			f.y += b.offsetTop;
			b != a && (f.x += b.clientLeft || 0, f.y += b.clientTop || 0);
			if (goog.userAgent.WEBKIT && "fixed" == goog.style.getComputedPosition(b)) {
				f.x += c.body.scrollLeft;
				f.y += c.body.scrollTop;
				break
			}
			b = b.offsetParent
		} while (b &&
			b != a);
		if (goog.userAgent.OPERA || goog.userAgent.WEBKIT && "absolute" == d) f.y -= c.body.offsetTop;
		for (b = a;
			(b = goog.style.getOffsetParent(b)) && b != c.body && b != g;) f.x -= b.scrollLeft, goog.userAgent.OPERA && "TR" == b.tagName || (f.y -= b.scrollTop)
	}
	return f
};
goog.style.getPageOffsetLeft = function(a) {
	return goog.style.getPageOffset(a).x
};
goog.style.getPageOffsetTop = function(a) {
	return goog.style.getPageOffset(a).y
};
goog.style.getFramedPageOffset = function(a, b) {
	var c = new goog.math.Coordinate(0, 0),
		d = goog.dom.getWindow(goog.dom.getOwnerDocument(a)),
		e = a;
	do {
		var f = d == b ? goog.style.getPageOffset(e) : goog.style.getClientPositionForElement_(goog.asserts.assert(e));
		c.x += f.x;
		c.y += f.y
	} while (d && d != b && (e = d.frameElement) && (d = d.parent));
	return c
};
goog.style.translateRectForAnotherFrame = function(a, b, c) {
	if (b.getDocument() != c.getDocument()) {
		var d = b.getDocument().body;
		c = goog.style.getFramedPageOffset(d, c.getWindow());
		c = goog.math.Coordinate.difference(c, goog.style.getPageOffset(d));
		goog.userAgent.IE && !b.isCss1CompatMode() && (c = goog.math.Coordinate.difference(c, b.getDocumentScroll()));
		a.left += c.x;
		a.top += c.y
	}
};
goog.style.getRelativePosition = function(a, b) {
	var c = goog.style.getClientPosition(a),
		d = goog.style.getClientPosition(b);
	return new goog.math.Coordinate(c.x - d.x, c.y - d.y)
};
goog.style.getClientPositionForElement_ = function(a) {
	var b;
	if (goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS || a.getBoundingClientRect) b = goog.style.getBoundingClientRect_(a), b = new goog.math.Coordinate(b.left, b.top);
	else {
		b = goog.dom.getDomHelper(a).getDocumentScroll();
		var c = goog.style.getPageOffset(a);
		b = new goog.math.Coordinate(c.x - b.x, c.y - b.y)
	}
	return goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher(12) ? goog.math.Coordinate.sum(b, goog.style.getCssTranslation(a)) : b
};
goog.style.getClientPosition = function(a) {
	goog.asserts.assert(a);
	if (a.nodeType == goog.dom.NodeType.ELEMENT) return goog.style.getClientPositionForElement_(a);
	var b = goog.isFunction(a.getBrowserEvent),
		c = a;
	a.targetTouches ? c = a.targetTouches[0] : b && a.getBrowserEvent().targetTouches && (c = a.getBrowserEvent().targetTouches[0]);
	return new goog.math.Coordinate(c.clientX, c.clientY)
};
goog.style.setPageOffset = function(a, b, c) {
	var d = goog.style.getPageOffset(a);
	b instanceof goog.math.Coordinate && (c = b.y, b = b.x);
	goog.style.setPosition(a, a.offsetLeft + (b - d.x), a.offsetTop + (c - d.y))
};
goog.style.setSize = function(a, b, c) {
	if (b instanceof goog.math.Size) c = b.height, b = b.width;
	else if (void 0 == c) throw Error("missing height argument");
	goog.style.setWidth(a, b);
	goog.style.setHeight(a, c)
};
goog.style.getPixelStyleValue_ = function(a, b) {
	"number" == typeof a && (a = (b ? Math.round(a) : a) + "px");
	return a
};
goog.style.setHeight = function(a, b) {
	a.style.height = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.setWidth = function(a, b) {
	a.style.width = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.getSize = function(a) {
	return goog.style.evaluateWithTemporaryDisplay_(goog.style.getSizeWithDisplay_, a)
};
goog.style.evaluateWithTemporaryDisplay_ = function(a, b) {
	if ("none" != goog.style.getStyle_(b, "display")) return a(b);
	var c = b.style,
		d = c.display,
		e = c.visibility,
		f = c.position;
	c.visibility = "hidden";
	c.position = "absolute";
	c.display = "inline";
	var g = a(b);
	c.display = d;
	c.position = f;
	c.visibility = e;
	return g
};
goog.style.getSizeWithDisplay_ = function(a) {
	var b = a.offsetWidth,
		c = a.offsetHeight,
		d = goog.userAgent.WEBKIT && !b && !c;
	return goog.isDef(b) && !d || !a.getBoundingClientRect ? new goog.math.Size(b, c) : (a = goog.style.getBoundingClientRect_(a), new goog.math.Size(a.right - a.left, a.bottom - a.top))
};
goog.style.getTransformedSize = function(a) {
	if (!a.getBoundingClientRect) return null;
	a = goog.style.evaluateWithTemporaryDisplay_(goog.style.getBoundingClientRect_, a);
	return new goog.math.Size(a.right - a.left, a.bottom - a.top)
};
goog.style.getBounds = function(a) {
	var b = goog.style.getPageOffset(a);
	a = goog.style.getSize(a);
	return new goog.math.Rect(b.x, b.y, a.width, a.height)
};
goog.style.toCamelCase = function(a) {
	return goog.string.toCamelCase(String(a))
};
goog.style.toSelectorCase = function(a) {
	return goog.string.toSelectorCase(a)
};
goog.style.getOpacity = function(a) {
	var b = a.style;
	a = "";
	"opacity" in b ? a = b.opacity : "MozOpacity" in b ? a = b.MozOpacity : "filter" in b && (b = b.filter.match(/alpha\(opacity=([\d.]+)\)/)) && (a = String(b[1] / 100));
	return "" == a ? a : Number(a)
};
goog.style.setOpacity = function(a, b) {
	var c = a.style;
	"opacity" in c ? c.opacity = b : "MozOpacity" in c ? c.MozOpacity = b : "filter" in c && (c.filter = "" === b ? "" : "alpha(opacity=" + 100 * b + ")")
};
goog.style.setTransparentBackgroundImage = function(a, b) {
	var c = a.style;
	goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? c.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + b + '", sizingMethod="crop")' : (c.backgroundImage = "url(" + b + ")", c.backgroundPosition = "top left", c.backgroundRepeat = "no-repeat")
};
goog.style.clearTransparentBackgroundImage = function(a) {
	a = a.style;
	"filter" in a ? a.filter = "" : a.backgroundImage = "none"
};
goog.style.showElement = function(a, b) {
	goog.style.setElementShown(a, b)
};
goog.style.setElementShown = function(a, b) {
	a.style.display = b ? "" : "none"
};
goog.style.isElementShown = function(a) {
	return "none" != a.style.display
};
goog.style.installStyles = function(a, b) {
	var c = goog.dom.getDomHelper(b),
		d = null,
		e = c.getDocument();
	goog.userAgent.IE && e.createStyleSheet ? (d = e.createStyleSheet(), goog.style.setStyles(d, a)) : (e = c.getElementsByTagNameAndClass("head")[0], e || (d = c.getElementsByTagNameAndClass("body")[0], e = c.createDom("head"), d.parentNode.insertBefore(e, d)), d = c.createDom("style"), goog.style.setStyles(d, a), c.appendChild(e, d));
	return d
};
goog.style.uninstallStyles = function(a) {
	goog.dom.removeNode(a.ownerNode || a.owningElement || a)
};
goog.style.setStyles = function(a, b) {
	goog.userAgent.IE && goog.isDef(a.cssText) ? a.cssText = b : a.innerHTML = b
};
goog.style.setPreWrap = function(a) {
	a = a.style;
	goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.whiteSpace = "pre", a.wordWrap = "break-word") : a.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : "pre-wrap"
};
goog.style.setInlineBlock = function(a) {
	a = a.style;
	a.position = "relative";
	goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.zoom = "1", a.display = "inline") : a.display = goog.userAgent.GECKO ? goog.userAgent.isVersionOrHigher("1.9a") ? "inline-block" : "-moz-inline-box" : "inline-block"
};
goog.style.isRightToLeft = function(a) {
	return "rtl" == goog.style.getStyle_(a, "direction")
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(a) {
	return goog.style.unselectableStyle_ ? "none" == a.style[goog.style.unselectableStyle_].toLowerCase() : goog.userAgent.IE || goog.userAgent.OPERA ? "on" == a.getAttribute("unselectable") : !1
};
goog.style.setUnselectable = function(a, b, c) {
	c = c ? null : a.getElementsByTagName("*");
	var d = goog.style.unselectableStyle_;
	if (d) {
		if (b = b ? "none" : "", a.style[d] = b, c) {
			a = 0;
			for (var e; e = c[a]; a++) e.style[d] = b
		}
	} else if (goog.userAgent.IE || goog.userAgent.OPERA)
		if (b = b ? "on" : "", a.setAttribute("unselectable", b), c)
			for (a = 0; e = c[a]; a++) e.setAttribute("unselectable", b)
};
goog.style.getBorderBoxSize = function(a) {
	return new goog.math.Size(a.offsetWidth, a.offsetHeight)
};
goog.style.setBorderBoxSize = function(a, b) {
	var c = goog.dom.getOwnerDocument(a),
		d = goog.dom.getDomHelper(c).isCss1CompatMode();
	if (!goog.userAgent.IE || d && goog.userAgent.isVersionOrHigher("8")) goog.style.setBoxSizingSize_(a, b, "border-box");
	else if (c = a.style, d) {
		var d = goog.style.getPaddingBox(a),
			e = goog.style.getBorderBox(a);
		c.pixelWidth = b.width - e.left - d.left - d.right - e.right;
		c.pixelHeight = b.height - e.top - d.top - d.bottom - e.bottom
	} else c.pixelWidth = b.width, c.pixelHeight = b.height
};
goog.style.getContentBoxSize = function(a) {
	var b = goog.dom.getOwnerDocument(a),
		c = goog.userAgent.IE && a.currentStyle;
	if (c && goog.dom.getDomHelper(b).isCss1CompatMode() && "auto" != c.width && "auto" != c.height && !c.boxSizing) return b = goog.style.getIePixelValue_(a, c.width, "width", "pixelWidth"), a = goog.style.getIePixelValue_(a, c.height, "height", "pixelHeight"), new goog.math.Size(b, a);
	c = goog.style.getBorderBoxSize(a);
	b = goog.style.getPaddingBox(a);
	a = goog.style.getBorderBox(a);
	return new goog.math.Size(c.width - a.left -
		b.left - b.right - a.right, c.height - a.top - b.top - b.bottom - a.bottom)
};
goog.style.setContentBoxSize = function(a, b) {
	var c = goog.dom.getOwnerDocument(a),
		d = goog.dom.getDomHelper(c).isCss1CompatMode();
	if (!goog.userAgent.IE || d && goog.userAgent.isVersionOrHigher("8")) goog.style.setBoxSizingSize_(a, b, "content-box");
	else if (c = a.style, d) c.pixelWidth = b.width, c.pixelHeight = b.height;
	else {
		var d = goog.style.getPaddingBox(a),
			e = goog.style.getBorderBox(a);
		c.pixelWidth = b.width + e.left + d.left + d.right + e.right;
		c.pixelHeight = b.height + e.top + d.top + d.bottom + e.bottom
	}
};
goog.style.setBoxSizingSize_ = function(a, b, c) {
	a = a.style;
	goog.userAgent.GECKO ? a.MozBoxSizing = c : goog.userAgent.WEBKIT ? a.WebkitBoxSizing = c : a.boxSizing = c;
	a.width = Math.max(b.width, 0) + "px";
	a.height = Math.max(b.height, 0) + "px"
};
goog.style.getIePixelValue_ = function(a, b, c, d) {
	if (/^\d+px?$/.test(b)) return parseInt(b, 10);
	var e = a.style[c],
		f = a.runtimeStyle[c];
	a.runtimeStyle[c] = a.currentStyle[c];
	a.style[c] = b;
	b = a.style[d];
	a.style[c] = e;
	a.runtimeStyle[c] = f;
	return b
};
goog.style.getIePixelDistance_ = function(a, b) {
	var c = goog.style.getCascadedStyle(a, b);
	return c ? goog.style.getIePixelValue_(a, c, "left", "pixelLeft") : 0
};
goog.style.getBox_ = function(a, b) {
	if (goog.userAgent.IE) {
		var c = goog.style.getIePixelDistance_(a, b + "Left"),
			d = goog.style.getIePixelDistance_(a, b + "Right"),
			e = goog.style.getIePixelDistance_(a, b + "Top"),
			f = goog.style.getIePixelDistance_(a, b + "Bottom");
		return new goog.math.Box(e, d, f, c)
	}
	c = goog.style.getComputedStyle(a, b + "Left");
	d = goog.style.getComputedStyle(a, b + "Right");
	e = goog.style.getComputedStyle(a, b + "Top");
	f = goog.style.getComputedStyle(a, b + "Bottom");
	return new goog.math.Box(parseFloat(e), parseFloat(d), parseFloat(f),
		parseFloat(c))
};
goog.style.getPaddingBox = function(a) {
	return goog.style.getBox_(a, "padding")
};
goog.style.getMarginBox = function(a) {
	return goog.style.getBox_(a, "margin")
};
goog.style.ieBorderWidthKeywords_ = {
	thin: 2,
	medium: 4,
	thick: 6
};
goog.style.getIePixelBorder_ = function(a, b) {
	if ("none" == goog.style.getCascadedStyle(a, b + "Style")) return 0;
	var c = goog.style.getCascadedStyle(a, b + "Width");
	return c in goog.style.ieBorderWidthKeywords_ ? goog.style.ieBorderWidthKeywords_[c] : goog.style.getIePixelValue_(a, c, "left", "pixelLeft")
};
goog.style.getBorderBox = function(a) {
	if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
		var b = goog.style.getIePixelBorder_(a, "borderLeft"),
			c = goog.style.getIePixelBorder_(a, "borderRight"),
			d = goog.style.getIePixelBorder_(a, "borderTop");
		a = goog.style.getIePixelBorder_(a, "borderBottom");
		return new goog.math.Box(d, c, a, b)
	}
	b = goog.style.getComputedStyle(a, "borderLeftWidth");
	c = goog.style.getComputedStyle(a, "borderRightWidth");
	d = goog.style.getComputedStyle(a, "borderTopWidth");
	a = goog.style.getComputedStyle(a,
		"borderBottomWidth");
	return new goog.math.Box(parseFloat(d), parseFloat(c), parseFloat(a), parseFloat(b))
};
goog.style.getFontFamily = function(a) {
	var b = goog.dom.getOwnerDocument(a),
		c = "";
	if (b.body.createTextRange && goog.dom.contains(b, a)) {
		b = b.body.createTextRange();
		b.moveToElementText(a);
		try {
			c = b.queryCommandValue("FontName")
		} catch (d) {
			c = ""
		}
	}
	c || (c = goog.style.getStyle_(a, "fontFamily"));
	a = c.split(",");
	1 < a.length && (c = a[0]);
	return goog.string.stripQuotes(c, "\"'")
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(a) {
	return (a = a.match(goog.style.lengthUnitRegex_)) && a[0] || null
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {
	cm: 1,
	"in": 1,
	mm: 1,
	pc: 1,
	pt: 1
};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {
	em: 1,
	ex: 1
};
goog.style.getFontSize = function(a) {
	var b = goog.style.getStyle_(a, "fontSize"),
		c = goog.style.getLengthUnits(b);
	if (b && "px" == c) return parseInt(b, 10);
	if (goog.userAgent.IE) {
		if (c in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) return goog.style.getIePixelValue_(a, b, "left", "pixelLeft");
		if (a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && c in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) return a = a.parentNode, c = goog.style.getStyle_(a, "fontSize"), goog.style.getIePixelValue_(a, b == c ? "1em" : b, "left", "pixelLeft")
	}
	c =
		goog.dom.createDom("span", {
			style: "visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"
		});
	goog.dom.appendChild(a, c);
	b = c.offsetHeight;
	goog.dom.removeNode(c);
	return b
};
goog.style.parseStyleAttribute = function(a) {
	var b = {};
	goog.array.forEach(a.split(/\s*;\s*/), function(a) {
		a = a.split(/\s*:\s*/);
		2 == a.length && (b[goog.string.toCamelCase(a[0].toLowerCase())] = a[1])
	});
	return b
};
goog.style.toStyleAttribute = function(a) {
	var b = [];
	goog.object.forEach(a, function(a, d) {
		b.push(goog.string.toSelectorCase(d), ":", a, ";")
	});
	return b.join("")
};
goog.style.setFloat = function(a, b) {
	a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = b
};
goog.style.getFloat = function(a) {
	return a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || ""
};
goog.style.getScrollbarWidth = function(a) {
	var b = goog.dom.createElement("div");
	a && (b.className = a);
	b.style.cssText = "overflow:auto;position:absolute;top:0;width:100px;height:100px";
	a = goog.dom.createElement("div");
	goog.style.setSize(a, "200px", "200px");
	b.appendChild(a);
	goog.dom.appendChild(goog.dom.getDocument().body, b);
	a = b.offsetWidth - b.clientWidth;
	goog.dom.removeNode(b);
	return a
};
goog.style.MATRIX_TRANSLATION_REGEX_ = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
goog.style.getCssTranslation = function(a) {
	a = goog.style.getComputedTransform(a);
	return a ? (a = a.match(goog.style.MATRIX_TRANSLATION_REGEX_)) ? new goog.math.Coordinate(parseFloat(a[1]), parseFloat(a[2])) : new goog.math.Coordinate(0, 0) : new goog.math.Coordinate(0, 0)
};
goog.events = {};
goog.events.EventId = function(a) {
	this.id = a
};
goog.events.EventId.prototype.toString = function() {
	return this.id
};
goog.events.Listenable = function() {};
goog.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (1E6 * Math.random() | 0);
goog.events.Listenable.addImplementation = function(a) {
	a.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = !0
};
goog.events.Listenable.isImplementedBy = function(a) {
	return !(!a || !a[goog.events.Listenable.IMPLEMENTED_BY_PROP])
};
goog.events.ListenableKey = function() {};
goog.events.ListenableKey.counter_ = 0;
goog.events.ListenableKey.reserveKey = function() {
	return ++goog.events.ListenableKey.counter_
};
goog.events.Listener = function(a, b, c, d, e, f) {
	goog.events.Listener.ENABLE_MONITORING && (this.creationStack = Error().stack);
	this.listener = a;
	this.proxy = b;
	this.src = c;
	this.type = d;
	this.capture = !!e;
	this.handler = f;
	this.key = goog.events.ListenableKey.reserveKey();
	this.removed = this.callOnce = !1
};
goog.events.Listener.ENABLE_MONITORING = !1;
goog.events.Listener.prototype.markAsRemoved = function() {
	this.removed = !0;
	this.handler = this.src = this.proxy = this.listener = null
};
goog.events.ListenerMap = function(a) {
	this.src = a;
	this.listeners = {};
	this.typeCount_ = 0
};
goog.events.ListenerMap.prototype.getTypeCount = function() {
	return this.typeCount_
};
goog.events.ListenerMap.prototype.getListenerCount = function() {
	var a = 0,
		b;
	for (b in this.listeners) a += this.listeners[b].length;
	return a
};
goog.events.ListenerMap.prototype.add = function(a, b, c, d, e) {
	var f = a.toString();
	a = this.listeners[f];
	a || (a = this.listeners[f] = [], this.typeCount_++);
	var g = goog.events.ListenerMap.findListenerIndex_(a, b, d, e); - 1 < g ? (b = a[g], c || (b.callOnce = !1)) : (b = new goog.events.Listener(b, null, this.src, f, !!d, e), b.callOnce = c, a.push(b));
	return b
};
goog.events.ListenerMap.prototype.remove = function(a, b, c, d) {
	a = a.toString();
	if (!(a in this.listeners)) return !1;
	var e = this.listeners[a];
	b = goog.events.ListenerMap.findListenerIndex_(e, b, c, d);
	return -1 < b ? (e[b].markAsRemoved(), goog.array.removeAt(e, b), 0 == e.length && (delete this.listeners[a], this.typeCount_--), !0) : !1
};
goog.events.ListenerMap.prototype.removeByKey = function(a) {
	var b = a.type;
	if (!(b in this.listeners)) return !1;
	var c = goog.array.remove(this.listeners[b], a);
	c && (a.markAsRemoved(), 0 == this.listeners[b].length && (delete this.listeners[b], this.typeCount_--));
	return c
};
goog.events.ListenerMap.prototype.removeAll = function(a) {
	a = a && a.toString();
	var b = 0,
		c;
	for (c in this.listeners)
		if (!a || c == a) {
			for (var d = this.listeners[c], e = 0; e < d.length; e++) ++b, d[e].markAsRemoved();
			delete this.listeners[c];
			this.typeCount_--
		}
	return b
};
goog.events.ListenerMap.prototype.getListeners = function(a, b) {
	var c = this.listeners[a.toString()],
		d = [];
	if (c)
		for (var e = 0; e < c.length; ++e) {
			var f = c[e];
			f.capture == b && d.push(f)
		}
	return d
};
goog.events.ListenerMap.prototype.getListener = function(a, b, c, d) {
	a = this.listeners[a.toString()];
	var e = -1;
	a && (e = goog.events.ListenerMap.findListenerIndex_(a, b, c, d));
	return -1 < e ? a[e] : null
};
goog.events.ListenerMap.prototype.hasListener = function(a, b) {
	var c = goog.isDef(a),
		d = c ? a.toString() : "",
		e = goog.isDef(b);
	return goog.object.some(this.listeners, function(a, g) {
		for (var h = 0; h < a.length; ++h)
			if (!(c && a[h].type != d || e && a[h].capture != b)) return !0;
		return !1
	})
};
goog.events.ListenerMap.findListenerIndex_ = function(a, b, c, d) {
	for (var e = 0; e < a.length; ++e) {
		var f = a[e];
		if (!f.removed && f.listener == b && f.capture == !!c && f.handler == d) return e
	}
	return -1
};
goog.events.BrowserFeature = {
	HAS_W3C_BUTTON: !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9),
	HAS_W3C_EVENT_SUPPORT: !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9),
	SET_KEY_CODE_TO_PREVENT_DEFAULT: goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"),
	HAS_NAVIGATOR_ONLINE_PROPERTY: !goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("528"),
	HAS_HTML5_NETWORK_EVENT_SUPPORT: goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9b") || goog.userAgent.IE && goog.userAgent.isVersionOrHigher("8") ||
		goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("528"),
	HTML5_NETWORK_EVENTS_FIRE_ON_BODY: goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("8") || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"),
	TOUCH_ENABLED: "ontouchstart" in goog.global || !!(goog.global.document && document.documentElement && "ontouchstart" in document.documentElement) || !(!goog.global.navigator || !goog.global.navigator.msMaxTouchPoints)
};
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function() {};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = !1;
goog.debug.entryPointRegistry.register = function(a) {
	goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = a;
	if (goog.debug.entryPointRegistry.monitorsMayExist_)
		for (var b = goog.debug.entryPointRegistry.monitors_, c = 0; c < b.length; c++) a(goog.bind(b[c].wrap, b[c]))
};
goog.debug.entryPointRegistry.monitorAll = function(a) {
	goog.debug.entryPointRegistry.monitorsMayExist_ = !0;
	for (var b = goog.bind(a.wrap, a), c = 0; c < goog.debug.entryPointRegistry.refList_.length; c++) goog.debug.entryPointRegistry.refList_[c](b);
	goog.debug.entryPointRegistry.monitors_.push(a)
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(a) {
	var b = goog.debug.entryPointRegistry.monitors_;
	goog.asserts.assert(a == b[b.length - 1], "Only the most recent monitor can be unwrapped.");
	a = goog.bind(a.unwrap, a);
	for (var c = 0; c < goog.debug.entryPointRegistry.refList_.length; c++) goog.debug.entryPointRegistry.refList_[c](a);
	b.length--
};
goog.events.getVendorPrefixedName_ = function(a) {
	return goog.userAgent.WEBKIT ? "webkit" + a : goog.userAgent.OPERA ? "o" + a.toLowerCase() : a.toLowerCase()
};
goog.events.EventType = {
	CLICK: "click",
	RIGHTCLICK: "rightclick",
	DBLCLICK: "dblclick",
	MOUSEDOWN: "mousedown",
	MOUSEUP: "mouseup",
	MOUSEOVER: "mouseover",
	MOUSEOUT: "mouseout",
	MOUSEMOVE: "mousemove",
	MOUSEENTER: "mouseenter",
	MOUSELEAVE: "mouseleave",
	SELECTSTART: "selectstart",
	KEYPRESS: "keypress",
	KEYDOWN: "keydown",
	KEYUP: "keyup",
	BLUR: "blur",
	FOCUS: "focus",
	DEACTIVATE: "deactivate",
	FOCUSIN: goog.userAgent.IE ? "focusin" : "DOMFocusIn",
	FOCUSOUT: goog.userAgent.IE ? "focusout" : "DOMFocusOut",
	CHANGE: "change",
	SELECT: "select",
	SUBMIT: "submit",
	INPUT: "input",
	PROPERTYCHANGE: "propertychange",
	DRAGSTART: "dragstart",
	DRAG: "drag",
	DRAGENTER: "dragenter",
	DRAGOVER: "dragover",
	DRAGLEAVE: "dragleave",
	DROP: "drop",
	DRAGEND: "dragend",
	TOUCHSTART: "touchstart",
	TOUCHMOVE: "touchmove",
	TOUCHEND: "touchend",
	TOUCHCANCEL: "touchcancel",
	BEFOREUNLOAD: "beforeunload",
	CONSOLEMESSAGE: "consolemessage",
	CONTEXTMENU: "contextmenu",
	DOMCONTENTLOADED: "DOMContentLoaded",
	ERROR: "error",
	HELP: "help",
	LOAD: "load",
	LOSECAPTURE: "losecapture",
	ORIENTATIONCHANGE: "orientationchange",
	READYSTATECHANGE: "readystatechange",
	RESIZE: "resize",
	SCROLL: "scroll",
	UNLOAD: "unload",
	HASHCHANGE: "hashchange",
	PAGEHIDE: "pagehide",
	PAGESHOW: "pageshow",
	POPSTATE: "popstate",
	COPY: "copy",
	PASTE: "paste",
	CUT: "cut",
	BEFORECOPY: "beforecopy",
	BEFORECUT: "beforecut",
	BEFOREPASTE: "beforepaste",
	ONLINE: "online",
	OFFLINE: "offline",
	MESSAGE: "message",
	CONNECT: "connect",
	ANIMATIONSTART: goog.events.getVendorPrefixedName_("AnimationStart"),
	ANIMATIONEND: goog.events.getVendorPrefixedName_("AnimationEnd"),
	ANIMATIONITERATION: goog.events.getVendorPrefixedName_("AnimationIteration"),
	TRANSITIONEND: goog.events.getVendorPrefixedName_("TransitionEnd"),
	POINTERDOWN: "pointerdown",
	POINTERUP: "pointerup",
	POINTERCANCEL: "pointercancel",
	POINTERMOVE: "pointermove",
	POINTEROVER: "pointerover",
	POINTEROUT: "pointerout",
	POINTERENTER: "pointerenter",
	POINTERLEAVE: "pointerleave",
	GOTPOINTERCAPTURE: "gotpointercapture",
	LOSTPOINTERCAPTURE: "lostpointercapture",
	MSGESTURECHANGE: "MSGestureChange",
	MSGESTUREEND: "MSGestureEnd",
	MSGESTUREHOLD: "MSGestureHold",
	MSGESTURESTART: "MSGestureStart",
	MSGESTURETAP: "MSGestureTap",
	MSGOTPOINTERCAPTURE: "MSGotPointerCapture",
	MSINERTIASTART: "MSInertiaStart",
	MSLOSTPOINTERCAPTURE: "MSLostPointerCapture",
	MSPOINTERCANCEL: "MSPointerCancel",
	MSPOINTERDOWN: "MSPointerDown",
	MSPOINTERENTER: "MSPointerEnter",
	MSPOINTERHOVER: "MSPointerHover",
	MSPOINTERLEAVE: "MSPointerLeave",
	MSPOINTERMOVE: "MSPointerMove",
	MSPOINTEROUT: "MSPointerOut",
	MSPOINTEROVER: "MSPointerOver",
	MSPOINTERUP: "MSPointerUp",
	TEXTINPUT: "textinput",
	COMPOSITIONSTART: "compositionstart",
	COMPOSITIONUPDATE: "compositionupdate",
	COMPOSITIONEND: "compositionend",
	EXIT: "exit",
	LOADABORT: "loadabort",
	LOADCOMMIT: "loadcommit",
	LOADREDIRECT: "loadredirect",
	LOADSTART: "loadstart",
	LOADSTOP: "loadstop",
	RESPONSIVE: "responsive",
	SIZECHANGED: "sizechanged",
	UNRESPONSIVE: "unresponsive",
	VISIBILITYCHANGE: "visibilitychange",
	STORAGE: "storage",
	DOMSUBTREEMODIFIED: "DOMSubtreeModified",
	DOMNODEINSERTED: "DOMNodeInserted",
	DOMNODEREMOVED: "DOMNodeRemoved",
	DOMNODEREMOVEDFROMDOCUMENT: "DOMNodeRemovedFromDocument",
	DOMNODEINSERTEDINTODOCUMENT: "DOMNodeInsertedIntoDocument",
	DOMATTRMODIFIED: "DOMAttrModified",
	DOMCHARACTERDATAMODIFIED: "DOMCharacterDataModified"
};
goog.disposable = {};
goog.disposable.IDisposable = function() {};
goog.Disposable = function() {
	goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (goog.Disposable.INCLUDE_STACK_ON_CREATION && (this.creationStack = Error().stack), goog.Disposable.instances_[goog.getUid(this)] = this)
};
goog.Disposable.MonitoringMode = {
	OFF: 0,
	PERMANENT: 1,
	INTERACTIVE: 2
};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.INCLUDE_STACK_ON_CREATION = !0;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
	var a = [],
		b;
	for (b in goog.Disposable.instances_) goog.Disposable.instances_.hasOwnProperty(b) && a.push(goog.Disposable.instances_[Number(b)]);
	return a
};
goog.Disposable.clearUndisposedObjects = function() {
	goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function() {
	return this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
	if (!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
		var a = goog.getUid(this);
		if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(a)) throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
		delete goog.Disposable.instances_[a]
	}
};
goog.Disposable.prototype.registerDisposable = function(a) {
	this.addOnDisposeCallback(goog.partial(goog.dispose, a))
};
goog.Disposable.prototype.addOnDisposeCallback = function(a, b) {
	this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []);
	this.onDisposeCallbacks_.push(goog.isDef(b) ? goog.bind(a, b) : a)
};
goog.Disposable.prototype.disposeInternal = function() {
	if (this.onDisposeCallbacks_)
		for (; this.onDisposeCallbacks_.length;) this.onDisposeCallbacks_.shift()()
};
goog.Disposable.isDisposed = function(a) {
	return a && "function" == typeof a.isDisposed ? a.isDisposed() : !1
};
goog.dispose = function(a) {
	a && "function" == typeof a.dispose && a.dispose()
};
goog.disposeAll = function(a) {
	for (var b = 0, c = arguments.length; b < c; ++b) {
		var d = arguments[b];
		goog.isArrayLike(d) ? goog.disposeAll.apply(null, d) : goog.dispose(d)
	}
};
goog.events.Event = function(a, b) {
	this.type = a instanceof goog.events.EventId ? String(a) : a;
	this.currentTarget = this.target = b;
	this.defaultPrevented = this.propagationStopped_ = !1;
	this.returnValue_ = !0
};
goog.events.Event.prototype.disposeInternal = function() {};
goog.events.Event.prototype.dispose = function() {};
goog.events.Event.prototype.stopPropagation = function() {
	this.propagationStopped_ = !0
};
goog.events.Event.prototype.preventDefault = function() {
	this.defaultPrevented = !0;
	this.returnValue_ = !1
};
goog.events.Event.stopPropagation = function(a) {
	a.stopPropagation()
};
goog.events.Event.preventDefault = function(a) {
	a.preventDefault()
};
goog.reflect = {};
goog.reflect.object = function(a, b) {
	return b
};
goog.reflect.sinkValue = function(a) {
	goog.reflect.sinkValue[" "](a);
	return a
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(a, b) {
	try {
		return goog.reflect.sinkValue(a[b]), !0
	} catch (c) {}
	return !1
};
goog.events.BrowserEvent = function(a, b) {
	goog.events.Event.call(this, a ? a.type : "");
	this.relatedTarget = this.currentTarget = this.target = null;
	this.charCode = this.keyCode = this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
	this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
	this.state = null;
	this.platformModifierKey = !1;
	this.event_ = null;
	a && this.init(a, b)
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {
	LEFT: 0,
	MIDDLE: 1,
	RIGHT: 2
};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.init = function(a, b) {
	var c = this.type = a.type;
	this.target = a.target || a.srcElement;
	this.currentTarget = b;
	var d = a.relatedTarget;
	d ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty(d, "nodeName") || (d = null)) : c == goog.events.EventType.MOUSEOVER ? d = a.fromElement : c == goog.events.EventType.MOUSEOUT && (d = a.toElement);
	this.relatedTarget = d;
	this.offsetX = goog.userAgent.WEBKIT || void 0 !== a.offsetX ? a.offsetX : a.layerX;
	this.offsetY = goog.userAgent.WEBKIT || void 0 !== a.offsetY ? a.offsetY : a.layerY;
	this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX;
	this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY;
	this.screenX = a.screenX || 0;
	this.screenY = a.screenY || 0;
	this.button = a.button;
	this.keyCode = a.keyCode || 0;
	this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
	this.ctrlKey = a.ctrlKey;
	this.altKey = a.altKey;
	this.shiftKey = a.shiftKey;
	this.metaKey = a.metaKey;
	this.platformModifierKey = goog.userAgent.MAC ? a.metaKey : a.ctrlKey;
	this.state = a.state;
	this.event_ = a;
	a.defaultPrevented && this.preventDefault()
};
goog.events.BrowserEvent.prototype.isButton = function(a) {
	return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == a : "click" == this.type ? a == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[a])
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
	return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
	goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
	this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
	goog.events.BrowserEvent.superClass_.preventDefault.call(this);
	var a = this.event_;
	if (a.preventDefault) a.preventDefault();
	else if (a.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) try {
		if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) a.keyCode = -1
	} catch (b) {}
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
	return this.event_
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {};
goog.events.LISTENER_MAP_PROP_ = "closure_lm_" + (1E6 * Math.random() | 0);
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.CaptureSimulationMode = {
	OFF_AND_FAIL: 0,
	OFF_AND_SILENT: 1,
	ON: 2
};
goog.events.CAPTURE_SIMULATION_MODE = 2;
goog.events.listenerCountEstimate_ = 0;
goog.events.listen = function(a, b, c, d, e) {
	if (goog.isArray(b)) {
		for (var f = 0; f < b.length; f++) goog.events.listen(a, b[f], c, d, e);
		return null
	}
	c = goog.events.wrapListener(c);
	return goog.events.Listenable.isImplementedBy(a) ? a.listen(b, c, d, e) : goog.events.listen_(a, b, c, !1, d, e)
};
goog.events.listen_ = function(a, b, c, d, e, f) {
	if (!b) throw Error("Invalid event type");
	var g = !!e;
	if (g && !goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
		if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_FAIL) return goog.asserts.fail("Can not register capture listener in IE8-."), null;
		if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_SILENT) return null
	}
	var h = goog.events.getListenerMap_(a);
	h || (a[goog.events.LISTENER_MAP_PROP_] = h = new goog.events.ListenerMap(a));
	c = h.add(b, c, d, e, f);
	if (c.proxy) return c;
	d = goog.events.getProxy();
	c.proxy = d;
	d.src = a;
	d.listener = c;
	a.addEventListener ? a.addEventListener(b.toString(), d, g) : a.attachEvent(goog.events.getOnString_(b.toString()), d);
	goog.events.listenerCountEstimate_++;
	return c
};
goog.events.getProxy = function() {
	var a = goog.events.handleBrowserEvent_,
		b = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(c) {
			return a.call(b.src, b.listener, c)
		} : function(c) {
			c = a.call(b.src, b.listener, c);
			if (!c) return c
		};
	return b
};
goog.events.listenOnce = function(a, b, c, d, e) {
	if (goog.isArray(b)) {
		for (var f = 0; f < b.length; f++) goog.events.listenOnce(a, b[f], c, d, e);
		return null
	}
	c = goog.events.wrapListener(c);
	return goog.events.Listenable.isImplementedBy(a) ? a.listenOnce(b, c, d, e) : goog.events.listen_(a, b, c, !0, d, e)
};
goog.events.listenWithWrapper = function(a, b, c, d, e) {
	b.listen(a, c, d, e)
};
goog.events.unlisten = function(a, b, c, d, e) {
	if (goog.isArray(b)) {
		for (var f = 0; f < b.length; f++) goog.events.unlisten(a, b[f], c, d, e);
		return null
	}
	c = goog.events.wrapListener(c);
	if (goog.events.Listenable.isImplementedBy(a)) return a.unlisten(b, c, d, e);
	if (!a) return !1;
	d = !!d;
	if (a = goog.events.getListenerMap_(a))
		if (b = a.getListener(b, c, d, e)) return goog.events.unlistenByKey(b);
	return !1
};
goog.events.unlistenByKey = function(a) {
	if (goog.isNumber(a) || !a || a.removed) return !1;
	var b = a.src;
	if (goog.events.Listenable.isImplementedBy(b)) return b.unlistenByKey(a);
	var c = a.type,
		d = a.proxy;
	b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent && b.detachEvent(goog.events.getOnString_(c), d);
	goog.events.listenerCountEstimate_--;
	(c = goog.events.getListenerMap_(b)) ? (c.removeByKey(a), 0 == c.getTypeCount() && (c.src = null, b[goog.events.LISTENER_MAP_PROP_] = null)) : a.markAsRemoved();
	return !0
};
goog.events.unlistenWithWrapper = function(a, b, c, d, e) {
	b.unlisten(a, c, d, e)
};
goog.events.removeAll = function(a, b) {
	if (!a) return 0;
	if (goog.events.Listenable.isImplementedBy(a)) return a.removeAllListeners(b);
	var c = goog.events.getListenerMap_(a);
	if (!c) return 0;
	var d = 0,
		e = b && b.toString(),
		f;
	for (f in c.listeners)
		if (!e || f == e)
			for (var g = c.listeners[f].concat(), h = 0; h < g.length; ++h) goog.events.unlistenByKey(g[h]) && ++d;
	return d
};
goog.events.removeAllNativeListeners = function() {
	return goog.events.listenerCountEstimate_ = 0
};
goog.events.getListeners = function(a, b, c) {
	return goog.events.Listenable.isImplementedBy(a) ? a.getListeners(b, c) : a ? (a = goog.events.getListenerMap_(a)) ? a.getListeners(b, c) : [] : []
};
goog.events.getListener = function(a, b, c, d, e) {
	c = goog.events.wrapListener(c);
	d = !!d;
	return goog.events.Listenable.isImplementedBy(a) ? a.getListener(b, c, d, e) : a ? (a = goog.events.getListenerMap_(a)) ? a.getListener(b, c, d, e) : null : null
};
goog.events.hasListener = function(a, b, c) {
	if (goog.events.Listenable.isImplementedBy(a)) return a.hasListener(b, c);
	a = goog.events.getListenerMap_(a);
	return !!a && a.hasListener(b, c)
};
goog.events.expose = function(a) {
	var b = [],
		c;
	for (c in a) a[c] && a[c].id ? b.push(c + " = " + a[c] + " (" + a[c].id + ")") : b.push(c + " = " + a[c]);
	return b.join("\n")
};
goog.events.getOnString_ = function(a) {
	return a in goog.events.onStringMap_ ? goog.events.onStringMap_[a] : goog.events.onStringMap_[a] = goog.events.onString_ + a
};
goog.events.fireListeners = function(a, b, c, d) {
	return goog.events.Listenable.isImplementedBy(a) ? a.fireListeners(b, c, d) : goog.events.fireListeners_(a, b, c, d)
};
goog.events.fireListeners_ = function(a, b, c, d) {
	var e = 1;
	if (a = goog.events.getListenerMap_(a))
		if (b = a.listeners[b.toString()])
			for (b = b.concat(), a = 0; a < b.length; a++) {
				var f = b[a];
				f && f.capture == c && !f.removed && (e &= !1 !== goog.events.fireListener(f, d))
			}
		return Boolean(e)
};
goog.events.fireListener = function(a, b) {
	var c = a.listener,
		d = a.handler || a.src;
	a.callOnce && goog.events.unlistenByKey(a);
	return c.call(d, b)
};
goog.events.getTotalListenerCount = function() {
	return goog.events.listenerCountEstimate_
};
goog.events.dispatchEvent = function(a, b) {
	goog.asserts.assert(goog.events.Listenable.isImplementedBy(a), "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance.");
	return a.dispatchEvent(b)
};
goog.events.protectBrowserEventEntryPoint = function(a) {
	goog.events.handleBrowserEvent_ = a.protectEntryPoint(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function(a, b) {
	if (a.removed) return !0;
	if (!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
		var c = b || goog.getObjectByName("window.event"),
			d = new goog.events.BrowserEvent(c, this),
			e = !0;
		if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.ON) {
			if (!goog.events.isMarkedIeEvent_(c)) {
				goog.events.markIeEvent_(c);
				for (var c = [], f = d.currentTarget; f; f = f.parentNode) c.push(f);
				for (var f = a.type, g = c.length - 1; !d.propagationStopped_ && 0 <= g; g--) d.currentTarget = c[g], e &= goog.events.fireListeners_(c[g],
					f, !0, d);
				for (g = 0; !d.propagationStopped_ && g < c.length; g++) d.currentTarget = c[g], e &= goog.events.fireListeners_(c[g], f, !1, d)
			}
		} else e = goog.events.fireListener(a, d);
		return e
	}
	return goog.events.fireListener(a, new goog.events.BrowserEvent(b, this))
};
goog.events.markIeEvent_ = function(a) {
	var b = !1;
	if (0 == a.keyCode) try {
		a.keyCode = -1;
		return
	} catch (c) {
		b = !0
	}
	if (b || void 0 == a.returnValue) a.returnValue = !0
};
goog.events.isMarkedIeEvent_ = function(a) {
	return 0 > a.keyCode || void 0 != a.returnValue
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(a) {
	return a + "_" + goog.events.uniqueIdCounter_++
};
goog.events.getListenerMap_ = function(a) {
	a = a[goog.events.LISTENER_MAP_PROP_];
	return a instanceof goog.events.ListenerMap ? a : null
};
goog.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
goog.events.wrapListener = function(a) {
	goog.asserts.assert(a, "Listener can not be null.");
	if (goog.isFunction(a)) return a;
	goog.asserts.assert(a.handleEvent, "An object listener must have handleEvent method.");
	a[goog.events.LISTENER_WRAPPER_PROP_] || (a[goog.events.LISTENER_WRAPPER_PROP_] = function(b) {
		return a.handleEvent(b)
	});
	return a[goog.events.LISTENER_WRAPPER_PROP_]
};
goog.debug.entryPointRegistry.register(function(a) {
	goog.events.handleBrowserEvent_ = a(goog.events.handleBrowserEvent_)
});
goog.events.EventHandler = function(a) {
	goog.Disposable.call(this);
	this.handler_ = a;
	this.keys_ = {}
};
goog.inherits(goog.events.EventHandler, goog.Disposable);
goog.events.EventHandler.typeArray_ = [];
goog.events.EventHandler.prototype.listen = function(a, b, c, d) {
	return this.listen_(a, b, c, d)
};
goog.events.EventHandler.prototype.listenWithScope = function(a, b, c, d, e) {
	return this.listen_(a, b, c, d, e)
};
goog.events.EventHandler.prototype.listen_ = function(a, b, c, d, e) {
	goog.isArray(b) || (b && (goog.events.EventHandler.typeArray_[0] = b.toString()), b = goog.events.EventHandler.typeArray_);
	for (var f = 0; f < b.length; f++) {
		var g = goog.events.listen(a, b[f], c || this.handleEvent, d || !1, e || this.handler_ || this);
		if (!g) break;
		this.keys_[g.key] = g
	}
	return this
};
goog.events.EventHandler.prototype.listenOnce = function(a, b, c, d) {
	return this.listenOnce_(a, b, c, d)
};
goog.events.EventHandler.prototype.listenOnceWithScope = function(a, b, c, d, e) {
	return this.listenOnce_(a, b, c, d, e)
};
goog.events.EventHandler.prototype.listenOnce_ = function(a, b, c, d, e) {
	if (goog.isArray(b))
		for (var f = 0; f < b.length; f++) this.listenOnce_(a, b[f], c, d, e);
	else {
		a = goog.events.listenOnce(a, b, c || this.handleEvent, d, e || this.handler_ || this);
		if (!a) return this;
		this.keys_[a.key] = a
	}
	return this
};
goog.events.EventHandler.prototype.listenWithWrapper = function(a, b, c, d) {
	return this.listenWithWrapper_(a, b, c, d)
};
goog.events.EventHandler.prototype.listenWithWrapperAndScope = function(a, b, c, d, e) {
	return this.listenWithWrapper_(a, b, c, d, e)
};
goog.events.EventHandler.prototype.listenWithWrapper_ = function(a, b, c, d, e) {
	b.listen(a, c, d, e || this.handler_ || this, this);
	return this
};
goog.events.EventHandler.prototype.getListenerCount = function() {
	var a = 0,
		b;
	for (b in this.keys_) Object.prototype.hasOwnProperty.call(this.keys_, b) && a++;
	return a
};
goog.events.EventHandler.prototype.unlisten = function(a, b, c, d, e) {
	if (goog.isArray(b))
		for (var f = 0; f < b.length; f++) this.unlisten(a, b[f], c, d, e);
	else if (a = goog.events.getListener(a, b, c || this.handleEvent, d, e || this.handler_ || this)) goog.events.unlistenByKey(a), delete this.keys_[a.key];
	return this
};
goog.events.EventHandler.prototype.unlistenWithWrapper = function(a, b, c, d, e) {
	b.unlisten(a, c, d, e || this.handler_ || this, this);
	return this
};
goog.events.EventHandler.prototype.removeAll = function() {
	goog.object.forEach(this.keys_, goog.events.unlistenByKey);
	this.keys_ = {}
};
goog.events.EventHandler.prototype.disposeInternal = function() {
	goog.events.EventHandler.superClass_.disposeInternal.call(this);
	this.removeAll()
};
goog.events.EventHandler.prototype.handleEvent = function(a) {
	throw Error("EventHandler.handleEvent not implemented");
};
goog.events.EventTarget = function() {
	goog.Disposable.call(this);
	this.eventTargetListeners_ = new goog.events.ListenerMap(this);
	this.actualEventTarget_ = this;
	this.parentEventTarget_ = null
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.Listenable.addImplementation(goog.events.EventTarget);
goog.events.EventTarget.MAX_ANCESTORS_ = 1E3;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
	return this.parentEventTarget_
};
goog.events.EventTarget.prototype.setParentEventTarget = function(a) {
	this.parentEventTarget_ = a
};
goog.events.EventTarget.prototype.addEventListener = function(a, b, c, d) {
	goog.events.listen(this, a, b, c, d)
};
goog.events.EventTarget.prototype.removeEventListener = function(a, b, c, d) {
	goog.events.unlisten(this, a, b, c, d)
};
goog.events.EventTarget.prototype.dispatchEvent = function(a) {
	this.assertInitialized_();
	var b, c = this.getParentEventTarget();
	if (c) {
		b = [];
		for (var d = 1; c; c = c.getParentEventTarget()) b.push(c), goog.asserts.assert(++d < goog.events.EventTarget.MAX_ANCESTORS_, "infinite loop")
	}
	return goog.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, a, b)
};
goog.events.EventTarget.prototype.disposeInternal = function() {
	goog.events.EventTarget.superClass_.disposeInternal.call(this);
	this.removeAllListeners();
	this.parentEventTarget_ = null
};
goog.events.EventTarget.prototype.listen = function(a, b, c, d) {
	this.assertInitialized_();
	return this.eventTargetListeners_.add(String(a), b, !1, c, d)
};
goog.events.EventTarget.prototype.listenOnce = function(a, b, c, d) {
	return this.eventTargetListeners_.add(String(a), b, !0, c, d)
};
goog.events.EventTarget.prototype.unlisten = function(a, b, c, d) {
	return this.eventTargetListeners_.remove(String(a), b, c, d)
};
goog.events.EventTarget.prototype.unlistenByKey = function(a) {
	return this.eventTargetListeners_.removeByKey(a)
};
goog.events.EventTarget.prototype.removeAllListeners = function(a) {
	return this.eventTargetListeners_ ? this.eventTargetListeners_.removeAll(a) : 0
};
goog.events.EventTarget.prototype.fireListeners = function(a, b, c) {
	a = this.eventTargetListeners_.listeners[String(a)];
	if (!a) return !0;
	a = a.concat();
	for (var d = !0, e = 0; e < a.length; ++e) {
		var f = a[e];
		if (f && !f.removed && f.capture == b) {
			var g = f.listener,
				h = f.handler || f.src;
			f.callOnce && this.unlistenByKey(f);
			d = !1 !== g.call(h, c) && d
		}
	}
	return d && 0 != c.returnValue_
};
goog.events.EventTarget.prototype.getListeners = function(a, b) {
	return this.eventTargetListeners_.getListeners(String(a), b)
};
goog.events.EventTarget.prototype.getListener = function(a, b, c, d) {
	return this.eventTargetListeners_.getListener(String(a), b, c, d)
};
goog.events.EventTarget.prototype.hasListener = function(a, b) {
	var c = goog.isDef(a) ? String(a) : void 0;
	return this.eventTargetListeners_.hasListener(c, b)
};
goog.events.EventTarget.prototype.setTargetForTesting = function(a) {
	this.actualEventTarget_ = a
};
goog.events.EventTarget.prototype.assertInitialized_ = function() {
	goog.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?")
};
goog.events.EventTarget.dispatchEventInternal_ = function(a, b, c) {
	var d = b.type || b;
	if (goog.isString(b)) b = new goog.events.Event(b, a);
	else if (b instanceof goog.events.Event) b.target = b.target || a;
	else {
		var e = b;
		b = new goog.events.Event(d, a);
		goog.object.extend(b, e)
	}
	var e = !0,
		f;
	if (c)
		for (var g = c.length - 1; !b.propagationStopped_ && 0 <= g; g--) f = b.currentTarget = c[g], e = f.fireListeners(d, !0, b) && e;
	b.propagationStopped_ || (f = b.currentTarget = a, e = f.fireListeners(d, !0, b) && e, b.propagationStopped_ || (e = f.fireListeners(d, !1, b) && e));
	if (c)
		for (g = 0; !b.propagationStopped_ && g < c.length; g++) f = b.currentTarget = c[g], e = f.fireListeners(d, !1, b) && e;
	return e
};
goog.ui.Component = function(a) {
	goog.events.EventTarget.call(this);
	this.dom_ = a || goog.dom.getDomHelper();
	this.rightToLeft_ = goog.ui.Component.defaultRightToLeft_;
	this.id_ = null;
	this.inDocument_ = !1;
	this.element_ = null;
	this.googUiComponentHandler_ = void 0;
	this.childIndex_ = this.children_ = this.parent_ = this.model_ = null;
	this.wasDecorated_ = !1
};
goog.inherits(goog.ui.Component, goog.events.EventTarget);
goog.ui.Component.ALLOW_DETACHED_DECORATION = !1;
goog.ui.Component.prototype.idGenerator_ = goog.ui.IdGenerator.getInstance();
goog.ui.Component.DEFAULT_BIDI_DIR = 0;
goog.ui.Component.defaultRightToLeft_ = 1 == goog.ui.Component.DEFAULT_BIDI_DIR ? !1 : -1 == goog.ui.Component.DEFAULT_BIDI_DIR ? !0 : null;
goog.ui.Component.EventType = {
	BEFORE_SHOW: "beforeshow",
	SHOW: "show",
	HIDE: "hide",
	DISABLE: "disable",
	ENABLE: "enable",
	HIGHLIGHT: "highlight",
	UNHIGHLIGHT: "unhighlight",
	ACTIVATE: "activate",
	DEACTIVATE: "deactivate",
	SELECT: "select",
	UNSELECT: "unselect",
	CHECK: "check",
	UNCHECK: "uncheck",
	FOCUS: "focus",
	BLUR: "blur",
	OPEN: "open",
	CLOSE: "close",
	ENTER: "enter",
	LEAVE: "leave",
	ACTION: "action",
	CHANGE: "change"
};
goog.ui.Component.Error = {
	NOT_SUPPORTED: "Method not supported",
	DECORATE_INVALID: "Invalid element to decorate",
	ALREADY_RENDERED: "Component already rendered",
	PARENT_UNABLE_TO_BE_SET: "Unable to set parent component",
	CHILD_INDEX_OUT_OF_BOUNDS: "Child component index out of bounds",
	NOT_OUR_CHILD: "Child is not in parent component",
	NOT_IN_DOCUMENT: "Operation not supported while component is not in document",
	STATE_INVALID: "Invalid component state"
};
goog.ui.Component.State = {
	ALL: 255,
	DISABLED: 1,
	HOVER: 2,
	ACTIVE: 4,
	SELECTED: 8,
	CHECKED: 16,
	FOCUSED: 32,
	OPENED: 64
};
goog.ui.Component.getStateTransitionEvent = function(a, b) {
	switch (a) {
		case goog.ui.Component.State.DISABLED:
			return b ? goog.ui.Component.EventType.DISABLE : goog.ui.Component.EventType.ENABLE;
		case goog.ui.Component.State.HOVER:
			return b ? goog.ui.Component.EventType.HIGHLIGHT : goog.ui.Component.EventType.UNHIGHLIGHT;
		case goog.ui.Component.State.ACTIVE:
			return b ? goog.ui.Component.EventType.ACTIVATE : goog.ui.Component.EventType.DEACTIVATE;
		case goog.ui.Component.State.SELECTED:
			return b ? goog.ui.Component.EventType.SELECT :
				goog.ui.Component.EventType.UNSELECT;
		case goog.ui.Component.State.CHECKED:
			return b ? goog.ui.Component.EventType.CHECK : goog.ui.Component.EventType.UNCHECK;
		case goog.ui.Component.State.FOCUSED:
			return b ? goog.ui.Component.EventType.FOCUS : goog.ui.Component.EventType.BLUR;
		case goog.ui.Component.State.OPENED:
			return b ? goog.ui.Component.EventType.OPEN : goog.ui.Component.EventType.CLOSE
	}
	throw Error(goog.ui.Component.Error.STATE_INVALID);
};
goog.ui.Component.setDefaultRightToLeft = function(a) {
	goog.ui.Component.defaultRightToLeft_ = a
};
goog.ui.Component.prototype.getId = function() {
	return this.id_ || (this.id_ = this.idGenerator_.getNextUniqueId())
};
goog.ui.Component.prototype.setId = function(a) {
	this.parent_ && this.parent_.childIndex_ && (goog.object.remove(this.parent_.childIndex_, this.id_), goog.object.add(this.parent_.childIndex_, a, this));
	this.id_ = a
};
goog.ui.Component.prototype.getElement = function() {
	return this.element_
};
goog.ui.Component.prototype.getElementStrict = function() {
	var a = this.element_;
	goog.asserts.assert(a, "Can not call getElementStrict before rendering/decorating.");
	return a
};
goog.ui.Component.prototype.setElementInternal = function(a) {
	this.element_ = a
};
goog.ui.Component.prototype.getElementsByClass = function(a) {
	return this.element_ ? this.dom_.getElementsByClass(a, this.element_) : []
};
goog.ui.Component.prototype.getElementByClass = function(a) {
	return this.element_ ? this.dom_.getElementByClass(a, this.element_) : null
};
goog.ui.Component.prototype.getRequiredElementByClass = function(a) {
	var b = this.getElementByClass(a);
	goog.asserts.assert(b, "Expected element in component with class: %s", a);
	return b
};
goog.ui.Component.prototype.getHandler = function() {
	this.googUiComponentHandler_ || (this.googUiComponentHandler_ = new goog.events.EventHandler(this));
	return this.googUiComponentHandler_
};
goog.ui.Component.prototype.setParent = function(a) {
	if (this == a) throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
	if (a && this.parent_ && this.id_ && this.parent_.getChild(this.id_) && this.parent_ != a) throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
	this.parent_ = a;
	goog.ui.Component.superClass_.setParentEventTarget.call(this, a)
};
goog.ui.Component.prototype.getParent = function() {
	return this.parent_
};
goog.ui.Component.prototype.setParentEventTarget = function(a) {
	if (this.parent_ && this.parent_ != a) throw Error(goog.ui.Component.Error.NOT_SUPPORTED);
	goog.ui.Component.superClass_.setParentEventTarget.call(this, a)
};
goog.ui.Component.prototype.getDomHelper = function() {
	return this.dom_
};
goog.ui.Component.prototype.isInDocument = function() {
	return this.inDocument_
};
goog.ui.Component.prototype.createDom = function() {
	this.element_ = this.dom_.createElement("div")
};
goog.ui.Component.prototype.render = function(a) {
	this.render_(a)
};
goog.ui.Component.prototype.renderBefore = function(a) {
	this.render_(a.parentNode, a)
};
goog.ui.Component.prototype.render_ = function(a, b) {
	if (this.inDocument_) throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
	this.element_ || this.createDom();
	a ? a.insertBefore(this.element_, b || null) : this.dom_.getDocument().body.appendChild(this.element_);
	this.parent_ && !this.parent_.isInDocument() || this.enterDocument()
};
goog.ui.Component.prototype.decorate = function(a) {
	if (this.inDocument_) throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
	if (a && this.canDecorate(a)) {
		this.wasDecorated_ = !0;
		var b = goog.dom.getOwnerDocument(a);
		this.dom_ && this.dom_.getDocument() == b || (this.dom_ = goog.dom.getDomHelper(a));
		this.decorateInternal(a);
		goog.ui.Component.ALLOW_DETACHED_DECORATION && !goog.dom.contains(b, a) || this.enterDocument()
	} else throw Error(goog.ui.Component.Error.DECORATE_INVALID);
};
goog.ui.Component.prototype.canDecorate = function(a) {
	return !0
};
goog.ui.Component.prototype.wasDecorated = function() {
	return this.wasDecorated_
};
goog.ui.Component.prototype.decorateInternal = function(a) {
	this.element_ = a
};
goog.ui.Component.prototype.enterDocument = function() {
	this.inDocument_ = !0;
	this.forEachChild(function(a) {
		!a.isInDocument() && a.getElement() && a.enterDocument()
	})
};
goog.ui.Component.prototype.exitDocument = function() {
	this.forEachChild(function(a) {
		a.isInDocument() && a.exitDocument()
	});
	this.googUiComponentHandler_ && this.googUiComponentHandler_.removeAll();
	this.inDocument_ = !1
};
goog.ui.Component.prototype.disposeInternal = function() {
	this.inDocument_ && this.exitDocument();
	this.googUiComponentHandler_ && (this.googUiComponentHandler_.dispose(), delete this.googUiComponentHandler_);
	this.forEachChild(function(a) {
		a.dispose()
	});
	!this.wasDecorated_ && this.element_ && goog.dom.removeNode(this.element_);
	this.parent_ = this.model_ = this.element_ = this.childIndex_ = this.children_ = null;
	goog.ui.Component.superClass_.disposeInternal.call(this)
};
goog.ui.Component.prototype.makeId = function(a) {
	return this.getId() + "." + a
};
goog.ui.Component.prototype.makeIds = function(a) {
	var b = {},
		c;
	for (c in a) b[c] = this.makeId(a[c]);
	return b
};
goog.ui.Component.prototype.getModel = function() {
	return this.model_
};
goog.ui.Component.prototype.setModel = function(a) {
	this.model_ = a
};
goog.ui.Component.prototype.getFragmentFromId = function(a) {
	return a.substring(this.getId().length + 1)
};
goog.ui.Component.prototype.getElementByFragment = function(a) {
	if (!this.inDocument_) throw Error(goog.ui.Component.Error.NOT_IN_DOCUMENT);
	return this.dom_.getElement(this.makeId(a))
};
goog.ui.Component.prototype.addChild = function(a, b) {
	this.addChildAt(a, this.getChildCount(), b)
};
goog.ui.Component.prototype.addChildAt = function(a, b, c) {
	goog.asserts.assert(!!a, "Provided element must not be null.");
	if (a.inDocument_ && (c || !this.inDocument_)) throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
	if (0 > b || b > this.getChildCount()) throw Error(goog.ui.Component.Error.CHILD_INDEX_OUT_OF_BOUNDS);
	this.childIndex_ && this.children_ || (this.childIndex_ = {}, this.children_ = []);
	a.getParent() == this ? (goog.object.set(this.childIndex_, a.getId(), a), goog.array.remove(this.children_, a)) : goog.object.add(this.childIndex_,
		a.getId(), a);
	a.setParent(this);
	goog.array.insertAt(this.children_, a, b);
	a.inDocument_ && this.inDocument_ && a.getParent() == this ? (c = this.getContentElement(), c.insertBefore(a.getElement(), c.childNodes[b] || null)) : c ? (this.element_ || this.createDom(), b = this.getChildAt(b + 1), a.render_(this.getContentElement(), b ? b.element_ : null)) : this.inDocument_ && !a.inDocument_ && a.element_ && a.element_.parentNode && a.element_.parentNode.nodeType == goog.dom.NodeType.ELEMENT && a.enterDocument()
};
goog.ui.Component.prototype.getContentElement = function() {
	return this.element_
};
goog.ui.Component.prototype.isRightToLeft = function() {
	null == this.rightToLeft_ && (this.rightToLeft_ = goog.style.isRightToLeft(this.inDocument_ ? this.element_ : this.dom_.getDocument().body));
	return this.rightToLeft_
};
goog.ui.Component.prototype.setRightToLeft = function(a) {
	if (this.inDocument_) throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
	this.rightToLeft_ = a
};
goog.ui.Component.prototype.hasChildren = function() {
	return !!this.children_ && 0 != this.children_.length
};
goog.ui.Component.prototype.getChildCount = function() {
	return this.children_ ? this.children_.length : 0
};
goog.ui.Component.prototype.getChildIds = function() {
	var a = [];
	this.forEachChild(function(b) {
		a.push(b.getId())
	});
	return a
};
goog.ui.Component.prototype.getChild = function(a) {
	return this.childIndex_ && a ? goog.object.get(this.childIndex_, a) || null : null
};
goog.ui.Component.prototype.getChildAt = function(a) {
	return this.children_ ? this.children_[a] || null : null
};
goog.ui.Component.prototype.forEachChild = function(a, b) {
	this.children_ && goog.array.forEach(this.children_, a, b)
};
goog.ui.Component.prototype.indexOfChild = function(a) {
	return this.children_ && a ? goog.array.indexOf(this.children_, a) : -1
};
goog.ui.Component.prototype.removeChild = function(a, b) {
	if (a) {
		var c = goog.isString(a) ? a : a.getId();
		a = this.getChild(c);
		c && a && (goog.object.remove(this.childIndex_, c), goog.array.remove(this.children_, a), b && (a.exitDocument(), a.element_ && goog.dom.removeNode(a.element_)), a.setParent(null))
	}
	if (!a) throw Error(goog.ui.Component.Error.NOT_OUR_CHILD);
	return a
};
goog.ui.Component.prototype.removeChildAt = function(a, b) {
	return this.removeChild(this.getChildAt(a), b)
};
goog.ui.Component.prototype.removeChildren = function(a) {
	for (var b = []; this.hasChildren();) b.push(this.removeChildAt(0, a));
	return b
};
qp.ui = {};
qp.ui.Initializer = function() {
	this.data_ = qp.Data.getInstance();
	"loading" === document.readyState ? goog.events.listenOnce(document, goog.events.EventType.READYSTATECHANGE, this.init_, !1, this) : this.init_()
};
goog.addSingletonGetter(qp.ui.Initializer);
goog.exportSymbol("qp.ui", qp.ui);
goog.exportSymbol("qp.ui.Initializer", qp.ui.Initializer);
qp.ui.Initializer.UI_CLASS = "qp-ui";
qp.ui.Initializer.UI_ATTRIBUTE = "data-qp-ui";
qp.ui.Initializer.prototype.init_ = function() {
	var a = this.findUIElements_(document);
	this.initializeUIElements_(a)
};
qp.ui.Initializer.prototype.findUIElements_ = function(a) {
	return goog.dom.getElementsByClass(qp.ui.Initializer.UI_CLASS, a)
};
qp.ui.Initializer.prototype.parseUI_ = function(a) {
	return JSON.parse(a.replace(/'/g, '"'))
};
qp.ui.Initializer.prototype.initializeUIElements_ = function(a) {
	for (var b = 0, c = a.length; b < c; ++b) this.initializeUIElement_(a[b])
};
qp.ui.Initializer.prototype.initializeUIElement_ = function(a) {
	var b = a.getAttribute(qp.ui.Initializer.UI_ATTRIBUTE),
		b = b ? this.parseUI_(b) : {},
		c;
	for (c in b) b.hasOwnProperty(c) && this.instantiateUI_(a, c, b[c])
};
qp.ui.Initializer.prototype.instantiateUI_ = function(a, b, c) {
	if (qp.ui.hasOwnProperty(b)) {
		var d = this.data_.get(a, b);
		d || (d = qp.ui[b], d = goog.isFunction(d.getInstance) ? d.getInstance() : new d(a, c), this.data_.set(a, b, d))
	}
};
qp.ui.Widget = function(a, b) {
	this.config_ = {};
	goog.object.extend(this.config_, this.constructor && this.constructor.defaults || {}, b || {});
	goog.ui.Component.call(this, this.config_.domHelper);
	this.decorate(a)
};
goog.inherits(qp.ui.Widget, goog.ui.Component);
goog.exportSymbol("qp.ui.Widget", qp.ui.Widget);
qp.ui.Widget.UI_CLASS = "qp-ui-widget";
goog.exportProperty(qp.ui.Widget, "UI_CLASS", qp.ui.Widget.UI_CLASS);
qp.ui.Widget.defaults = {};
goog.exportProperty(qp.ui.Widget, "defaults", qp.ui.Widget.defaults);
qp.ui.Widget.prototype.decorateInternal = function(a) {
	qp.ui.Widget.superClass_.decorateInternal.call(this, a);
	(a = (this.constructor || this.__proto__.constructor).UI_CLASS) && goog.dom.classes.add(this.element_, a)
};
goog.events.KeyCodes = {
	WIN_KEY_FF_LINUX: 0,
	MAC_ENTER: 3,
	BACKSPACE: 8,
	TAB: 9,
	NUM_CENTER: 12,
	ENTER: 13,
	SHIFT: 16,
	CTRL: 17,
	ALT: 18,
	PAUSE: 19,
	CAPS_LOCK: 20,
	ESC: 27,
	SPACE: 32,
	PAGE_UP: 33,
	PAGE_DOWN: 34,
	END: 35,
	HOME: 36,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	PRINT_SCREEN: 44,
	INSERT: 45,
	DELETE: 46,
	ZERO: 48,
	ONE: 49,
	TWO: 50,
	THREE: 51,
	FOUR: 52,
	FIVE: 53,
	SIX: 54,
	SEVEN: 55,
	EIGHT: 56,
	NINE: 57,
	FF_SEMICOLON: 59,
	FF_EQUALS: 61,
	FF_DASH: 173,
	QUESTION_MARK: 63,
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,
	META: 91,
	WIN_KEY_RIGHT: 92,
	CONTEXT_MENU: 93,
	NUM_ZERO: 96,
	NUM_ONE: 97,
	NUM_TWO: 98,
	NUM_THREE: 99,
	NUM_FOUR: 100,
	NUM_FIVE: 101,
	NUM_SIX: 102,
	NUM_SEVEN: 103,
	NUM_EIGHT: 104,
	NUM_NINE: 105,
	NUM_MULTIPLY: 106,
	NUM_PLUS: 107,
	NUM_MINUS: 109,
	NUM_PERIOD: 110,
	NUM_DIVISION: 111,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	NUMLOCK: 144,
	SCROLL_LOCK: 145,
	FIRST_MEDIA_KEY: 166,
	LAST_MEDIA_KEY: 183,
	SEMICOLON: 186,
	DASH: 189,
	EQUALS: 187,
	COMMA: 188,
	PERIOD: 190,
	SLASH: 191,
	APOSTROPHE: 192,
	TILDE: 192,
	SINGLE_QUOTE: 222,
	OPEN_SQUARE_BRACKET: 219,
	BACKSLASH: 220,
	CLOSE_SQUARE_BRACKET: 221,
	WIN_KEY: 224,
	MAC_FF_META: 224,
	MAC_WK_CMD_LEFT: 91,
	MAC_WK_CMD_RIGHT: 93,
	WIN_IME: 229,
	PHANTOM: 255
};
goog.events.KeyCodes.isTextModifyingKeyEvent = function(a) {
	if (a.altKey && !a.ctrlKey || a.metaKey || a.keyCode >= goog.events.KeyCodes.F1 && a.keyCode <= goog.events.KeyCodes.F12) return !1;
	switch (a.keyCode) {
		case goog.events.KeyCodes.ALT:
		case goog.events.KeyCodes.CAPS_LOCK:
		case goog.events.KeyCodes.CONTEXT_MENU:
		case goog.events.KeyCodes.CTRL:
		case goog.events.KeyCodes.DOWN:
		case goog.events.KeyCodes.END:
		case goog.events.KeyCodes.ESC:
		case goog.events.KeyCodes.HOME:
		case goog.events.KeyCodes.INSERT:
		case goog.events.KeyCodes.LEFT:
		case goog.events.KeyCodes.MAC_FF_META:
		case goog.events.KeyCodes.META:
		case goog.events.KeyCodes.NUMLOCK:
		case goog.events.KeyCodes.NUM_CENTER:
		case goog.events.KeyCodes.PAGE_DOWN:
		case goog.events.KeyCodes.PAGE_UP:
		case goog.events.KeyCodes.PAUSE:
		case goog.events.KeyCodes.PHANTOM:
		case goog.events.KeyCodes.PRINT_SCREEN:
		case goog.events.KeyCodes.RIGHT:
		case goog.events.KeyCodes.SCROLL_LOCK:
		case goog.events.KeyCodes.SHIFT:
		case goog.events.KeyCodes.UP:
		case goog.events.KeyCodes.WIN_KEY:
		case goog.events.KeyCodes.WIN_KEY_RIGHT:
			return !1;
		case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
			return !goog.userAgent.GECKO;
		default:
			return a.keyCode < goog.events.KeyCodes.FIRST_MEDIA_KEY || a.keyCode > goog.events.KeyCodes.LAST_MEDIA_KEY
	}
};
goog.events.KeyCodes.firesKeyPressEvent = function(a, b, c, d, e) {
	if (!(goog.userAgent.IE || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("525"))) return !0;
	if (goog.userAgent.MAC && e) return goog.events.KeyCodes.isCharacterKey(a);
	if (e && !d) return !1;
	goog.isNumber(b) && (b = goog.events.KeyCodes.normalizeKeyCode(b));
	if (!c && (b == goog.events.KeyCodes.CTRL || b == goog.events.KeyCodes.ALT || goog.userAgent.MAC && b == goog.events.KeyCodes.META)) return !1;
	if (goog.userAgent.WEBKIT && d && c) switch (a) {
		case goog.events.KeyCodes.BACKSLASH:
		case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
		case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
		case goog.events.KeyCodes.TILDE:
		case goog.events.KeyCodes.SEMICOLON:
		case goog.events.KeyCodes.DASH:
		case goog.events.KeyCodes.EQUALS:
		case goog.events.KeyCodes.COMMA:
		case goog.events.KeyCodes.PERIOD:
		case goog.events.KeyCodes.SLASH:
		case goog.events.KeyCodes.APOSTROPHE:
		case goog.events.KeyCodes.SINGLE_QUOTE:
			return !1
	}
	if (goog.userAgent.IE &&
		d && b == a) return !1;
	switch (a) {
		case goog.events.KeyCodes.ENTER:
			return !0;
		case goog.events.KeyCodes.ESC:
			return !goog.userAgent.WEBKIT
	}
	return goog.events.KeyCodes.isCharacterKey(a)
};
goog.events.KeyCodes.isCharacterKey = function(a) {
	if (a >= goog.events.KeyCodes.ZERO && a <= goog.events.KeyCodes.NINE || a >= goog.events.KeyCodes.NUM_ZERO && a <= goog.events.KeyCodes.NUM_MULTIPLY || a >= goog.events.KeyCodes.A && a <= goog.events.KeyCodes.Z || goog.userAgent.WEBKIT && 0 == a) return !0;
	switch (a) {
		case goog.events.KeyCodes.SPACE:
		case goog.events.KeyCodes.QUESTION_MARK:
		case goog.events.KeyCodes.NUM_PLUS:
		case goog.events.KeyCodes.NUM_MINUS:
		case goog.events.KeyCodes.NUM_PERIOD:
		case goog.events.KeyCodes.NUM_DIVISION:
		case goog.events.KeyCodes.SEMICOLON:
		case goog.events.KeyCodes.FF_SEMICOLON:
		case goog.events.KeyCodes.DASH:
		case goog.events.KeyCodes.EQUALS:
		case goog.events.KeyCodes.FF_EQUALS:
		case goog.events.KeyCodes.COMMA:
		case goog.events.KeyCodes.PERIOD:
		case goog.events.KeyCodes.SLASH:
		case goog.events.KeyCodes.APOSTROPHE:
		case goog.events.KeyCodes.SINGLE_QUOTE:
		case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
		case goog.events.KeyCodes.BACKSLASH:
		case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
			return !0;
		default:
			return !1
	}
};
goog.events.KeyCodes.normalizeKeyCode = function(a) {
	return goog.userAgent.GECKO ? goog.events.KeyCodes.normalizeGeckoKeyCode(a) : goog.userAgent.MAC && goog.userAgent.WEBKIT ? goog.events.KeyCodes.normalizeMacWebKitKeyCode(a) : a
};
goog.events.KeyCodes.normalizeGeckoKeyCode = function(a) {
	switch (a) {
		case goog.events.KeyCodes.FF_EQUALS:
			return goog.events.KeyCodes.EQUALS;
		case goog.events.KeyCodes.FF_SEMICOLON:
			return goog.events.KeyCodes.SEMICOLON;
		case goog.events.KeyCodes.FF_DASH:
			return goog.events.KeyCodes.DASH;
		case goog.events.KeyCodes.MAC_FF_META:
			return goog.events.KeyCodes.META;
		case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
			return goog.events.KeyCodes.WIN_KEY;
		default:
			return a
	}
};
goog.events.KeyCodes.normalizeMacWebKitKeyCode = function(a) {
	switch (a) {
		case goog.events.KeyCodes.MAC_WK_CMD_RIGHT:
			return goog.events.KeyCodes.META;
		default:
			return a
	}
};
qp.ui.VideoPlayer = function(a) {
	qp.ui.Widget.call(this, a)
};
goog.inherits(qp.ui.VideoPlayer, qp.ui.Widget);
goog.exportSymbol("qp.ui.VideoPlayer", qp.ui.VideoPlayer);
qp.ui.VideoPlayer.UI_CLASS = "qp-ui-video-player";
goog.exportProperty(qp.ui.VideoPlayer, "UI_CLASS", qp.ui.VideoPlayer.UI_CLASS);
qp.ui.VideoPlayer.UI_MOUSE_CLASS = "qp-ui-video-player-mouse";
qp.ui.VideoPlayer.UI_TOUCH_CLASS = "qp-ui-video-player-touch";
qp.ui.VideoPlayer.UI_HOVER_CLASS = "qp-ui-video-player-hover";
qp.ui.VideoPlayer.UI_PLAYING_CLASS = "qp-ui-video-player-playing";
qp.ui.VideoPlayer.EventType = {
	PLAY: "play",
	PAUSE: "pause"
};
qp.ui.VideoPlayer.prototype.decorateInternal = function(a) {
	qp.ui.VideoPlayer.superClass_.decorateInternal.call(this, a);
	this.videoElement_ = a.getElementsByTagName("video")[0];
	goog.events.BrowserFeature.TOUCH_ENABLED ? this.decorateTouch_(a) : this.decorateMouse_(a)
};
qp.ui.VideoPlayer.prototype.decorateTouch_ = function(a) {
	goog.dom.classes.add(this.element_, qp.ui.VideoPlayer.UI_TOUCH_CLASS);
	a = this.videoElement_.width;
	var b = this.videoElement_.height;
	0 != a && 0 != b && (this.element_.style.paddingBottom = b / a * 100 + "%");
	var c = this;
	this.videoElement_.addEventListener("loadedmetadata", function() {
		c.element_.style.paddingBottom = c.videoElement_.videoHeight / c.videoElement_.videoWidth * 100 + "%"
	})
};
qp.ui.VideoPlayer.prototype.decorateMouse_ = function(a) {
	goog.dom.classes.add(this.element_, qp.ui.VideoPlayer.UI_MOUSE_CLASS);
	goog.events.listen(a, goog.events.EventType.CLICK, this.handleClick_, !1, this);
	this.videoElement_.removeAttribute("controls");
	this.videoElement_.setAttribute("tabindex", 0);
	goog.events.listen(a, [goog.events.EventType.MOUSEENTER, goog.events.EventType.MOUSELEAVE], this.handleHover_, !1, this);
	goog.events.listen(this.videoElement_, [goog.events.EventType.FOCUS, goog.events.EventType.BLUR],
		this.handleHover_, !1, this);
	goog.events.listen(this.videoElement_, [qp.ui.VideoPlayer.EventType.PLAY, qp.ui.VideoPlayer.EventType.PAUSE], this.handlePlayPause_, !1, this);
	goog.events.listen(this.videoElement_, goog.events.EventType.KEYUP, this.handleKeyUp_, !1, this)
};
qp.ui.VideoPlayer.prototype.handleHover_ = function(a) {
	goog.dom.classes.enable(this.element_, qp.ui.VideoPlayer.UI_HOVER_CLASS, a.type === goog.events.EventType.MOUSEENTER || a.type === goog.events.EventType.FOCUS)
};
qp.ui.VideoPlayer.prototype.handlePlayPause_ = function(a) {
	a.type === qp.ui.VideoPlayer.EventType.PLAY ? (goog.dom.classes.remove(this.element_, qp.ui.VideoPlayer.UI_HOVER_CLASS), goog.dom.classes.add(this.element_, qp.ui.VideoPlayer.UI_PLAYING_CLASS)) : goog.dom.classes.remove(this.element_, qp.ui.VideoPlayer.UI_PLAYING_CLASS)
};
qp.ui.VideoPlayer.prototype.handleClick_ = function(a) {
	this.toggle()
};
qp.ui.VideoPlayer.prototype.hasChromeVox_ = function() {
	return !!this.getDomHelper().getElementByClass("cvox_indicator_container")
};
qp.ui.VideoPlayer.prototype.handleKeyUp_ = function(a) {
	a = a.keyCode;
	a === goog.events.KeyCodes.ESC && goog.dom.classes.remove(this.element_, qp.ui.VideoPlayer.UI_HOVER_CLASS);
	if (this.hasChromeVox_()) return null;
	switch (a) {
		case goog.events.KeyCodes.ENTER:
		case goog.events.KeyCodes.SPACE:
			this.toggle()
	}
};
qp.ui.VideoPlayer.prototype.play = function() {
	this.videoElement_.play()
};
qp.ui.VideoPlayer.prototype.pause = function() {
	this.videoElement_.pause()
};
qp.ui.VideoPlayer.prototype.toggle = function() {
	this.videoElement_.paused ? this.play() : this.pause()
};
goog.pubsub = {};
goog.pubsub.PubSub = function() {
	goog.Disposable.call(this);
	this.subscriptions_ = [];
	this.topics_ = {}
};
goog.inherits(goog.pubsub.PubSub, goog.Disposable);
goog.pubsub.PubSub.prototype.key_ = 1;
goog.pubsub.PubSub.prototype.publishDepth_ = 0;
goog.pubsub.PubSub.prototype.subscribe = function(a, b, c) {
	var d = this.topics_[a];
	d || (d = this.topics_[a] = []);
	var e = this.key_;
	this.subscriptions_[e] = a;
	this.subscriptions_[e + 1] = b;
	this.subscriptions_[e + 2] = c;
	this.key_ = e + 3;
	d.push(e);
	return e
};
goog.pubsub.PubSub.prototype.subscribeOnce = function(a, b, c) {
	var d = this.subscribe(a, function(a) {
		b.apply(c, arguments);
		this.unsubscribeByKey(d)
	}, this);
	return d
};
goog.pubsub.PubSub.prototype.unsubscribe = function(a, b, c) {
	if (a = this.topics_[a]) {
		var d = this.subscriptions_;
		if (a = goog.array.find(a, function(a) {
				return d[a + 1] == b && d[a + 2] == c
			})) return this.unsubscribeByKey(a)
	}
	return !1
};
goog.pubsub.PubSub.prototype.unsubscribeByKey = function(a) {
	if (0 != this.publishDepth_) return this.pendingKeys_ || (this.pendingKeys_ = []), this.pendingKeys_.push(a), !1;
	var b = this.subscriptions_[a];
	if (b) {
		var c = this.topics_[b];
		c && goog.array.remove(c, a);
		delete this.subscriptions_[a];
		delete this.subscriptions_[a + 1];
		delete this.subscriptions_[a + 2]
	}
	return !!b
};
goog.pubsub.PubSub.prototype.publish = function(a, b) {
	var c = this.topics_[a];
	if (c) {
		this.publishDepth_++;
		for (var d = goog.array.slice(arguments, 1), e = 0, f = c.length; e < f; e++) {
			var g = c[e];
			this.subscriptions_[g + 1].apply(this.subscriptions_[g + 2], d)
		}
		this.publishDepth_--;
		if (this.pendingKeys_ && 0 == this.publishDepth_)
			for (; c = this.pendingKeys_.pop();) this.unsubscribeByKey(c);
		return 0 != e
	}
	return !1
};
goog.pubsub.PubSub.prototype.clear = function(a) {
	if (a) {
		var b = this.topics_[a];
		b && (goog.array.forEach(b, this.unsubscribeByKey, this), delete this.topics_[a])
	} else this.subscriptions_.length = 0, this.topics_ = {}
};
goog.pubsub.PubSub.prototype.getCount = function(a) {
	if (a) {
		var b = this.topics_[a];
		return b ? b.length : 0
	}
	a = 0;
	for (b in this.topics_) a += this.getCount(b);
	return a
};
goog.pubsub.PubSub.prototype.disposeInternal = function() {
	goog.pubsub.PubSub.superClass_.disposeInternal.call(this);
	delete this.subscriptions_;
	delete this.topics_;
	delete this.pendingKeys_
};
qp.PubSub = function() {
	goog.pubsub.PubSub.call(this, goog.pubsub.PubSub)
};
goog.inherits(qp.PubSub, goog.pubsub.PubSub);
goog.addSingletonGetter(qp.PubSub);
goog.exportSymbol("qp.PubSub", qp.PubSub);
qp.ui.Mask = function(a, b) {
	qp.ui.Widget.call(this, a, b);
	this.pubSub_ = qp.PubSub.getInstance();
	this.pubSub_.subscribe(qp.ui.SideNavDrawer.SHOW_EVENT, this.show, this);
	this.pubSub_.subscribe(qp.ui.SideNavDrawer.HIDE_EVENT, this.hide, this)
};
goog.inherits(qp.ui.Mask, qp.ui.Widget);
goog.exportSymbol("qp.ui.Mask", qp.ui.Mask);
qp.ui.Mask.UI_CLASS = "qp-ui-mask";
goog.exportProperty(qp.ui.Mask, "UI_CLASS", qp.ui.Mask.UI_CLASS);
qp.ui.Mask.UI_MODAL_CLASS = "qp-ui-mask-modal";
qp.ui.Mask.UI_VISIBLE_CLASS = "qp-ui-mask-visible";
qp.ui.Mask.UI_DISABLE_SCROLL_CLASS = "qp-ui-mask-disable-scroll";
qp.ui.Mask.SHOW_EVENT = "uiMaskShow";
qp.ui.Mask.HIDE_EVENT = "uiMaskHide";
qp.ui.Mask.prototype.decorateInternal = function(a) {
	qp.ui.Mask.superClass_.decorateInternal.call(this, a);
	this.scrollElement_ = this.dom_.getDocument().documentElement;
	this.maskElement_ = this.dom_.createDom("div", qp.ui.Mask.UI_MODAL_CLASS);
	this.dom_.appendChild(this.element_, this.maskElement_)
};
qp.ui.Mask.prototype.show = function() {
	goog.dom.classes.add(this.maskElement_, qp.ui.Mask.UI_VISIBLE_CLASS);
	goog.dom.classes.add(this.scrollElement_, qp.ui.Mask.UI_DISABLE_SCROLL_CLASS)
};
qp.ui.Mask.prototype.hide = function() {
	goog.dom.classes.remove(this.maskElement_, qp.ui.Mask.UI_VISIBLE_CLASS);
	goog.dom.classes.remove(this.scrollElement_, qp.ui.Mask.UI_DISABLE_SCROLL_CLASS)
};
qp.ui.MatchMedia = function() {
	this.mm_ = goog.global.matchMedia || this.addPolyfill()
};
goog.addSingletonGetter(qp.ui.MatchMedia);
goog.exportSymbol("qp.ui.MatchMedia", qp.ui.MatchMedia);
qp.ui.MatchMedia.prototype.addPolyfill = function() {
	var a = goog.dom.getDocument().documentElement,
		b = a.firstElementChild || a.firstChild,
		c = goog.dom.createDom("body"),
		d = goog.dom.createDom("div", {
			id: "mq-test-1"
		});
	goog.style.setStyle(d, {
		position: "absolute",
		top: "-100em"
	});
	goog.style.setStyle(c, {
		background: "none"
	});
	goog.dom.appendChild(c, d);
	return function(a) {
		var f = !1;
		d.innerHTML = goog.string.buildString('&shy;<style media="', goog.string.htmlEscape(a), '">', goog.string.htmlEscape("#mq-test-1 { width: 42px; }"),
			"</style>");
		goog.dom.insertSiblingBefore(c, b);
		f = 42 === d.offsetWidth;
		goog.dom.removeNode(c);
		return {
			matches: f,
			media: a
		}
	}
};
qp.ui.MatchMedia.prototype.query = function(a, b) {
	var c = this.mm_.call(goog.global, a);
	c.matches && goog.isFunction(b) && b(c.media);
	return c.matches
};
qp.tracking = {};
qp.tracking.DownloadTracker = function() {
	this.enableTracking_()
};
goog.addSingletonGetter(qp.tracking.DownloadTracker);
goog.exportSymbol("qp.tracking.DownloadTracker", qp.tracking.DownloadTracker);
qp.tracking.DownloadTracker.prototype.enableTracking_ = function() {
	for (var a = document.querySelectorAll("a.trackdl"), b = 0; b < a.length; b++) goog.events.listen(a[b], goog.events.EventType.CLICK, this.downloadClicked_, !1, this)
};
qp.tracking.DownloadTracker.prototype.downloadClicked_ = function(a) {
	a = a.currentTarget.href;
	if ("undefined" !== typeof ga && "undefined" !== typeof ga.getAll)
		for (var b = ga.getAll(), c = 0; c < b.length; c++) {
			var d = b[c].get("name");
			ga(d + ".send", "event", "download", "click", a)
		}
};
goog.dom.ViewportSizeMonitor = function(a) {
	goog.events.EventTarget.call(this);
	this.window_ = a || window;
	this.listenerKey_ = goog.events.listen(this.window_, goog.events.EventType.RESIZE, this.handleResize_, !1, this);
	this.size_ = goog.dom.getViewportSize(this.window_)
};
goog.inherits(goog.dom.ViewportSizeMonitor, goog.events.EventTarget);
goog.dom.ViewportSizeMonitor.getInstanceForWindow = function(a) {
	a = a || window;
	var b = goog.getUid(a);
	return goog.dom.ViewportSizeMonitor.windowInstanceMap_[b] = goog.dom.ViewportSizeMonitor.windowInstanceMap_[b] || new goog.dom.ViewportSizeMonitor(a)
};
goog.dom.ViewportSizeMonitor.removeInstanceForWindow = function(a) {
	a = goog.getUid(a || window);
	goog.dispose(goog.dom.ViewportSizeMonitor.windowInstanceMap_[a]);
	delete goog.dom.ViewportSizeMonitor.windowInstanceMap_[a]
};
goog.dom.ViewportSizeMonitor.windowInstanceMap_ = {};
goog.dom.ViewportSizeMonitor.prototype.listenerKey_ = null;
goog.dom.ViewportSizeMonitor.prototype.window_ = null;
goog.dom.ViewportSizeMonitor.prototype.size_ = null;
goog.dom.ViewportSizeMonitor.prototype.getSize = function() {
	return this.size_ ? this.size_.clone() : null
};
goog.dom.ViewportSizeMonitor.prototype.disposeInternal = function() {
	goog.dom.ViewportSizeMonitor.superClass_.disposeInternal.call(this);
	this.listenerKey_ && (goog.events.unlistenByKey(this.listenerKey_), this.listenerKey_ = null);
	this.size_ = this.window_ = null
};
goog.dom.ViewportSizeMonitor.prototype.handleResize_ = function(a) {
	a = goog.dom.getViewportSize(this.window_);
	goog.math.Size.equals(a, this.size_) || (this.size_ = a, this.dispatchEvent(goog.events.EventType.RESIZE))
};
qp.ui.ViewportStateMonitor = function() {
	goog.dom.ViewportSizeMonitor.call(this);
	goog.events.EventTarget.call(this);
	this.config_ = {
		base: "desktop",
		breakpoints: {
			"(max-width: 360px)": "mobile",
			"(max-width: 760px)": "desktop-sm",
			"(max-width: 1240px)": "desktop",
			"(max-width: 1479px)": "desktop-lg",
			"(min-width: 1480px)": "desktop-xl"
		}
	};
	this.mm_ = qp.ui.MatchMedia.getInstance();
	this.state_ = this.config_.base;
	this.breakpoints_ = goog.object.getKeys(this.config_.breakpoints);
	this.bindResize_()
};
goog.inherits(qp.ui.ViewportStateMonitor, goog.dom.ViewportSizeMonitor);
goog.addSingletonGetter(qp.ui.ViewportStateMonitor);
goog.exportSymbol("qp.ui.ViewportStateMonitor", qp.ui.ViewportStateMonitor);
qp.ui.ViewportStateMonitor.VIEWSTATECHANGE_EVENT = "viewstatechange";
qp.ui.ViewportStateMonitor.prototype.bindResize_ = function() {
	this.handleResize_ = function(a) {
		this.getSize();
		a = this.config_.base;
		var b = this.breakpoints_.length - 1;
		for (b; 0 <= b; b -= 1) this.mm_.query(this.breakpoints_[b]) && (a = this.config_.breakpoints[this.breakpoints_[b]]);
		this.state_ !== a && (this.state_ = a, this.dispatchEvent(qp.ui.ViewportStateMonitor.VIEWSTATECHANGE_EVENT))
	};
	goog.events.listen(this, goog.events.EventType.RESIZE, this.handleResize_, null, this);
	this.handleResize_()
};
qp.ui.ViewportStateMonitor.prototype.getState = function() {
	return this.state_
};
goog.a11y = {};
goog.a11y.aria = {};
goog.a11y.aria.State = {
	ACTIVEDESCENDANT: "activedescendant",
	ATOMIC: "atomic",
	AUTOCOMPLETE: "autocomplete",
	BUSY: "busy",
	CHECKED: "checked",
	CONTROLS: "controls",
	DESCRIBEDBY: "describedby",
	DISABLED: "disabled",
	DROPEFFECT: "dropeffect",
	EXPANDED: "expanded",
	FLOWTO: "flowto",
	GRABBED: "grabbed",
	HASPOPUP: "haspopup",
	HIDDEN: "hidden",
	INVALID: "invalid",
	LABEL: "label",
	LABELLEDBY: "labelledby",
	LEVEL: "level",
	LIVE: "live",
	MULTILINE: "multiline",
	MULTISELECTABLE: "multiselectable",
	ORIENTATION: "orientation",
	OWNS: "owns",
	POSINSET: "posinset",
	PRESSED: "pressed",
	READONLY: "readonly",
	RELEVANT: "relevant",
	REQUIRED: "required",
	SELECTED: "selected",
	SETSIZE: "setsize",
	SORT: "sort",
	VALUEMAX: "valuemax",
	VALUEMIN: "valuemin",
	VALUENOW: "valuenow",
	VALUETEXT: "valuetext"
};
goog.a11y.aria.AutoCompleteValues = {
	INLINE: "inline",
	LIST: "list",
	BOTH: "both",
	NONE: "none"
};
goog.a11y.aria.DropEffectValues = {
	COPY: "copy",
	MOVE: "move",
	LINK: "link",
	EXECUTE: "execute",
	POPUP: "popup",
	NONE: "none"
};
goog.a11y.aria.LivePriority = {
	OFF: "off",
	POLITE: "polite",
	ASSERTIVE: "assertive"
};
goog.a11y.aria.OrientationValues = {
	VERTICAL: "vertical",
	HORIZONTAL: "horizontal"
};
goog.a11y.aria.RelevantValues = {
	ADDITIONS: "additions",
	REMOVALS: "removals",
	TEXT: "text",
	ALL: "all"
};
goog.a11y.aria.SortValues = {
	ASCENDING: "ascending",
	DESCENDING: "descending",
	NONE: "none",
	OTHER: "other"
};
goog.a11y.aria.CheckedValues = {
	TRUE: "true",
	FALSE: "false",
	MIXED: "mixed",
	UNDEFINED: "undefined"
};
goog.a11y.aria.ExpandedValues = {
	TRUE: "true",
	FALSE: "false",
	UNDEFINED: "undefined"
};
goog.a11y.aria.GrabbedValues = {
	TRUE: "true",
	FALSE: "false",
	UNDEFINED: "undefined"
};
goog.a11y.aria.InvalidValues = {
	FALSE: "false",
	TRUE: "true",
	GRAMMAR: "grammar",
	SPELLING: "spelling"
};
goog.a11y.aria.PressedValues = {
	TRUE: "true",
	FALSE: "false",
	MIXED: "mixed",
	UNDEFINED: "undefined"
};
goog.a11y.aria.SelectedValues = {
	TRUE: "true",
	FALSE: "false",
	UNDEFINED: "undefined"
};
goog.a11y.aria.datatables = {};
goog.a11y.aria.datatables.getDefaultValuesMap = function() {
	goog.a11y.aria.DefaultStateValueMap_ || (goog.a11y.aria.DefaultStateValueMap_ = goog.object.create(goog.a11y.aria.State.ATOMIC, !1, goog.a11y.aria.State.AUTOCOMPLETE, "none", goog.a11y.aria.State.DROPEFFECT, "none", goog.a11y.aria.State.HASPOPUP, !1, goog.a11y.aria.State.LIVE, "off", goog.a11y.aria.State.MULTILINE, !1, goog.a11y.aria.State.MULTISELECTABLE, !1, goog.a11y.aria.State.ORIENTATION, "vertical", goog.a11y.aria.State.READONLY, !1, goog.a11y.aria.State.RELEVANT,
		"additions text", goog.a11y.aria.State.REQUIRED, !1, goog.a11y.aria.State.SORT, "none", goog.a11y.aria.State.BUSY, !1, goog.a11y.aria.State.DISABLED, !1, goog.a11y.aria.State.HIDDEN, !1, goog.a11y.aria.State.INVALID, "false"));
	return goog.a11y.aria.DefaultStateValueMap_
};
goog.a11y.aria.Role = {
	ALERT: "alert",
	ALERTDIALOG: "alertdialog",
	APPLICATION: "application",
	ARTICLE: "article",
	BANNER: "banner",
	BUTTON: "button",
	CHECKBOX: "checkbox",
	COLUMNHEADER: "columnheader",
	COMBOBOX: "combobox",
	COMPLEMENTARY: "complementary",
	CONTENTINFO: "contentinfo",
	DEFINITION: "definition",
	DIALOG: "dialog",
	DIRECTORY: "directory",
	DOCUMENT: "document",
	FORM: "form",
	GRID: "grid",
	GRIDCELL: "gridcell",
	GROUP: "group",
	HEADING: "heading",
	IMG: "img",
	LINK: "link",
	LIST: "list",
	LISTBOX: "listbox",
	LISTITEM: "listitem",
	LOG: "log",
	MAIN: "main",
	MARQUEE: "marquee",
	MATH: "math",
	MENU: "menu",
	MENUBAR: "menubar",
	MENU_ITEM: "menuitem",
	MENU_ITEM_CHECKBOX: "menuitemcheckbox",
	MENU_ITEM_RADIO: "menuitemradio",
	NAVIGATION: "navigation",
	NOTE: "note",
	OPTION: "option",
	PRESENTATION: "presentation",
	PROGRESSBAR: "progressbar",
	RADIO: "radio",
	RADIOGROUP: "radiogroup",
	REGION: "region",
	ROW: "row",
	ROWGROUP: "rowgroup",
	ROWHEADER: "rowheader",
	SCROLLBAR: "scrollbar",
	SEARCH: "search",
	SEPARATOR: "separator",
	SLIDER: "slider",
	SPINBUTTON: "spinbutton",
	STATUS: "status",
	TAB: "tab",
	TAB_LIST: "tablist",
	TAB_PANEL: "tabpanel",
	TEXTBOX: "textbox",
	TIMER: "timer",
	TOOLBAR: "toolbar",
	TOOLTIP: "tooltip",
	TREE: "tree",
	TREEGRID: "treegrid",
	TREEITEM: "treeitem"
};
goog.a11y.aria.ARIA_PREFIX_ = "aria-";
goog.a11y.aria.ROLE_ATTRIBUTE_ = "role";
goog.a11y.aria.TAGS_WITH_ASSUMED_ROLES_ = [goog.dom.TagName.A, goog.dom.TagName.AREA, goog.dom.TagName.BUTTON, goog.dom.TagName.HEAD, goog.dom.TagName.INPUT, goog.dom.TagName.LINK, goog.dom.TagName.MENU, goog.dom.TagName.META, goog.dom.TagName.OPTGROUP, goog.dom.TagName.OPTION, goog.dom.TagName.PROGRESS, goog.dom.TagName.STYLE, goog.dom.TagName.SELECT, goog.dom.TagName.SOURCE, goog.dom.TagName.TEXTAREA, goog.dom.TagName.TITLE, goog.dom.TagName.TRACK];
goog.a11y.aria.setRole = function(a, b) {
	b ? (goog.asserts.ENABLE_ASSERTS && goog.asserts.assert(goog.object.containsValue(goog.a11y.aria.Role, b), "No such ARIA role " + b), a.setAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_, b)) : goog.a11y.aria.removeRole(a)
};
goog.a11y.aria.getRole = function(a) {
	return a.getAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_) || null
};
goog.a11y.aria.removeRole = function(a) {
	a.removeAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_)
};
goog.a11y.aria.setState = function(a, b, c) {
	goog.isArrayLike(c) && (c = c.join(" "));
	var d = goog.a11y.aria.getAriaAttributeName_(b);
	"" === c || void 0 == c ? (c = goog.a11y.aria.datatables.getDefaultValuesMap(), b in c ? a.setAttribute(d, c[b]) : a.removeAttribute(d)) : a.setAttribute(d, c)
};
goog.a11y.aria.removeState = function(a, b) {
	a.removeAttribute(goog.a11y.aria.getAriaAttributeName_(b))
};
goog.a11y.aria.getState = function(a, b) {
	var c = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
	return null == c || void 0 == c ? "" : String(c)
};
goog.a11y.aria.getActiveDescendant = function(a) {
	var b = goog.a11y.aria.getState(a, goog.a11y.aria.State.ACTIVEDESCENDANT);
	return goog.dom.getOwnerDocument(a).getElementById(b)
};
goog.a11y.aria.setActiveDescendant = function(a, b) {
	var c = "";
	b && (c = b.id, goog.asserts.assert(c, "The active element should have an id."));
	goog.a11y.aria.setState(a, goog.a11y.aria.State.ACTIVEDESCENDANT, c)
};
goog.a11y.aria.getLabel = function(a) {
	return goog.a11y.aria.getState(a, goog.a11y.aria.State.LABEL)
};
goog.a11y.aria.setLabel = function(a, b) {
	goog.a11y.aria.setState(a, goog.a11y.aria.State.LABEL, b)
};
goog.a11y.aria.assertRoleIsSetInternalUtil = function(a, b) {
	if (!goog.array.contains(goog.a11y.aria.TAGS_WITH_ASSUMED_ROLES_, a.tagName)) {
		var c = goog.a11y.aria.getRole(a);
		goog.asserts.assert(null != c, "The element ARIA role cannot be null.");
		goog.asserts.assert(goog.array.contains(b, c), 'Non existing or incorrect role set for element.The role set is "' + c + '". The role should be any of "' + b + '". Check the ARIA specification for more details http://www.w3.org/TR/wai-aria/roles.')
	}
};
goog.a11y.aria.getStateBoolean = function(a, b) {
	var c = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
	goog.asserts.assert(goog.isBoolean(c) || null == c || "true" == c || "false" == c);
	return null == c ? c : goog.isBoolean(c) ? c : "true" == c
};
goog.a11y.aria.getStateNumber = function(a, b) {
	var c = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
	goog.asserts.assert((null == c || !isNaN(Number(c))) && !goog.isBoolean(c));
	return null == c ? null : Number(c)
};
goog.a11y.aria.getStateString = function(a, b) {
	var c = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
	goog.asserts.assert((null == c || goog.isString(c)) && isNaN(Number(c)) && "true" != c && "false" != c);
	return null == c ? null : c
};
goog.a11y.aria.getStringArrayStateInternalUtil = function(a, b) {
	var c = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
	return goog.a11y.aria.splitStringOnWhitespace_(c)
};
goog.a11y.aria.splitStringOnWhitespace_ = function(a) {
	return a ? a.split(/\s+/) : []
};
goog.a11y.aria.getAriaAttributeName_ = function(a) {
	goog.asserts.ENABLE_ASSERTS && (goog.asserts.assert(a, "ARIA attribute cannot be empty."), goog.asserts.assert(goog.object.containsValue(goog.a11y.aria.State, a), "No such ARIA attribute " + a));
	return goog.a11y.aria.ARIA_PREFIX_ + a
};
goog.dom.classlist = {};
goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST = !1;
goog.dom.classlist.get = function(a) {
	if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList) return a.classList;
	a = a.className;
	return goog.isString(a) && a.match(/\S+/g) || []
};
goog.dom.classlist.set = function(a, b) {
	a.className = b
};
goog.dom.classlist.contains = function(a, b) {
	return goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList ? a.classList.contains(b) : goog.array.contains(goog.dom.classlist.get(a), b)
};
goog.dom.classlist.add = function(a, b) {
	goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList ? a.classList.add(b) : goog.dom.classlist.contains(a, b) || (a.className += 0 < a.className.length ? " " + b : b)
};
goog.dom.classlist.addAll = function(a, b) {
	if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList) goog.array.forEach(b, function(b) {
		goog.dom.classlist.add(a, b)
	});
	else {
		var c = {};
		goog.array.forEach(goog.dom.classlist.get(a), function(a) {
			c[a] = !0
		});
		goog.array.forEach(b, function(a) {
			c[a] = !0
		});
		a.className = "";
		for (var d in c) a.className += 0 < a.className.length ? " " + d : d
	}
};
goog.dom.classlist.remove = function(a, b) {
	goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList ? a.classList.remove(b) : goog.dom.classlist.contains(a, b) && (a.className = goog.array.filter(goog.dom.classlist.get(a), function(a) {
		return a != b
	}).join(" "))
};
goog.dom.classlist.removeAll = function(a, b) {
	goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList ? goog.array.forEach(b, function(b) {
		goog.dom.classlist.remove(a, b)
	}) : a.className = goog.array.filter(goog.dom.classlist.get(a), function(a) {
		return !goog.array.contains(b, a)
	}).join(" ")
};
goog.dom.classlist.enable = function(a, b, c) {
	c ? goog.dom.classlist.add(a, b) : goog.dom.classlist.remove(a, b)
};
goog.dom.classlist.enableAll = function(a, b, c) {
	(c ? goog.dom.classlist.addAll : goog.dom.classlist.removeAll)(a, b)
};
goog.dom.classlist.swap = function(a, b, c) {
	return goog.dom.classlist.contains(a, b) ? (goog.dom.classlist.remove(a, b), goog.dom.classlist.add(a, c), !0) : !1
};
goog.dom.classlist.toggle = function(a, b) {
	var c = !goog.dom.classlist.contains(a, b);
	goog.dom.classlist.enable(a, b, c);
	return c
};
goog.dom.classlist.addRemove = function(a, b, c) {
	goog.dom.classlist.remove(a, b);
	goog.dom.classlist.add(a, c)
};
goog.ui.Zippy = function(a, b, c, d, e) {
	function f(a) {
		a && (a.tabIndex = 0, goog.a11y.aria.setRole(a, g.getAriaRole()), goog.dom.classlist.add(a, "goog-zippy-header"), g.enableMouseEventsHandling_(a), g.enableKeyboardEventsHandling_(a))
	}
	goog.events.EventTarget.call(this);
	this.dom_ = e || goog.dom.getDomHelper();
	this.elHeader_ = this.dom_.getElement(a) || null;
	this.elExpandedHeader_ = this.dom_.getElement(d || null);
	this.elContent_ = (this.lazyCreateFunc_ = goog.isFunction(b) ? b : null) || !b ? null : this.dom_.getElement(b);
	this.expanded_ =
		1 == c;
	this.keyboardEventHandler_ = new goog.events.EventHandler(this);
	this.mouseEventHandler_ = new goog.events.EventHandler(this);
	var g = this;
	f(this.elHeader_);
	f(this.elExpandedHeader_);
	this.setExpanded(this.expanded_)
};
goog.inherits(goog.ui.Zippy, goog.events.EventTarget);
goog.tagUnsealableClass(goog.ui.Zippy);
goog.ui.Zippy.Events = {
	ACTION: "action",
	TOGGLE: "toggle"
};
goog.ui.Zippy.prototype.handleMouseEvents_ = !0;
goog.ui.Zippy.prototype.handleKeyEvents_ = !0;
goog.ui.Zippy.prototype.disposeInternal = function() {
	goog.ui.Zippy.superClass_.disposeInternal.call(this);
	goog.dispose(this.keyboardEventHandler_);
	goog.dispose(this.mouseEventHandler_)
};
goog.ui.Zippy.prototype.getAriaRole = function() {
	return goog.a11y.aria.Role.TAB
};
goog.ui.Zippy.prototype.getContentElement = function() {
	return this.elContent_
};
goog.ui.Zippy.prototype.getVisibleHeaderElement = function() {
	var a = this.elExpandedHeader_;
	return a && goog.style.isElementShown(a) ? a : this.elHeader_
};
goog.ui.Zippy.prototype.expand = function() {
	this.setExpanded(!0)
};
goog.ui.Zippy.prototype.collapse = function() {
	this.setExpanded(!1)
};
goog.ui.Zippy.prototype.toggle = function() {
	this.setExpanded(!this.expanded_)
};
goog.ui.Zippy.prototype.setExpanded = function(a) {
	this.elContent_ ? goog.style.setElementShown(this.elContent_, a) : a && this.lazyCreateFunc_ && (this.elContent_ = this.lazyCreateFunc_());
	this.elContent_ && goog.dom.classlist.add(this.elContent_, "goog-zippy-content");
	this.elExpandedHeader_ ? (goog.style.setElementShown(this.elHeader_, !a), goog.style.setElementShown(this.elExpandedHeader_, a)) : this.updateHeaderClassName(a);
	this.setExpandedInternal(a);
	this.dispatchEvent(new goog.ui.ZippyEvent(goog.ui.Zippy.Events.TOGGLE,
		this, this.expanded_))
};
goog.ui.Zippy.prototype.setExpandedInternal = function(a) {
	this.expanded_ = a
};
goog.ui.Zippy.prototype.isExpanded = function() {
	return this.expanded_
};
goog.ui.Zippy.prototype.updateHeaderClassName = function(a) {
	this.elHeader_ && (goog.dom.classlist.enable(this.elHeader_, "goog-zippy-expanded", a), goog.dom.classlist.enable(this.elHeader_, "goog-zippy-collapsed", !a), goog.a11y.aria.setState(this.elHeader_, goog.a11y.aria.State.EXPANDED, a))
};
goog.ui.Zippy.prototype.isHandleKeyEvents = function() {
	return this.handleKeyEvents_
};
goog.ui.Zippy.prototype.isHandleMouseEvents = function() {
	return this.handleMouseEvents_
};
goog.ui.Zippy.prototype.setHandleKeyboardEvents = function(a) {
	this.handleKeyEvents_ != a && ((this.handleKeyEvents_ = a) ? (this.enableKeyboardEventsHandling_(this.elHeader_), this.enableKeyboardEventsHandling_(this.elExpandedHeader_)) : this.keyboardEventHandler_.removeAll())
};
goog.ui.Zippy.prototype.setHandleMouseEvents = function(a) {
	this.handleMouseEvents_ != a && ((this.handleMouseEvents_ = a) ? (this.enableMouseEventsHandling_(this.elHeader_), this.enableMouseEventsHandling_(this.elExpandedHeader_)) : this.mouseEventHandler_.removeAll())
};
goog.ui.Zippy.prototype.enableKeyboardEventsHandling_ = function(a) {
	a && this.keyboardEventHandler_.listen(a, goog.events.EventType.KEYDOWN, this.onHeaderKeyDown_)
};
goog.ui.Zippy.prototype.enableMouseEventsHandling_ = function(a) {
	a && this.mouseEventHandler_.listen(a, goog.events.EventType.CLICK, this.onHeaderClick_)
};
goog.ui.Zippy.prototype.onHeaderKeyDown_ = function(a) {
	if (a.keyCode == goog.events.KeyCodes.ENTER || a.keyCode == goog.events.KeyCodes.SPACE) this.toggle(), this.dispatchActionEvent_(), a.preventDefault(), a.stopPropagation()
};
goog.ui.Zippy.prototype.onHeaderClick_ = function(a) {
	this.toggle();
	this.dispatchActionEvent_()
};
goog.ui.Zippy.prototype.dispatchActionEvent_ = function() {
	this.dispatchEvent(new goog.events.Event(goog.ui.Zippy.Events.ACTION, this))
};
goog.ui.ZippyEvent = function(a, b, c) {
	goog.events.Event.call(this, a, b);
	this.expanded = c
};
goog.inherits(goog.ui.ZippyEvent, goog.events.Event);
qp.ui.ResponsiveZippy = function(a) {
	var b = qp.ui.ViewportStateMonitor.getInstance().getState(); - 1 !== ["mobile", "desktop-sm"].indexOf(b) && goog.ui.Zippy.call(this, a, goog.dom.getNextElementSibling(a), !1)
};
goog.inherits(qp.ui.ResponsiveZippy, goog.ui.Zippy);
goog.exportSymbol("qp.ui.ResponsiveZippy", qp.ui.ResponsiveZippy);
qp.ui.Peekaboo = function(a, b) {
	qp.ui.Widget.call(this, a, b);
	this.isActive_ = !1
};
goog.inherits(qp.ui.Peekaboo, qp.ui.Widget);
goog.exportSymbol("qp.ui.Peekaboo", qp.ui.Peekaboo);
qp.ui.Peekaboo.UI_CLASS = "qp-ui-peekaboo";
goog.exportProperty(qp.ui.Peekaboo, "UI_CLASS", qp.ui.Peekaboo.UI_CLASS);
qp.ui.Peekaboo.UI_CLASS_PLACEHOLDER = "qp-ui-peekaboo-placeholder";
qp.ui.Peekaboo.UI_CLASS_ACTIVE = "qp-ui-peekaboo-active";
qp.ui.Peekaboo.defaults = {
	"default": -1
};
goog.exportSymbol("qp.ui.Peekaboo.defaults", qp.ui.Peekaboo.defaults);
qp.ui.Peekaboo.prototype.decorateInternal = function(a) {
	qp.ui.Peekaboo.superClass_.decorateInternal.call(this, a);
	this.placeholder_ = this.element_.cloneNode(!0);
	goog.dom.classes.swap(this.placeholder_, qp.ui.Peekaboo.UI_CLASS, qp.ui.Peekaboo.UI_CLASS_PLACEHOLDER);
	this.placeholder_.setAttribute("aria-hidden", !0);
	goog.dom.insertSiblingAfter(this.placeholder_, this.element_);
	this.getHandler().listen(this.getDomHelper().getWindow(), [goog.events.EventType.SCROLL, goog.events.EventType.RESIZE], this.updatePosition_, !1, this);
	this.viewport_ = qp.ui.ViewportStateMonitor.getInstance();
	this.viewport_.listen(qp.ui.ViewportStateMonitor.VIEWSTATECHANGE_EVENT, this.handleViewportStateChange_, !1, this);
	this.handleViewportStateChange_()
};
qp.ui.Peekaboo.prototype.handleViewportStateChange_ = function(a) {
	a = this.viewport_.getState();
	this.config_.hasOwnProperty(a) ? this.offset_ = this.config_[a] : this.config_.hasOwnProperty("default") ? this.offset_ = this.config_["default"] : this.offset_ = -1;
	this.updatePosition_()
};
DONTOPTIMIZE = function(a) {
	return a
};
qp.ui.Peekaboo.prototype.updatePosition_ = function() {
	var a = function() {
		for (var a = document.querySelectorAll(".header-wrapper"), c = 0;
			"undefined" !== typeof a && c < a.length; c++) a[c].style.display = "none", DONTOPTIMIZE(a[c].offsetHeight), a[c].style.display = ""
	};
	window.pageYOffset >= this.offset_ ? this.isActive_ || (this.isActive_ = !0, goog.dom.classes.add(this.element_, qp.ui.Peekaboo.UI_CLASS_ACTIVE), goog.dom.classes.add(this.placeholder_, qp.ui.Peekaboo.UI_CLASS_ACTIVE), a()) : this.isActive_ && (this.isActive_ = !1, goog.dom.classes.remove(this.element_,
		qp.ui.Peekaboo.UI_CLASS_ACTIVE), goog.dom.classes.remove(this.placeholder_, qp.ui.Peekaboo.UI_CLASS_ACTIVE), a())
};
goog.uri = {};
goog.uri.utils = {};
goog.uri.utils.CharCode_ = {
	AMPERSAND: 38,
	EQUAL: 61,
	HASH: 35,
	QUESTION: 63
};
goog.uri.utils.buildFromEncodedParts = function(a, b, c, d, e, f, g) {
	var h = "";
	a && (h += a + ":");
	c && (h += "//", b && (h += b + "@"), h += c, d && (h += ":" + d));
	e && (h += e);
	f && (h += "?" + f);
	g && (h += "#" + g);
	return h
};
goog.uri.utils.splitRe_ = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;
goog.uri.utils.ComponentIndex = {
	SCHEME: 1,
	USER_INFO: 2,
	DOMAIN: 3,
	PORT: 4,
	PATH: 5,
	QUERY_DATA: 6,
	FRAGMENT: 7
};
goog.uri.utils.split = function(a) {
	goog.uri.utils.phishingProtection_();
	return a.match(goog.uri.utils.splitRe_)
};
goog.uri.utils.needsPhishingProtection_ = goog.userAgent.WEBKIT;
goog.uri.utils.phishingProtection_ = function() {
	if (goog.uri.utils.needsPhishingProtection_) {
		goog.uri.utils.needsPhishingProtection_ = !1;
		var a = goog.global.location;
		if (a) {
			var b = a.href;
			if (b && (b = goog.uri.utils.getDomain(b)) && b != a.hostname) throw goog.uri.utils.needsPhishingProtection_ = !0, Error();
		}
	}
};
goog.uri.utils.decodeIfPossible_ = function(a) {
	return a && decodeURIComponent(a)
};
goog.uri.utils.getComponentByIndex_ = function(a, b) {
	return goog.uri.utils.split(b)[a] || null
};
goog.uri.utils.getScheme = function(a) {
	return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, a)
};
goog.uri.utils.getEffectiveScheme = function(a) {
	a = goog.uri.utils.getScheme(a);
	!a && self.location && (a = self.location.protocol, a = a.substr(0, a.length - 1));
	return a ? a.toLowerCase() : ""
};
goog.uri.utils.getUserInfoEncoded = function(a) {
	return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, a)
};
goog.uri.utils.getUserInfo = function(a) {
	return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(a))
};
goog.uri.utils.getDomainEncoded = function(a) {
	return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, a)
};
goog.uri.utils.getDomain = function(a) {
	return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(a))
};
goog.uri.utils.getPort = function(a) {
	return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, a)) || null
};
goog.uri.utils.getPathEncoded = function(a) {
	return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, a)
};
goog.uri.utils.getPath = function(a) {
	return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(a))
};
goog.uri.utils.getQueryData = function(a) {
	return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, a)
};
goog.uri.utils.getFragmentEncoded = function(a) {
	var b = a.indexOf("#");
	return 0 > b ? null : a.substr(b + 1)
};
goog.uri.utils.setFragmentEncoded = function(a, b) {
	return goog.uri.utils.removeFragment(a) + (b ? "#" + b : "")
};
goog.uri.utils.getFragment = function(a) {
	return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(a))
};
goog.uri.utils.getHost = function(a) {
	a = goog.uri.utils.split(a);
	return goog.uri.utils.buildFromEncodedParts(a[goog.uri.utils.ComponentIndex.SCHEME], a[goog.uri.utils.ComponentIndex.USER_INFO], a[goog.uri.utils.ComponentIndex.DOMAIN], a[goog.uri.utils.ComponentIndex.PORT])
};
goog.uri.utils.getPathAndAfter = function(a) {
	a = goog.uri.utils.split(a);
	return goog.uri.utils.buildFromEncodedParts(null, null, null, null, a[goog.uri.utils.ComponentIndex.PATH], a[goog.uri.utils.ComponentIndex.QUERY_DATA], a[goog.uri.utils.ComponentIndex.FRAGMENT])
};
goog.uri.utils.removeFragment = function(a) {
	var b = a.indexOf("#");
	return 0 > b ? a : a.substr(0, b)
};
goog.uri.utils.haveSameDomain = function(a, b) {
	var c = goog.uri.utils.split(a),
		d = goog.uri.utils.split(b);
	return c[goog.uri.utils.ComponentIndex.DOMAIN] == d[goog.uri.utils.ComponentIndex.DOMAIN] && c[goog.uri.utils.ComponentIndex.SCHEME] == d[goog.uri.utils.ComponentIndex.SCHEME] && c[goog.uri.utils.ComponentIndex.PORT] == d[goog.uri.utils.ComponentIndex.PORT]
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(a) {
	if (goog.DEBUG && (0 <= a.indexOf("#") || 0 <= a.indexOf("?"))) throw Error("goog.uri.utils: Fragment or query identifiers are not supported: [" + a + "]");
};
goog.uri.utils.appendQueryData_ = function(a) {
	if (a[1]) {
		var b = a[0],
			c = b.indexOf("#");
		0 <= c && (a.push(b.substr(c)), a[0] = b = b.substr(0, c));
		c = b.indexOf("?");
		0 > c ? a[1] = "?" : c == b.length - 1 && (a[1] = void 0)
	}
	return a.join("")
};
goog.uri.utils.appendKeyValuePairs_ = function(a, b, c) {
	if (goog.isArray(b)) {
		goog.asserts.assertArray(b);
		for (var d = 0; d < b.length; d++) goog.uri.utils.appendKeyValuePairs_(a, String(b[d]), c)
	} else null != b && c.push("&", a, "" === b ? "" : "=", goog.string.urlEncode(b))
};
goog.uri.utils.buildQueryDataBuffer_ = function(a, b, c) {
	goog.asserts.assert(0 == Math.max(b.length - (c || 0), 0) % 2, "goog.uri.utils: Key/value lists must be even in length.");
	for (c = c || 0; c < b.length; c += 2) goog.uri.utils.appendKeyValuePairs_(b[c], b[c + 1], a);
	return a
};
goog.uri.utils.buildQueryData = function(a, b) {
	var c = goog.uri.utils.buildQueryDataBuffer_([], a, b);
	c[0] = "";
	return c.join("")
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(a, b) {
	for (var c in b) goog.uri.utils.appendKeyValuePairs_(c, b[c], a);
	return a
};
goog.uri.utils.buildQueryDataFromMap = function(a) {
	a = goog.uri.utils.buildQueryDataBufferFromMap_([], a);
	a[0] = "";
	return a.join("")
};
goog.uri.utils.appendParams = function(a, b) {
	return goog.uri.utils.appendQueryData_(2 == arguments.length ? goog.uri.utils.buildQueryDataBuffer_([a], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([a], arguments, 1))
};
goog.uri.utils.appendParamsFromMap = function(a, b) {
	return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([a], b))
};
goog.uri.utils.appendParam = function(a, b, c) {
	a = [a, "&", b];
	goog.isDefAndNotNull(c) && a.push("=", goog.string.urlEncode(c));
	return goog.uri.utils.appendQueryData_(a)
};
goog.uri.utils.findParam_ = function(a, b, c, d) {
	for (var e = c.length; 0 <= (b = a.indexOf(c, b)) && b < d;) {
		var f = a.charCodeAt(b - 1);
		if (f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.QUESTION)
			if (f = a.charCodeAt(b + e), !f || f == goog.uri.utils.CharCode_.EQUAL || f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.HASH) return b;
		b += e + 1
	}
	return -1
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(a, b) {
	return 0 <= goog.uri.utils.findParam_(a, 0, b, a.search(goog.uri.utils.hashOrEndRe_))
};
goog.uri.utils.getParamValue = function(a, b) {
	var c = a.search(goog.uri.utils.hashOrEndRe_),
		d = goog.uri.utils.findParam_(a, 0, b, c);
	if (0 > d) return null;
	var e = a.indexOf("&", d);
	if (0 > e || e > c) e = c;
	d += b.length + 1;
	return goog.string.urlDecode(a.substr(d, e - d))
};
goog.uri.utils.getParamValues = function(a, b) {
	for (var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = []; 0 <= (e = goog.uri.utils.findParam_(a, d, b, c));) {
		d = a.indexOf("&", e);
		if (0 > d || d > c) d = c;
		e += b.length + 1;
		f.push(goog.string.urlDecode(a.substr(e, d - e)))
	}
	return f
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(a, b) {
	for (var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = []; 0 <= (e = goog.uri.utils.findParam_(a, d, b, c));) f.push(a.substring(d, e)), d = Math.min(a.indexOf("&", e) + 1 || c, c);
	f.push(a.substr(d));
	return f.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1")
};
goog.uri.utils.setParam = function(a, b, c) {
	return goog.uri.utils.appendParam(goog.uri.utils.removeParam(a, b), b, c)
};
goog.uri.utils.appendPath = function(a, b) {
	goog.uri.utils.assertNoFragmentsOrQueries_(a);
	goog.string.endsWith(a, "/") && (a = a.substr(0, a.length - 1));
	goog.string.startsWith(b, "/") && (b = b.substr(1));
	return goog.string.buildString(a, "/", b)
};
goog.uri.utils.setPath = function(a, b) {
	goog.string.startsWith(b, "/") || (b = "/" + b);
	var c = goog.uri.utils.split(a);
	return goog.uri.utils.buildFromEncodedParts(c[goog.uri.utils.ComponentIndex.SCHEME], c[goog.uri.utils.ComponentIndex.USER_INFO], c[goog.uri.utils.ComponentIndex.DOMAIN], c[goog.uri.utils.ComponentIndex.PORT], b, c[goog.uri.utils.ComponentIndex.QUERY_DATA], c[goog.uri.utils.ComponentIndex.FRAGMENT])
};
goog.uri.utils.StandardQueryParam = {
	RANDOM: "zx"
};
goog.uri.utils.makeUnique = function(a) {
	return goog.uri.utils.setParam(a, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString())
};
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : Error("StopIteration");
goog.iter.Iterator = function() {};
goog.iter.Iterator.prototype.next = function() {
	throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(a) {
	return this
};
goog.iter.toIterator = function(a) {
	if (a instanceof goog.iter.Iterator) return a;
	if ("function" == typeof a.__iterator__) return a.__iterator__(!1);
	if (goog.isArrayLike(a)) {
		var b = 0,
			c = new goog.iter.Iterator;
		c.next = function() {
			for (;;) {
				if (b >= a.length) throw goog.iter.StopIteration;
				if (b in a) return a[b++];
				b++
			}
		};
		return c
	}
	throw Error("Not implemented");
};
goog.iter.forEach = function(a, b, c) {
	if (goog.isArrayLike(a)) try {
		goog.array.forEach(a, b, c)
	} catch (d) {
		if (d !== goog.iter.StopIteration) throw d;
	} else {
		a = goog.iter.toIterator(a);
		try {
			for (;;) b.call(c, a.next(), void 0, a)
		} catch (e) {
			if (e !== goog.iter.StopIteration) throw e;
		}
	}
};
goog.iter.filter = function(a, b, c) {
	var d = goog.iter.toIterator(a);
	a = new goog.iter.Iterator;
	a.next = function() {
		for (;;) {
			var a = d.next();
			if (b.call(c, a, void 0, d)) return a
		}
	};
	return a
};
goog.iter.filterFalse = function(a, b, c) {
	return goog.iter.filter(a, goog.functions.not(b), c)
};
goog.iter.range = function(a, b, c) {
	var d = 0,
		e = a,
		f = c || 1;
	1 < arguments.length && (d = a, e = b);
	if (0 == f) throw Error("Range step argument must not be zero");
	var g = new goog.iter.Iterator;
	g.next = function() {
		if (0 < f && d >= e || 0 > f && d <= e) throw goog.iter.StopIteration;
		var a = d;
		d += f;
		return a
	};
	return g
};
goog.iter.join = function(a, b) {
	return goog.iter.toArray(a).join(b)
};
goog.iter.map = function(a, b, c) {
	var d = goog.iter.toIterator(a);
	a = new goog.iter.Iterator;
	a.next = function() {
		var a = d.next();
		return b.call(c, a, void 0, d)
	};
	return a
};
goog.iter.reduce = function(a, b, c, d) {
	var e = c;
	goog.iter.forEach(a, function(a) {
		e = b.call(d, e, a)
	});
	return e
};
goog.iter.some = function(a, b, c) {
	a = goog.iter.toIterator(a);
	try {
		for (;;)
			if (b.call(c, a.next(), void 0, a)) return !0
	} catch (d) {
		if (d !== goog.iter.StopIteration) throw d;
	}
	return !1
};
goog.iter.every = function(a, b, c) {
	a = goog.iter.toIterator(a);
	try {
		for (;;)
			if (!b.call(c, a.next(), void 0, a)) return !1
	} catch (d) {
		if (d !== goog.iter.StopIteration) throw d;
	}
	return !0
};
goog.iter.chain = function(a) {
	var b = goog.iter.toIterator(arguments),
		c = new goog.iter.Iterator,
		d = null;
	c.next = function() {
		for (;;) {
			if (null == d) {
				var a = b.next();
				d = goog.iter.toIterator(a)
			}
			try {
				return d.next()
			} catch (c) {
				if (c !== goog.iter.StopIteration) throw c;
				d = null
			}
		}
	};
	return c
};
goog.iter.chainFromIterable = function(a) {
	return goog.iter.chain.apply(void 0, a)
};
goog.iter.dropWhile = function(a, b, c) {
	var d = goog.iter.toIterator(a);
	a = new goog.iter.Iterator;
	var e = !0;
	a.next = function() {
		for (;;) {
			var a = d.next();
			if (!e || !b.call(c, a, void 0, d)) return e = !1, a
		}
	};
	return a
};
goog.iter.takeWhile = function(a, b, c) {
	var d = goog.iter.toIterator(a);
	a = new goog.iter.Iterator;
	var e = !0;
	a.next = function() {
		for (;;)
			if (e) {
				var a = d.next();
				if (b.call(c, a, void 0, d)) return a;
				e = !1
			} else throw goog.iter.StopIteration;
	};
	return a
};
goog.iter.toArray = function(a) {
	if (goog.isArrayLike(a)) return goog.array.toArray(a);
	a = goog.iter.toIterator(a);
	var b = [];
	goog.iter.forEach(a, function(a) {
		b.push(a)
	});
	return b
};
goog.iter.equals = function(a, b) {
	var c = goog.iter.zipLongest({}, a, b);
	return goog.iter.every(c, function(a) {
		return a[0] == a[1]
	})
};
goog.iter.nextOrValue = function(a, b) {
	try {
		return goog.iter.toIterator(a).next()
	} catch (c) {
		if (c != goog.iter.StopIteration) throw c;
		return b
	}
};
goog.iter.product = function(a) {
	if (goog.array.some(arguments, function(a) {
			return !a.length
		}) || !arguments.length) return new goog.iter.Iterator;
	var b = new goog.iter.Iterator,
		c = arguments,
		d = goog.array.repeat(0, c.length);
	b.next = function() {
		if (d) {
			for (var a = goog.array.map(d, function(a, b) {
					return c[b][a]
				}), b = d.length - 1; 0 <= b; b--) {
				goog.asserts.assert(d);
				if (d[b] < c[b].length - 1) {
					d[b]++;
					break
				}
				if (0 == b) {
					d = null;
					break
				}
				d[b] = 0
			}
			return a
		}
		throw goog.iter.StopIteration;
	};
	return b
};
goog.iter.cycle = function(a) {
	var b = goog.iter.toIterator(a),
		c = [],
		d = 0;
	a = new goog.iter.Iterator;
	var e = !1;
	a.next = function() {
		var a = null;
		if (!e) try {
			return a = b.next(), c.push(a), a
		} catch (g) {
			if (g != goog.iter.StopIteration || goog.array.isEmpty(c)) throw g;
			e = !0
		}
		a = c[d];
		d = (d + 1) % c.length;
		return a
	};
	return a
};
goog.iter.count = function(a, b) {
	var c = a || 0,
		d = goog.isDef(b) ? b : 1,
		e = new goog.iter.Iterator;
	e.next = function() {
		var a = c;
		c += d;
		return a
	};
	return e
};
goog.iter.repeat = function(a) {
	var b = new goog.iter.Iterator;
	b.next = goog.functions.constant(a);
	return b
};
goog.iter.accumulate = function(a) {
	var b = goog.iter.toIterator(a),
		c = 0;
	a = new goog.iter.Iterator;
	a.next = function() {
		return c += b.next()
	};
	return a
};
goog.iter.zip = function(a) {
	var b = arguments,
		c = new goog.iter.Iterator;
	if (0 < b.length) {
		var d = goog.array.map(b, goog.iter.toIterator);
		c.next = function() {
			return goog.array.map(d, function(a) {
				return a.next()
			})
		}
	}
	return c
};
goog.iter.zipLongest = function(a, b) {
	var c = goog.array.slice(arguments, 1),
		d = new goog.iter.Iterator;
	if (0 < c.length) {
		var e = goog.array.map(c, goog.iter.toIterator);
		d.next = function() {
			var b = !1,
				c = goog.array.map(e, function(c) {
					var d;
					try {
						d = c.next(), b = !0
					} catch (e) {
						if (e !== goog.iter.StopIteration) throw e;
						d = a
					}
					return d
				});
			if (!b) throw goog.iter.StopIteration;
			return c
		}
	}
	return d
};
goog.iter.compress = function(a, b) {
	var c = goog.iter.toIterator(b);
	return goog.iter.filter(a, function() {
		return !!c.next()
	})
};
goog.iter.GroupByIterator_ = function(a, b) {
	this.iterator = goog.iter.toIterator(a);
	this.keyFunc = b || goog.functions.identity
};
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator);
goog.iter.GroupByIterator_.prototype.next = function() {
	for (; this.currentKey == this.targetKey;) this.currentValue = this.iterator.next(), this.currentKey = this.keyFunc(this.currentValue);
	this.targetKey = this.currentKey;
	return [this.currentKey, this.groupItems_(this.targetKey)]
};
goog.iter.GroupByIterator_.prototype.groupItems_ = function(a) {
	for (var b = []; this.currentKey == a;) {
		b.push(this.currentValue);
		try {
			this.currentValue = this.iterator.next()
		} catch (c) {
			if (c !== goog.iter.StopIteration) throw c;
			break
		}
		this.currentKey = this.keyFunc(this.currentValue)
	}
	return b
};
goog.iter.groupBy = function(a, b) {
	return new goog.iter.GroupByIterator_(a, b)
};
goog.iter.starMap = function(a, b, c) {
	var d = goog.iter.toIterator(a);
	a = new goog.iter.Iterator;
	a.next = function() {
		var a = goog.iter.toArray(d.next());
		return b.apply(c, goog.array.concat(a, void 0, d))
	};
	return a
};
goog.iter.tee = function(a, b) {
	var c = goog.iter.toIterator(a),
		d = goog.isNumber(b) ? b : 2,
		e = goog.array.map(goog.array.range(d), function() {
			return []
		}),
		f = function() {
			var a = c.next();
			goog.array.forEach(e, function(b) {
				b.push(a)
			})
		};
	return goog.array.map(e, function(a) {
		var b = new goog.iter.Iterator;
		b.next = function() {
			goog.array.isEmpty(a) && f();
			goog.asserts.assert(!goog.array.isEmpty(a));
			return a.shift()
		};
		return b
	})
};
goog.iter.enumerate = function(a, b) {
	return goog.iter.zip(goog.iter.count(b), a)
};
goog.iter.limit = function(a, b) {
	goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
	var c = goog.iter.toIterator(a),
		d = new goog.iter.Iterator,
		e = b;
	d.next = function() {
		if (0 < e--) return c.next();
		throw goog.iter.StopIteration;
	};
	return d
};
goog.iter.consume = function(a, b) {
	goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
	for (var c = goog.iter.toIterator(a); 0 < b--;) goog.iter.nextOrValue(c, null);
	return c
};
goog.iter.slice = function(a, b, c) {
	goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
	a = goog.iter.consume(a, b);
	goog.isNumber(c) && (goog.asserts.assert(goog.math.isInt(c) && c >= b), a = goog.iter.limit(a, c - b));
	return a
};
goog.iter.hasDuplicates_ = function(a) {
	var b = [];
	goog.array.removeDuplicates(a, b);
	return a.length != b.length
};
goog.iter.permutations = function(a, b) {
	var c = goog.iter.toArray(a),
		d = goog.isNumber(b) ? b : c.length,
		c = goog.array.repeat(c, d),
		c = goog.iter.product.apply(void 0, c);
	return goog.iter.filter(c, function(a) {
		return !goog.iter.hasDuplicates_(a)
	})
};
goog.iter.combinations = function(a, b) {
	function c(a) {
		return d[a]
	}
	var d = goog.iter.toArray(a),
		e = goog.iter.range(d.length),
		e = goog.iter.permutations(e, b),
		f = goog.iter.filter(e, function(a) {
			return goog.array.isSorted(a)
		}),
		e = new goog.iter.Iterator;
	e.next = function() {
		return goog.array.map(f.next(), c)
	};
	return e
};
goog.iter.combinationsWithReplacement = function(a, b) {
	function c(a) {
		return d[a]
	}
	var d = goog.iter.toArray(a),
		e = goog.array.range(d.length),
		e = goog.array.repeat(e, b),
		e = goog.iter.product.apply(void 0, e),
		f = goog.iter.filter(e, function(a) {
			return goog.array.isSorted(a)
		}),
		e = new goog.iter.Iterator;
	e.next = function() {
		return goog.array.map(f.next(), c)
	};
	return e
};
goog.structs = {};
goog.structs.Map = function(a, b) {
	this.map_ = {};
	this.keys_ = [];
	this.version_ = this.count_ = 0;
	var c = arguments.length;
	if (1 < c) {
		if (c % 2) throw Error("Uneven number of arguments");
		for (var d = 0; d < c; d += 2) this.set(arguments[d], arguments[d + 1])
	} else a && this.addAll(a)
};
goog.structs.Map.prototype.getCount = function() {
	return this.count_
};
goog.structs.Map.prototype.getValues = function() {
	this.cleanupKeysArray_();
	for (var a = [], b = 0; b < this.keys_.length; b++) a.push(this.map_[this.keys_[b]]);
	return a
};
goog.structs.Map.prototype.getKeys = function() {
	this.cleanupKeysArray_();
	return this.keys_.concat()
};
goog.structs.Map.prototype.containsKey = function(a) {
	return goog.structs.Map.hasKey_(this.map_, a)
};
goog.structs.Map.prototype.containsValue = function(a) {
	for (var b = 0; b < this.keys_.length; b++) {
		var c = this.keys_[b];
		if (goog.structs.Map.hasKey_(this.map_, c) && this.map_[c] == a) return !0
	}
	return !1
};
goog.structs.Map.prototype.equals = function(a, b) {
	if (this === a) return !0;
	if (this.count_ != a.getCount()) return !1;
	var c = b || goog.structs.Map.defaultEquals;
	this.cleanupKeysArray_();
	for (var d, e = 0; d = this.keys_[e]; e++)
		if (!c(this.get(d), a.get(d))) return !1;
	return !0
};
goog.structs.Map.defaultEquals = function(a, b) {
	return a === b
};
goog.structs.Map.prototype.isEmpty = function() {
	return 0 == this.count_
};
goog.structs.Map.prototype.clear = function() {
	this.map_ = {};
	this.version_ = this.count_ = this.keys_.length = 0
};
goog.structs.Map.prototype.remove = function(a) {
	return goog.structs.Map.hasKey_(this.map_, a) ? (delete this.map_[a], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
	if (this.count_ != this.keys_.length) {
		for (var a = 0, b = 0; a < this.keys_.length;) {
			var c = this.keys_[a];
			goog.structs.Map.hasKey_(this.map_, c) && (this.keys_[b++] = c);
			a++
		}
		this.keys_.length = b
	}
	if (this.count_ != this.keys_.length) {
		for (var d = {}, b = a = 0; a < this.keys_.length;) c = this.keys_[a], goog.structs.Map.hasKey_(d, c) || (this.keys_[b++] = c, d[c] = 1), a++;
		this.keys_.length = b
	}
};
goog.structs.Map.prototype.get = function(a, b) {
	return goog.structs.Map.hasKey_(this.map_, a) ? this.map_[a] : b
};
goog.structs.Map.prototype.set = function(a, b) {
	goog.structs.Map.hasKey_(this.map_, a) || (this.count_++, this.keys_.push(a), this.version_++);
	this.map_[a] = b
};
goog.structs.Map.prototype.addAll = function(a) {
	var b;
	a instanceof goog.structs.Map ? (b = a.getKeys(), a = a.getValues()) : (b = goog.object.getKeys(a), a = goog.object.getValues(a));
	for (var c = 0; c < b.length; c++) this.set(b[c], a[c])
};
goog.structs.Map.prototype.forEach = function(a, b) {
	for (var c = this.getKeys(), d = 0; d < c.length; d++) {
		var e = c[d],
			f = this.get(e);
		a.call(b, f, e, this)
	}
};
goog.structs.Map.prototype.clone = function() {
	return new goog.structs.Map(this)
};
goog.structs.Map.prototype.transpose = function() {
	for (var a = new goog.structs.Map, b = 0; b < this.keys_.length; b++) {
		var c = this.keys_[b];
		a.set(this.map_[c], c)
	}
	return a
};
goog.structs.Map.prototype.toObject = function() {
	this.cleanupKeysArray_();
	for (var a = {}, b = 0; b < this.keys_.length; b++) {
		var c = this.keys_[b];
		a[c] = this.map_[c]
	}
	return a
};
goog.structs.Map.prototype.getKeyIterator = function() {
	return this.__iterator__(!0)
};
goog.structs.Map.prototype.getValueIterator = function() {
	return this.__iterator__(!1)
};
goog.structs.Map.prototype.__iterator__ = function(a) {
	this.cleanupKeysArray_();
	var b = 0,
		c = this.keys_,
		d = this.map_,
		e = this.version_,
		f = this,
		g = new goog.iter.Iterator;
	g.next = function() {
		for (;;) {
			if (e != f.version_) throw Error("The map has changed since the iterator was created");
			if (b >= c.length) throw goog.iter.StopIteration;
			var g = c[b++];
			return a ? g : d[g]
		}
	};
	return g
};
goog.structs.Map.hasKey_ = function(a, b) {
	return Object.prototype.hasOwnProperty.call(a, b)
};
goog.structs.getCount = function(a) {
	return "function" == typeof a.getCount ? a.getCount() : goog.isArrayLike(a) || goog.isString(a) ? a.length : goog.object.getCount(a)
};
goog.structs.getValues = function(a) {
	if ("function" == typeof a.getValues) return a.getValues();
	if (goog.isString(a)) return a.split("");
	if (goog.isArrayLike(a)) {
		for (var b = [], c = a.length, d = 0; d < c; d++) b.push(a[d]);
		return b
	}
	return goog.object.getValues(a)
};
goog.structs.getKeys = function(a) {
	if ("function" == typeof a.getKeys) return a.getKeys();
	if ("function" != typeof a.getValues) {
		if (goog.isArrayLike(a) || goog.isString(a)) {
			var b = [];
			a = a.length;
			for (var c = 0; c < a; c++) b.push(c);
			return b
		}
		return goog.object.getKeys(a)
	}
};
goog.structs.contains = function(a, b) {
	return "function" == typeof a.contains ? a.contains(b) : "function" == typeof a.containsValue ? a.containsValue(b) : goog.isArrayLike(a) || goog.isString(a) ? goog.array.contains(a, b) : goog.object.containsValue(a, b)
};
goog.structs.isEmpty = function(a) {
	return "function" == typeof a.isEmpty ? a.isEmpty() : goog.isArrayLike(a) || goog.isString(a) ? goog.array.isEmpty(a) : goog.object.isEmpty(a)
};
goog.structs.clear = function(a) {
	"function" == typeof a.clear ? a.clear() : goog.isArrayLike(a) ? goog.array.clear(a) : goog.object.clear(a)
};
goog.structs.forEach = function(a, b, c) {
	if ("function" == typeof a.forEach) a.forEach(b, c);
	else if (goog.isArrayLike(a) || goog.isString(a)) goog.array.forEach(a, b, c);
	else
		for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0; g < f; g++) b.call(c, e[g], d && d[g], a)
};
goog.structs.filter = function(a, b, c) {
	if ("function" == typeof a.filter) return a.filter(b, c);
	if (goog.isArrayLike(a) || goog.isString(a)) return goog.array.filter(a, b, c);
	var d, e = goog.structs.getKeys(a),
		f = goog.structs.getValues(a),
		g = f.length;
	if (e) {
		d = {};
		for (var h = 0; h < g; h++) b.call(c, f[h], e[h], a) && (d[e[h]] = f[h])
	} else
		for (d = [], h = 0; h < g; h++) b.call(c, f[h], void 0, a) && d.push(f[h]);
	return d
};
goog.structs.map = function(a, b, c) {
	if ("function" == typeof a.map) return a.map(b, c);
	if (goog.isArrayLike(a) || goog.isString(a)) return goog.array.map(a, b, c);
	var d, e = goog.structs.getKeys(a),
		f = goog.structs.getValues(a),
		g = f.length;
	if (e) {
		d = {};
		for (var h = 0; h < g; h++) d[e[h]] = b.call(c, f[h], e[h], a)
	} else
		for (d = [], h = 0; h < g; h++) d[h] = b.call(c, f[h], void 0, a);
	return d
};
goog.structs.some = function(a, b, c) {
	if ("function" == typeof a.some) return a.some(b, c);
	if (goog.isArrayLike(a) || goog.isString(a)) return goog.array.some(a, b, c);
	for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0; g < f; g++)
		if (b.call(c, e[g], d && d[g], a)) return !0;
	return !1
};
goog.structs.every = function(a, b, c) {
	if ("function" == typeof a.every) return a.every(b, c);
	if (goog.isArrayLike(a) || goog.isString(a)) return goog.array.every(a, b, c);
	for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0; g < f; g++)
		if (!b.call(c, e[g], d && d[g], a)) return !1;
	return !0
};
goog.Uri = function(a, b) {
	var c;
	a instanceof goog.Uri ? (this.ignoreCase_ = goog.isDef(b) ? b : a.getIgnoreCase(), this.setScheme(a.getScheme()), this.setUserInfo(a.getUserInfo()), this.setDomain(a.getDomain()), this.setPort(a.getPort()), this.setPath(a.getPath()), this.setQueryData(a.getQueryData().clone()), this.setFragment(a.getFragment())) : a && (c = goog.uri.utils.split(String(a))) ? (this.ignoreCase_ = !!b, this.setScheme(c[goog.uri.utils.ComponentIndex.SCHEME] || "", !0), this.setUserInfo(c[goog.uri.utils.ComponentIndex.USER_INFO] ||
		"", !0), this.setDomain(c[goog.uri.utils.ComponentIndex.DOMAIN] || "", !0), this.setPort(c[goog.uri.utils.ComponentIndex.PORT]), this.setPath(c[goog.uri.utils.ComponentIndex.PATH] || "", !0), this.setQueryData(c[goog.uri.utils.ComponentIndex.QUERY_DATA] || "", !0), this.setFragment(c[goog.uri.utils.ComponentIndex.FRAGMENT] || "", !0)) : (this.ignoreCase_ = !!b, this.queryData_ = new goog.Uri.QueryData(null, null, this.ignoreCase_))
};
goog.Uri.preserveParameterTypesCompatibilityFlag = !1;
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.scheme_ = "";
goog.Uri.prototype.userInfo_ = "";
goog.Uri.prototype.domain_ = "";
goog.Uri.prototype.port_ = null;
goog.Uri.prototype.path_ = "";
goog.Uri.prototype.fragment_ = "";
goog.Uri.prototype.isReadOnly_ = !1;
goog.Uri.prototype.ignoreCase_ = !1;
goog.Uri.prototype.toString = function() {
	var a = [],
		b = this.getScheme();
	b && a.push(goog.Uri.encodeSpecialChars_(b, goog.Uri.reDisallowedInSchemeOrUserInfo_), ":");
	if (b = this.getDomain()) {
		a.push("//");
		var c = this.getUserInfo();
		c && a.push(goog.Uri.encodeSpecialChars_(c, goog.Uri.reDisallowedInSchemeOrUserInfo_), "@");
		a.push(goog.string.urlEncode(b));
		b = this.getPort();
		null != b && a.push(":", String(b))
	}
	if (b = this.getPath()) this.hasDomain() && "/" != b.charAt(0) && a.push("/"), a.push(goog.Uri.encodeSpecialChars_(b, "/" == b.charAt(0) ?
		goog.Uri.reDisallowedInAbsolutePath_ : goog.Uri.reDisallowedInRelativePath_));
	(b = this.getEncodedQuery()) && a.push("?", b);
	(b = this.getFragment()) && a.push("#", goog.Uri.encodeSpecialChars_(b, goog.Uri.reDisallowedInFragment_));
	return a.join("")
};
goog.Uri.prototype.resolve = function(a) {
	var b = this.clone(),
		c = a.hasScheme();
	c ? b.setScheme(a.getScheme()) : c = a.hasUserInfo();
	c ? b.setUserInfo(a.getUserInfo()) : c = a.hasDomain();
	c ? b.setDomain(a.getDomain()) : c = a.hasPort();
	var d = a.getPath();
	if (c) b.setPort(a.getPort());
	else if (c = a.hasPath()) {
		if ("/" != d.charAt(0))
			if (this.hasDomain() && !this.hasPath()) d = "/" + d;
			else {
				var e = b.getPath().lastIndexOf("/"); - 1 != e && (d = b.getPath().substr(0, e + 1) + d)
			}
		d = goog.Uri.removeDotSegments(d)
	}
	c ? b.setPath(d) : c = a.hasQuery();
	c ? b.setQueryData(a.getDecodedQuery()) :
		c = a.hasFragment();
	c && b.setFragment(a.getFragment());
	return b
};
goog.Uri.prototype.clone = function() {
	return new goog.Uri(this)
};
goog.Uri.prototype.getScheme = function() {
	return this.scheme_
};
goog.Uri.prototype.setScheme = function(a, b) {
	this.enforceReadOnly();
	if (this.scheme_ = b ? goog.Uri.decodeOrEmpty_(a) : a) this.scheme_ = this.scheme_.replace(/:$/, "");
	return this
};
goog.Uri.prototype.hasScheme = function() {
	return !!this.scheme_
};
goog.Uri.prototype.getUserInfo = function() {
	return this.userInfo_
};
goog.Uri.prototype.setUserInfo = function(a, b) {
	this.enforceReadOnly();
	this.userInfo_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
	return this
};
goog.Uri.prototype.hasUserInfo = function() {
	return !!this.userInfo_
};
goog.Uri.prototype.getDomain = function() {
	return this.domain_
};
goog.Uri.prototype.setDomain = function(a, b) {
	this.enforceReadOnly();
	this.domain_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
	return this
};
goog.Uri.prototype.hasDomain = function() {
	return !!this.domain_
};
goog.Uri.prototype.getPort = function() {
	return this.port_
};
goog.Uri.prototype.setPort = function(a) {
	this.enforceReadOnly();
	if (a) {
		a = Number(a);
		if (isNaN(a) || 0 > a) throw Error("Bad port number " + a);
		this.port_ = a
	} else this.port_ = null;
	return this
};
goog.Uri.prototype.hasPort = function() {
	return null != this.port_
};
goog.Uri.prototype.getPath = function() {
	return this.path_
};
goog.Uri.prototype.setPath = function(a, b) {
	this.enforceReadOnly();
	this.path_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
	return this
};
goog.Uri.prototype.hasPath = function() {
	return !!this.path_
};
goog.Uri.prototype.hasQuery = function() {
	return "" !== this.queryData_.toString()
};
goog.Uri.prototype.setQueryData = function(a, b) {
	this.enforceReadOnly();
	a instanceof goog.Uri.QueryData ? (this.queryData_ = a, this.queryData_.setIgnoreCase(this.ignoreCase_)) : (b || (a = goog.Uri.encodeSpecialChars_(a, goog.Uri.reDisallowedInQuery_)), this.queryData_ = new goog.Uri.QueryData(a, null, this.ignoreCase_));
	return this
};
goog.Uri.prototype.setQuery = function(a, b) {
	return this.setQueryData(a, b)
};
goog.Uri.prototype.getEncodedQuery = function() {
	return this.queryData_.toString()
};
goog.Uri.prototype.getDecodedQuery = function() {
	return this.queryData_.toDecodedString()
};
goog.Uri.prototype.getQueryData = function() {
	return this.queryData_
};
goog.Uri.prototype.getQuery = function() {
	return this.getEncodedQuery()
};
goog.Uri.prototype.setParameterValue = function(a, b) {
	this.enforceReadOnly();
	this.queryData_.set(a, b);
	return this
};
goog.Uri.prototype.setParameterValues = function(a, b) {
	this.enforceReadOnly();
	goog.isArray(b) || (b = [String(b)]);
	this.queryData_.setValues(a, b);
	return this
};
goog.Uri.prototype.getParameterValues = function(a) {
	return this.queryData_.getValues(a)
};
goog.Uri.prototype.getParameterValue = function(a) {
	return this.queryData_.get(a)
};
goog.Uri.prototype.getFragment = function() {
	return this.fragment_
};
goog.Uri.prototype.setFragment = function(a, b) {
	this.enforceReadOnly();
	this.fragment_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
	return this
};
goog.Uri.prototype.hasFragment = function() {
	return !!this.fragment_
};
goog.Uri.prototype.hasSameDomainAs = function(a) {
	return (!this.hasDomain() && !a.hasDomain() || this.getDomain() == a.getDomain()) && (!this.hasPort() && !a.hasPort() || this.getPort() == a.getPort())
};
goog.Uri.prototype.makeUnique = function() {
	this.enforceReadOnly();
	this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
	return this
};
goog.Uri.prototype.removeParameter = function(a) {
	this.enforceReadOnly();
	this.queryData_.remove(a);
	return this
};
goog.Uri.prototype.setReadOnly = function(a) {
	this.isReadOnly_ = a;
	return this
};
goog.Uri.prototype.isReadOnly = function() {
	return this.isReadOnly_
};
goog.Uri.prototype.enforceReadOnly = function() {
	if (this.isReadOnly_) throw Error("Tried to modify a read-only Uri");
};
goog.Uri.prototype.setIgnoreCase = function(a) {
	this.ignoreCase_ = a;
	this.queryData_ && this.queryData_.setIgnoreCase(a);
	return this
};
goog.Uri.prototype.getIgnoreCase = function() {
	return this.ignoreCase_
};
goog.Uri.parse = function(a, b) {
	return a instanceof goog.Uri ? a.clone() : new goog.Uri(a, b)
};
goog.Uri.create = function(a, b, c, d, e, f, g, h) {
	h = new goog.Uri(null, h);
	a && h.setScheme(a);
	b && h.setUserInfo(b);
	c && h.setDomain(c);
	d && h.setPort(d);
	e && h.setPath(e);
	f && h.setQueryData(f);
	g && h.setFragment(g);
	return h
};
goog.Uri.resolve = function(a, b) {
	a instanceof goog.Uri || (a = goog.Uri.parse(a));
	b instanceof goog.Uri || (b = goog.Uri.parse(b));
	return a.resolve(b)
};
goog.Uri.removeDotSegments = function(a) {
	if (".." == a || "." == a) return "";
	if (goog.string.contains(a, "./") || goog.string.contains(a, "/.")) {
		var b = goog.string.startsWith(a, "/");
		a = a.split("/");
		for (var c = [], d = 0; d < a.length;) {
			var e = a[d++];
			"." == e ? b && d == a.length && c.push("") : ".." == e ? ((1 < c.length || 1 == c.length && "" != c[0]) && c.pop(), b && d == a.length && c.push("")) : (c.push(e), b = !0)
		}
		return c.join("/")
	}
	return a
};
goog.Uri.decodeOrEmpty_ = function(a) {
	return a ? decodeURIComponent(a) : ""
};
goog.Uri.encodeSpecialChars_ = function(a, b) {
	return goog.isString(a) ? encodeURI(a).replace(b, goog.Uri.encodeChar_) : null
};
goog.Uri.encodeChar_ = function(a) {
	a = a.charCodeAt(0);
	return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInRelativePath_ = /[\#\?:]/g;
goog.Uri.reDisallowedInAbsolutePath_ = /[\#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[\#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(a, b) {
	var c = goog.uri.utils.split(a),
		d = goog.uri.utils.split(b);
	return c[goog.uri.utils.ComponentIndex.DOMAIN] == d[goog.uri.utils.ComponentIndex.DOMAIN] && c[goog.uri.utils.ComponentIndex.PORT] == d[goog.uri.utils.ComponentIndex.PORT]
};
goog.Uri.QueryData = function(a, b, c) {
	this.encodedQuery_ = a || null;
	this.ignoreCase_ = !!c
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
	if (!this.keyMap_ && (this.keyMap_ = new goog.structs.Map, this.count_ = 0, this.encodedQuery_))
		for (var a = this.encodedQuery_.split("&"), b = 0; b < a.length; b++) {
			var c = a[b].indexOf("="),
				d = null,
				e = null;
			0 <= c ? (d = a[b].substring(0, c), e = a[b].substring(c + 1)) : d = a[b];
			d = goog.string.urlDecode(d);
			d = this.getKeyName_(d);
			this.add(d, e ? goog.string.urlDecode(e) : "")
		}
};
goog.Uri.QueryData.createFromMap = function(a, b, c) {
	b = goog.structs.getKeys(a);
	if ("undefined" == typeof b) throw Error("Keys are undefined");
	c = new goog.Uri.QueryData(null, null, c);
	a = goog.structs.getValues(a);
	for (var d = 0; d < b.length; d++) {
		var e = b[d],
			f = a[d];
		goog.isArray(f) ? c.setValues(e, f) : c.add(e, f)
	}
	return c
};
goog.Uri.QueryData.createFromKeysValues = function(a, b, c, d) {
	if (a.length != b.length) throw Error("Mismatched lengths for keys/values");
	c = new goog.Uri.QueryData(null, null, d);
	for (d = 0; d < a.length; d++) c.add(a[d], b[d]);
	return c
};
goog.Uri.QueryData.prototype.keyMap_ = null;
goog.Uri.QueryData.prototype.count_ = null;
goog.Uri.QueryData.prototype.getCount = function() {
	this.ensureKeyMapInitialized_();
	return this.count_
};
goog.Uri.QueryData.prototype.add = function(a, b) {
	this.ensureKeyMapInitialized_();
	this.invalidateCache_();
	a = this.getKeyName_(a);
	var c = this.keyMap_.get(a);
	c || this.keyMap_.set(a, c = []);
	c.push(b);
	this.count_++;
	return this
};
goog.Uri.QueryData.prototype.remove = function(a) {
	this.ensureKeyMapInitialized_();
	a = this.getKeyName_(a);
	return this.keyMap_.containsKey(a) ? (this.invalidateCache_(), this.count_ -= this.keyMap_.get(a).length, this.keyMap_.remove(a)) : !1
};
goog.Uri.QueryData.prototype.clear = function() {
	this.invalidateCache_();
	this.keyMap_ = null;
	this.count_ = 0
};
goog.Uri.QueryData.prototype.isEmpty = function() {
	this.ensureKeyMapInitialized_();
	return 0 == this.count_
};
goog.Uri.QueryData.prototype.containsKey = function(a) {
	this.ensureKeyMapInitialized_();
	a = this.getKeyName_(a);
	return this.keyMap_.containsKey(a)
};
goog.Uri.QueryData.prototype.containsValue = function(a) {
	var b = this.getValues();
	return goog.array.contains(b, a)
};
goog.Uri.QueryData.prototype.getKeys = function() {
	this.ensureKeyMapInitialized_();
	for (var a = this.keyMap_.getValues(), b = this.keyMap_.getKeys(), c = [], d = 0; d < b.length; d++)
		for (var e = a[d], f = 0; f < e.length; f++) c.push(b[d]);
	return c
};
goog.Uri.QueryData.prototype.getValues = function(a) {
	this.ensureKeyMapInitialized_();
	var b = [];
	if (goog.isString(a)) this.containsKey(a) && (b = goog.array.concat(b, this.keyMap_.get(this.getKeyName_(a))));
	else {
		a = this.keyMap_.getValues();
		for (var c = 0; c < a.length; c++) b = goog.array.concat(b, a[c])
	}
	return b
};
goog.Uri.QueryData.prototype.set = function(a, b) {
	this.ensureKeyMapInitialized_();
	this.invalidateCache_();
	a = this.getKeyName_(a);
	this.containsKey(a) && (this.count_ -= this.keyMap_.get(a).length);
	this.keyMap_.set(a, [b]);
	this.count_++;
	return this
};
goog.Uri.QueryData.prototype.get = function(a, b) {
	var c = a ? this.getValues(a) : [];
	return goog.Uri.preserveParameterTypesCompatibilityFlag ? 0 < c.length ? c[0] : b : 0 < c.length ? String(c[0]) : b
};
goog.Uri.QueryData.prototype.setValues = function(a, b) {
	this.remove(a);
	0 < b.length && (this.invalidateCache_(), this.keyMap_.set(this.getKeyName_(a), goog.array.clone(b)), this.count_ += b.length)
};
goog.Uri.QueryData.prototype.toString = function() {
	if (this.encodedQuery_) return this.encodedQuery_;
	if (!this.keyMap_) return "";
	for (var a = [], b = this.keyMap_.getKeys(), c = 0; c < b.length; c++)
		for (var d = b[c], e = goog.string.urlEncode(d), d = this.getValues(d), f = 0; f < d.length; f++) {
			var g = e;
			"" !== d[f] && (g += "=" + goog.string.urlEncode(d[f]));
			a.push(g)
		}
	return this.encodedQuery_ = a.join("&")
};
goog.Uri.QueryData.prototype.toDecodedString = function() {
	return goog.Uri.decodeOrEmpty_(this.toString())
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
	this.encodedQuery_ = null
};
goog.Uri.QueryData.prototype.filterKeys = function(a) {
	this.ensureKeyMapInitialized_();
	this.keyMap_.forEach(function(b, c) {
		goog.array.contains(a, c) || this.remove(c)
	}, this);
	return this
};
goog.Uri.QueryData.prototype.clone = function() {
	var a = new goog.Uri.QueryData;
	a.encodedQuery_ = this.encodedQuery_;
	this.keyMap_ && (a.keyMap_ = this.keyMap_.clone(), a.count_ = this.count_);
	return a
};
goog.Uri.QueryData.prototype.getKeyName_ = function(a) {
	a = String(a);
	this.ignoreCase_ && (a = a.toLowerCase());
	return a
};
goog.Uri.QueryData.prototype.setIgnoreCase = function(a) {
	a && !this.ignoreCase_ && (this.ensureKeyMapInitialized_(), this.invalidateCache_(), this.keyMap_.forEach(function(a, c) {
		var d = c.toLowerCase();
		c != d && (this.remove(c), this.setValues(d, a))
	}, this));
	this.ignoreCase_ = a
};
goog.Uri.QueryData.prototype.extend = function(a) {
	for (var b = 0; b < arguments.length; b++) goog.structs.forEach(arguments[b], function(a, b) {
		this.add(b, a)
	}, this)
};
goog.Timer = function(a, b) {
	goog.events.EventTarget.call(this);
	this.interval_ = a || 1;
	this.timerObject_ = b || goog.Timer.defaultTimerObject;
	this.boundTick_ = goog.bind(this.tick_, this);
	this.last_ = goog.now()
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.prototype.enabled = !1;
goog.Timer.defaultTimerObject = goog.global;
goog.Timer.intervalScale = .8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.getInterval = function() {
	return this.interval_
};
goog.Timer.prototype.setInterval = function(a) {
	this.interval_ = a;
	this.timer_ && this.enabled ? (this.stop(), this.start()) : this.timer_ && this.stop()
};
goog.Timer.prototype.tick_ = function() {
	if (this.enabled) {
		var a = goog.now() - this.last_;
		0 < a && a < this.interval_ * goog.Timer.intervalScale ? this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - a) : (this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null), this.dispatchTick(), this.enabled && (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now()))
	}
};
goog.Timer.prototype.dispatchTick = function() {
	this.dispatchEvent(goog.Timer.TICK)
};
goog.Timer.prototype.start = function() {
	this.enabled = !0;
	this.timer_ || (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now())
};
goog.Timer.prototype.stop = function() {
	this.enabled = !1;
	this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null)
};
goog.Timer.prototype.disposeInternal = function() {
	goog.Timer.superClass_.disposeInternal.call(this);
	this.stop();
	delete this.timerObject_
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(a, b, c) {
	if (goog.isFunction(a)) c && (a = goog.bind(a, c));
	else if (a && "function" == typeof a.handleEvent) a = goog.bind(a.handleEvent, a);
	else throw Error("Invalid listener argument");
	return b > goog.Timer.MAX_TIMEOUT_ ? -1 : goog.Timer.defaultTimerObject.setTimeout(a, b || 0)
};
goog.Timer.clear = function(a) {
	goog.Timer.defaultTimerObject.clearTimeout(a)
};
goog.async = {};
goog.async.Delay = function(a, b, c) {
	goog.Disposable.call(this);
	this.listener_ = a;
	this.interval_ = b || 0;
	this.handler_ = c;
	this.callback_ = goog.bind(this.doAction_, this)
};
goog.inherits(goog.async.Delay, goog.Disposable);
goog.Delay = goog.async.Delay;
goog.async.Delay.prototype.id_ = 0;
goog.async.Delay.prototype.disposeInternal = function() {
	goog.async.Delay.superClass_.disposeInternal.call(this);
	this.stop();
	delete this.listener_;
	delete this.handler_
};
goog.async.Delay.prototype.start = function(a) {
	this.stop();
	this.id_ = goog.Timer.callOnce(this.callback_, goog.isDef(a) ? a : this.interval_)
};
goog.async.Delay.prototype.stop = function() {
	this.isActive() && goog.Timer.clear(this.id_);
	this.id_ = 0
};
goog.async.Delay.prototype.fire = function() {
	this.stop();
	this.doAction_()
};
goog.async.Delay.prototype.fireIfActive = function() {
	this.isActive() && this.fire()
};
goog.async.Delay.prototype.isActive = function() {
	return 0 != this.id_
};
goog.async.Delay.prototype.doAction_ = function() {
	this.id_ = 0;
	this.listener_ && this.listener_.call(this.handler_)
};
goog.async.AnimationDelay = function(a, b, c) {
	goog.Disposable.call(this);
	this.listener_ = a;
	this.handler_ = c;
	this.win_ = b || window;
	this.callback_ = goog.bind(this.doAction_, this)
};
goog.inherits(goog.async.AnimationDelay, goog.Disposable);
goog.async.AnimationDelay.prototype.id_ = null;
goog.async.AnimationDelay.prototype.usingListeners_ = !1;
goog.async.AnimationDelay.TIMEOUT = 20;
goog.async.AnimationDelay.MOZ_BEFORE_PAINT_EVENT_ = "MozBeforePaint";
goog.async.AnimationDelay.prototype.start = function() {
	this.stop();
	this.usingListeners_ = !1;
	var a = this.getRaf_(),
		b = this.getCancelRaf_();
	a && !b && this.win_.mozRequestAnimationFrame ? (this.id_ = goog.events.listen(this.win_, goog.async.AnimationDelay.MOZ_BEFORE_PAINT_EVENT_, this.callback_), this.win_.mozRequestAnimationFrame(null), this.usingListeners_ = !0) : this.id_ = a && b ? a.call(this.win_, this.callback_) : this.win_.setTimeout(goog.functions.lock(this.callback_), goog.async.AnimationDelay.TIMEOUT)
};
goog.async.AnimationDelay.prototype.stop = function() {
	if (this.isActive()) {
		var a = this.getRaf_(),
			b = this.getCancelRaf_();
		a && !b && this.win_.mozRequestAnimationFrame ? goog.events.unlistenByKey(this.id_) : a && b ? b.call(this.win_, this.id_) : this.win_.clearTimeout(this.id_)
	}
	this.id_ = null
};
goog.async.AnimationDelay.prototype.fire = function() {
	this.stop();
	this.doAction_()
};
goog.async.AnimationDelay.prototype.fireIfActive = function() {
	this.isActive() && this.fire()
};
goog.async.AnimationDelay.prototype.isActive = function() {
	return null != this.id_
};
goog.async.AnimationDelay.prototype.doAction_ = function() {
	this.usingListeners_ && this.id_ && goog.events.unlistenByKey(this.id_);
	this.id_ = null;
	this.listener_.call(this.handler_, goog.now())
};
goog.async.AnimationDelay.prototype.disposeInternal = function() {
	this.stop();
	goog.async.AnimationDelay.superClass_.disposeInternal.call(this)
};
goog.async.AnimationDelay.prototype.getRaf_ = function() {
	var a = this.win_;
	return a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame || a.oRequestAnimationFrame || a.msRequestAnimationFrame || null
};
goog.async.AnimationDelay.prototype.getCancelRaf_ = function() {
	var a = this.win_;
	return a.cancelRequestAnimationFrame || a.webkitCancelRequestAnimationFrame || a.mozCancelRequestAnimationFrame || a.oCancelRequestAnimationFrame || a.msCancelRequestAnimationFrame || null
};
goog.fx = {};
goog.fx.anim = {};
goog.fx.anim.Animated = function() {};
goog.fx.anim.TIMEOUT = goog.async.AnimationDelay.TIMEOUT;
goog.fx.anim.activeAnimations_ = {};
goog.fx.anim.animationWindow_ = null;
goog.fx.anim.animationDelay_ = null;
goog.fx.anim.registerAnimation = function(a) {
	var b = goog.getUid(a);
	b in goog.fx.anim.activeAnimations_ || (goog.fx.anim.activeAnimations_[b] = a);
	goog.fx.anim.requestAnimationFrame_()
};
goog.fx.anim.unregisterAnimation = function(a) {
	a = goog.getUid(a);
	delete goog.fx.anim.activeAnimations_[a];
	goog.object.isEmpty(goog.fx.anim.activeAnimations_) && goog.fx.anim.cancelAnimationFrame_()
};
goog.fx.anim.tearDown = function() {
	goog.fx.anim.animationWindow_ = null;
	goog.dispose(goog.fx.anim.animationDelay_);
	goog.fx.anim.animationDelay_ = null;
	goog.fx.anim.activeAnimations_ = {}
};
goog.fx.anim.setAnimationWindow = function(a) {
	var b = goog.fx.anim.animationDelay_ && goog.fx.anim.animationDelay_.isActive();
	goog.dispose(goog.fx.anim.animationDelay_);
	goog.fx.anim.animationDelay_ = null;
	goog.fx.anim.animationWindow_ = a;
	b && goog.fx.anim.requestAnimationFrame_()
};
goog.fx.anim.requestAnimationFrame_ = function() {
	goog.fx.anim.animationDelay_ || (goog.fx.anim.animationDelay_ = goog.fx.anim.animationWindow_ ? new goog.async.AnimationDelay(function(a) {
		goog.fx.anim.cycleAnimations_(a)
	}, goog.fx.anim.animationWindow_) : new goog.async.Delay(function() {
		goog.fx.anim.cycleAnimations_(goog.now())
	}, goog.fx.anim.TIMEOUT));
	var a = goog.fx.anim.animationDelay_;
	a.isActive() || a.start()
};
goog.fx.anim.cancelAnimationFrame_ = function() {
	goog.fx.anim.animationDelay_ && goog.fx.anim.animationDelay_.stop()
};
goog.fx.anim.cycleAnimations_ = function(a) {
	goog.object.forEach(goog.fx.anim.activeAnimations_, function(b) {
		b.onAnimationFrame(a)
	});
	goog.object.isEmpty(goog.fx.anim.activeAnimations_) || goog.fx.anim.requestAnimationFrame_()
};
goog.fx.Transition = function() {};
goog.fx.Transition.EventType = {
	PLAY: "play",
	BEGIN: "begin",
	RESUME: "resume",
	END: "end",
	STOP: "stop",
	FINISH: "finish",
	PAUSE: "pause"
};
goog.fx.TransitionBase = function() {
	goog.events.EventTarget.call(this);
	this.state_ = goog.fx.TransitionBase.State.STOPPED;
	this.endTime = this.startTime = null
};
goog.inherits(goog.fx.TransitionBase, goog.events.EventTarget);
goog.fx.TransitionBase.State = {
	STOPPED: 0,
	PAUSED: -1,
	PLAYING: 1
};
goog.fx.TransitionBase.prototype.getStateInternal = function() {
	return this.state_
};
goog.fx.TransitionBase.prototype.setStatePlaying = function() {
	this.state_ = goog.fx.TransitionBase.State.PLAYING
};
goog.fx.TransitionBase.prototype.setStatePaused = function() {
	this.state_ = goog.fx.TransitionBase.State.PAUSED
};
goog.fx.TransitionBase.prototype.setStateStopped = function() {
	this.state_ = goog.fx.TransitionBase.State.STOPPED
};
goog.fx.TransitionBase.prototype.isPlaying = function() {
	return this.state_ == goog.fx.TransitionBase.State.PLAYING
};
goog.fx.TransitionBase.prototype.isPaused = function() {
	return this.state_ == goog.fx.TransitionBase.State.PAUSED
};
goog.fx.TransitionBase.prototype.isStopped = function() {
	return this.state_ == goog.fx.TransitionBase.State.STOPPED
};
goog.fx.TransitionBase.prototype.onBegin = function() {
	this.dispatchAnimationEvent(goog.fx.Transition.EventType.BEGIN)
};
goog.fx.TransitionBase.prototype.onEnd = function() {
	this.dispatchAnimationEvent(goog.fx.Transition.EventType.END)
};
goog.fx.TransitionBase.prototype.onFinish = function() {
	this.dispatchAnimationEvent(goog.fx.Transition.EventType.FINISH)
};
goog.fx.TransitionBase.prototype.onPause = function() {
	this.dispatchAnimationEvent(goog.fx.Transition.EventType.PAUSE)
};
goog.fx.TransitionBase.prototype.onPlay = function() {
	this.dispatchAnimationEvent(goog.fx.Transition.EventType.PLAY)
};
goog.fx.TransitionBase.prototype.onResume = function() {
	this.dispatchAnimationEvent(goog.fx.Transition.EventType.RESUME)
};
goog.fx.TransitionBase.prototype.onStop = function() {
	this.dispatchAnimationEvent(goog.fx.Transition.EventType.STOP)
};
goog.fx.TransitionBase.prototype.dispatchAnimationEvent = function(a) {
	this.dispatchEvent(a)
};
goog.fx.Animation = function(a, b, c, d) {
	goog.fx.TransitionBase.call(this);
	if (!goog.isArray(a) || !goog.isArray(b)) throw Error("Start and end parameters must be arrays");
	if (a.length != b.length) throw Error("Start and end points must be the same length");
	this.startPoint = a;
	this.endPoint = b;
	this.duration = c;
	this.accel_ = d;
	this.coords = [];
	this.useRightPositioningForRtl_ = !1
};
goog.inherits(goog.fx.Animation, goog.fx.TransitionBase);
goog.fx.Animation.prototype.enableRightPositioningForRtl = function(a) {
	this.useRightPositioningForRtl_ = a
};
goog.fx.Animation.prototype.isRightPositioningForRtlEnabled = function() {
	return this.useRightPositioningForRtl_
};
goog.fx.Animation.EventType = {
	PLAY: goog.fx.Transition.EventType.PLAY,
	BEGIN: goog.fx.Transition.EventType.BEGIN,
	RESUME: goog.fx.Transition.EventType.RESUME,
	END: goog.fx.Transition.EventType.END,
	STOP: goog.fx.Transition.EventType.STOP,
	FINISH: goog.fx.Transition.EventType.FINISH,
	PAUSE: goog.fx.Transition.EventType.PAUSE,
	ANIMATE: "animate",
	DESTROY: "destroy"
};
goog.fx.Animation.TIMEOUT = goog.fx.anim.TIMEOUT;
goog.fx.Animation.State = goog.fx.TransitionBase.State;
goog.fx.Animation.setAnimationWindow = function(a) {
	goog.fx.anim.setAnimationWindow(a)
};
goog.fx.Animation.prototype.fps_ = 0;
goog.fx.Animation.prototype.progress = 0;
goog.fx.Animation.prototype.lastFrame = null;
goog.fx.Animation.prototype.play = function(a) {
	if (a || this.isStopped()) this.progress = 0, this.coords = this.startPoint;
	else if (this.isPlaying()) return !1;
	goog.fx.anim.unregisterAnimation(this);
	this.startTime = a = goog.now();
	this.isPaused() && (this.startTime -= this.duration * this.progress);
	this.endTime = this.startTime + this.duration;
	this.lastFrame = this.startTime;
	if (!this.progress) this.onBegin();
	this.onPlay();
	if (this.isPaused()) this.onResume();
	this.setStatePlaying();
	goog.fx.anim.registerAnimation(this);
	this.cycle(a);
	return !0
};
goog.fx.Animation.prototype.stop = function(a) {
	goog.fx.anim.unregisterAnimation(this);
	this.setStateStopped();
	a && (this.progress = 1);
	this.updateCoords_(this.progress);
	this.onStop();
	this.onEnd()
};
goog.fx.Animation.prototype.pause = function() {
	this.isPlaying() && (goog.fx.anim.unregisterAnimation(this), this.setStatePaused(), this.onPause())
};
goog.fx.Animation.prototype.getProgress = function() {
	return this.progress
};
goog.fx.Animation.prototype.setProgress = function(a) {
	this.progress = a;
	this.isPlaying() && (this.startTime = goog.now() - this.duration * this.progress, this.endTime = this.startTime + this.duration)
};
goog.fx.Animation.prototype.disposeInternal = function() {
	this.isStopped() || this.stop(!1);
	this.onDestroy();
	goog.fx.Animation.superClass_.disposeInternal.call(this)
};
goog.fx.Animation.prototype.destroy = function() {
	this.dispose()
};
goog.fx.Animation.prototype.onAnimationFrame = function(a) {
	this.cycle(a)
};
goog.fx.Animation.prototype.cycle = function(a) {
	this.progress = (a - this.startTime) / (this.endTime - this.startTime);
	1 <= this.progress && (this.progress = 1);
	this.fps_ = 1E3 / (a - this.lastFrame);
	this.lastFrame = a;
	this.updateCoords_(this.progress);
	if (1 == this.progress) this.setStateStopped(), goog.fx.anim.unregisterAnimation(this), this.onFinish(), this.onEnd();
	else if (this.isPlaying()) this.onAnimate()
};
goog.fx.Animation.prototype.updateCoords_ = function(a) {
	goog.isFunction(this.accel_) && (a = this.accel_(a));
	this.coords = Array(this.startPoint.length);
	for (var b = 0; b < this.startPoint.length; b++) this.coords[b] = (this.endPoint[b] - this.startPoint[b]) * a + this.startPoint[b]
};
goog.fx.Animation.prototype.onAnimate = function() {
	this.dispatchAnimationEvent(goog.fx.Animation.EventType.ANIMATE)
};
goog.fx.Animation.prototype.onDestroy = function() {
	this.dispatchAnimationEvent(goog.fx.Animation.EventType.DESTROY)
};
goog.fx.Animation.prototype.dispatchAnimationEvent = function(a) {
	this.dispatchEvent(new goog.fx.AnimationEvent(a, this))
};
goog.fx.AnimationEvent = function(a, b) {
	goog.events.Event.call(this, a);
	this.coords = b.coords;
	this.x = b.coords[0];
	this.y = b.coords[1];
	this.z = b.coords[2];
	this.duration = b.duration;
	this.progress = b.getProgress();
	this.fps = b.fps_;
	this.state = b.getStateInternal();
	this.anim = b
};
goog.inherits(goog.fx.AnimationEvent, goog.events.Event);
goog.fx.AnimationEvent.prototype.coordsAsInts = function() {
	return goog.array.map(this.coords, Math.round)
};
goog.math.Line = function(a, b, c, d) {
	this.x0 = a;
	this.y0 = b;
	this.x1 = c;
	this.y1 = d
};
goog.math.Line.prototype.clone = function() {
	return new goog.math.Line(this.x0, this.y0, this.x1, this.y1)
};
goog.math.Line.prototype.equals = function(a) {
	return this.x0 == a.x0 && this.y0 == a.y0 && this.x1 == a.x1 && this.y1 == a.y1
};
goog.math.Line.prototype.getSegmentLengthSquared = function() {
	var a = this.x1 - this.x0,
		b = this.y1 - this.y0;
	return a * a + b * b
};
goog.math.Line.prototype.getSegmentLength = function() {
	return Math.sqrt(this.getSegmentLengthSquared())
};
goog.math.Line.prototype.getClosestLinearInterpolation_ = function(a, b) {
	var c;
	a instanceof goog.math.Coordinate ? (c = a.y, a = a.x) : c = b;
	var d = this.x0,
		e = this.y0;
	return ((a - d) * (this.x1 - d) + (c - e) * (this.y1 - e)) / this.getSegmentLengthSquared()
};
goog.math.Line.prototype.getInterpolatedPoint = function(a) {
	return new goog.math.Coordinate(goog.math.lerp(this.x0, this.x1, a), goog.math.lerp(this.y0, this.y1, a))
};
goog.math.Line.prototype.getClosestPoint = function(a, b) {
	return this.getInterpolatedPoint(this.getClosestLinearInterpolation_(a, b))
};
goog.math.Line.prototype.getClosestSegmentPoint = function(a, b) {
	return this.getInterpolatedPoint(goog.math.clamp(this.getClosestLinearInterpolation_(a, b), 0, 1))
};
goog.fx.easing = {};
goog.fx.easing.easeIn = function(a) {
	return goog.fx.easing.easeInInternal_(a, 3)
};
goog.fx.easing.easeInInternal_ = function(a, b) {
	return Math.pow(a, b)
};
goog.fx.easing.easeOut = function(a) {
	return goog.fx.easing.easeOutInternal_(a, 3)
};
goog.fx.easing.easeOutInternal_ = function(a, b) {
	return 1 - goog.fx.easing.easeInInternal_(1 - a, b)
};
goog.fx.easing.easeOutLong = function(a) {
	return goog.fx.easing.easeOutInternal_(a, 4)
};
goog.fx.easing.inAndOut = function(a) {
	return 3 * a * a - 2 * a * a * a
};
var gweb = {
	ui: {}
};
gweb.ui.SmoothScroll = function() {
	goog.events.EventTarget.call(this);
	this.scrollDuration_ = 600;
	this.scrollSpeed_ = 1;
	this.scrollTimingFn_ = goog.fx.easing.easeOut;
	this.scrollOffset_ = new goog.math.Coordinate(0, 0);
	this.currentCoord_ = this.getCurrentCoord_();
	this.dom_ = new goog.dom.getDomHelper;
	this.eventHandler_ = new goog.events.EventHandler(this)
};
goog.inherits(gweb.ui.SmoothScroll, goog.events.EventTarget);
gweb.ui.SmoothScroll.Class = {
	ANCHOR: "gweb-smoothscroll-control"
};
gweb.ui.SmoothScroll.Position = {
	TOP: "top",
	BOTTOM: "bottom"
};
gweb.ui.SmoothScroll.EventType = {
	SCROLL_END: goog.events.getUniqueId("scroll_end"),
	SCROLL_START: goog.events.getUniqueId("scroll_start")
};
gweb.ui.SmoothScroll.prototype.getCurrentCoord_ = function() {
	return goog.dom.getDocumentScroll()
};
gweb.ui.SmoothScroll.prototype.getPositionFromPreset_ = function(a) {
	var b;
	switch (a) {
		case gweb.ui.SmoothScroll.Position.TOP:
			b = new goog.math.Coordinate(0, 0);
			break;
		case gweb.ui.SmoothScroll.Position.BOTTOM:
			b = new goog.math.Coordinate(0, this.dom_.getDocumentHeight())
	}
	return b
};
gweb.ui.SmoothScroll.prototype.setDuration = function(a) {
	goog.asserts.assertNumber(a, "setDuration expects a number argument.");
	this.scrollDuration_ = a
};
gweb.ui.SmoothScroll.prototype.setSpeed = function(a) {
	goog.asserts.assertNumber(a, "setSpeed expects a number argument.");
	this.scrollSpeed_ = a
};
gweb.ui.SmoothScroll.prototype.setTimingFunction = function(a) {
	goog.asserts.assertFunction(a, "setTimingFunction expects a function argument.");
	this.scrollTimingFn_ = a
};
gweb.ui.SmoothScroll.prototype.setOffset = function(a) {
	this.scrollOffset_ = a
};
gweb.ui.SmoothScroll.prototype.scrollTo = function(a, b) {
	this.currentCoord_ = this.getCurrentCoord_();
	a = this.applyOffset_(a, b || this.scrollOffset_);
	var c = this.calculateScrollDuration_(),
		c = new goog.fx.Animation([this.currentCoord_.x, this.currentCoord_.y], [a.x, a.y], c, this.scrollTimingFn_);
	this.initScrollListeners_(c);
	c.play()
};
gweb.ui.SmoothScroll.prototype.initScrollListeners_ = function(a) {
	this.eventHandler_.listen(a, [goog.fx.Animation.EventType.BEGIN, goog.fx.Animation.EventType.FINISH, goog.fx.Animation.EventType.ANIMATE], this.handleScrollEvent_)
};
gweb.ui.SmoothScroll.prototype.handleScrollEvent_ = function(a) {
	switch (a.type) {
		case "begin":
			this.dispatchEvent(gweb.ui.SmoothScroll.EventType.SCROLL_START);
			break;
		case "finish":
			this.scroll_(a.x, a.y);
			this.dispatchEvent(gweb.ui.SmoothScroll.EventType.SCROLL_END);
			a.dispose();
			break;
		case "animate":
			this.scroll_(a.x, a.y)
	}
};
gweb.ui.SmoothScroll.prototype.scroll_ = function(a, b) {
	window.scrollTo(a, b)
};
gweb.ui.SmoothScroll.prototype.applyOffset_ = function(a, b) {
	return new goog.math.Coordinate(b.x + a.x, b.y + a.y)
};
gweb.ui.SmoothScroll.prototype.calculateScrollDuration_ = function() {
	return this.scrollSpeed_ * this.scrollDuration_
};
gweb.ui.SmoothScroll.prototype.scrollToElement = function(a, b) {
	var c = goog.style.getPageOffset(a);
	this.scrollTo(c, b)
};
gweb.ui.SmoothScroll.prototype.scrollToPreset = function(a) {
	a = this.getPositionFromPreset_(a);
	this.scrollTo(a)
};
gweb.ui.SmoothScroll.prototype.decorateControls = function(a) {
	if (a = goog.dom.getElementsByTagNameAndClass("a", gweb.ui.SmoothScroll.Class.ANCHOR, a || null))
		for (var b = 0, c; c = a[b]; b++) {
			var d;
			this.isValidURL_(c.href) && (d = c.href.match(/(#)(.*)/)[2], d = goog.dom.getElement(d));
			d && this.eventHandler_.listen(c, goog.events.EventType.CLICK, this.handleControlClick_)
		}
};
gweb.ui.SmoothScroll.prototype.handleControlClick_ = function(a) {
	a.preventDefault();
	a = a.target;
	var b = goog.dom.getAncestorByTagNameAndClass(a, "A", gweb.ui.SmoothScroll.Class.ANCHOR);
	b && (a = b);
	a = a.href.match(/(#)(.*)/)[2];
	b = goog.dom.getElement(a);
	this.enableTempId_(b, !0);
	this.scrollToElement(b);
	window.location.hash = a;
	this.enableTempId_(b, !1)
};
gweb.ui.SmoothScroll.prototype.enableTempId_ = function(a, b) {
	var c = a.id.match("_temp");
	b != c && (a.id = b ? a.id + "_temp" : a.id.replace("_temp", ""))
};
gweb.ui.SmoothScroll.prototype.isValidURL_ = function(a) {
	a = goog.Uri.parse(a);
	var b = a.getDomain() + a.getPath(),
		c = goog.Uri.parse(window.location.hostname + window.location.pathname),
		c = c.getDomain() + c.getPath();
	return b == c ? a.hasFragment() : !1
};
qp.ui.SmoothScroll = function() {
	gweb.ui.SmoothScroll.call(this);
	this.decorateControls()
};
goog.inherits(qp.ui.SmoothScroll, gweb.ui.SmoothScroll);
goog.addSingletonGetter(qp.ui.SmoothScroll);
goog.exportSymbol("qp.ui.SmoothScroll", qp.ui.SmoothScroll);
qp.ui.SideNavDrawer = function(a, b) {
	qp.ui.Widget.call(this, a, b);
	this.pubSub_ = qp.PubSub.getInstance();
	this.pubSub_.subscribe(qp.ui.SideNavToggle.CLICK_EVENT, this.show, this)
};
goog.inherits(qp.ui.SideNavDrawer, qp.ui.Widget);
goog.exportSymbol("qp.ui.SideNavDrawer", qp.ui.SideNavDrawer);
qp.ui.SideNavDrawer.UI_CLASS = "qp-ui-side-nav-drawer";
goog.exportProperty(qp.ui.SideNavDrawer, "UI_CLASS", qp.ui.SideNavDrawer.UI_CLASS);
qp.ui.SideNavDrawer.SHOW_EVENT = "uiSideNavDrawerShow";
qp.ui.SideNavDrawer.HIDE_EVENT = "uiSideNavDrawerHide";
qp.ui.SideNavDrawer.UI_VISIBLE_CLASS = "qp-ui-side-nav-drawer-visible";
qp.ui.SideNavDrawer.UI_OPEN_CLASS = "qp-ui-side-nav-drawer-open";
qp.ui.SideNavDrawer.UI_NOGPU_CLASS = "qp-ui-side-nav-drawer-nogpu";
qp.ui.SideNavDrawer.UI_DISMISS = "qp-ui-side-nav-dismiss";
qp.ui.SideNavDrawer.CSS_TRANSITION_TIME = 300;
qp.ui.SideNavDrawer.prototype.decorateInternal = function(a) {
	qp.ui.SideNavDrawer.superClass_.decorateInternal.call(this, a);
	this.externalClickEvent_ = goog.events.BrowserFeature.TOUCH_ENABLED ? goog.events.EventType.TOUCHSTART : goog.events.EventType.CLICK;
	!goog.labs.userAgent.browser.isChrome() || goog.labs.userAgent.util.matchUserAgent("Android") || goog.labs.userAgent.util.matchUserAgent("CriOS") || goog.dom.classes.add(this.element_, qp.ui.SideNavDrawer.UI_NOGPU_CLASS);
	a = goog.dom.getElementsByClass(qp.ui.SideNavDrawer.UI_DISMISS);
	for (var b = 0; b < a.length; b++) goog.events.listen(a[b], goog.events.EventType.CLICK, this.handleDismissClick_, !1, this)
};
qp.ui.SideNavDrawer.prototype.contains = function(a) {
	var b = this.element_;
	return !!goog.dom.getAncestor(a, function(a) {
		return b === a
	}, !0)
};
qp.ui.SideNavDrawer.prototype.handleExternalClick_ = function(a) {
	this.contains(a.target) || this.hide()
};
qp.ui.SideNavDrawer.prototype.handleDismissClick_ = function(a) {
	this.hide()
};
qp.ui.SideNavDrawer.prototype.handleKeyUp_ = function(a) {
	a.keyCode === goog.events.KeyCodes.ESC && this.hide()
};
qp.ui.SideNavDrawer.prototype.show = function() {
	var a = this.getDomHelper().getDocument(),
		b = goog.bind(goog.events.listen, goog.events, a.body, this.externalClickEvent_, this.handleExternalClick_, !1, this);
	setTimeout(b);
	goog.events.listen(a, goog.events.EventType.KEYUP, this.handleKeyUp_, !1, this);
	goog.dom.classes.add(this.element_, qp.ui.SideNavDrawer.UI_VISIBLE_CLASS);
	a = goog.bind(goog.dom.classes.add, goog.dom.classes, this.element_, qp.ui.SideNavDrawer.UI_OPEN_CLASS);
	setTimeout(a);
	this.pubSub_.publish(qp.ui.SideNavDrawer.SHOW_EVENT)
};
qp.ui.SideNavDrawer.prototype.hide = function() {
	var a = this.getDomHelper().getDocument();
	goog.dom.classes.remove(this.element_, qp.ui.SideNavDrawer.UI_OPEN_CLASS);
	var b = goog.bind(goog.dom.classes.remove, goog.dom.classes, this.element_, qp.ui.SideNavDrawer.UI_VISIBLE_CLASS);
	setTimeout(b, qp.ui.SideNavDrawer.CSS_TRANSITION_TIME);
	goog.events.unlisten(a.body, this.externalClickEvent_, this.handleExternalClick_, !1, this);
	goog.events.unlisten(a, goog.events.EventType.KEYUP, this.handleKeyUp_, !1, this);
	a = function() {
		this.pubSub_.publish(qp.ui.SideNavDrawer.HIDE_EVENT)
	}.bind(this);
	setTimeout(a, qp.ui.SideNavDrawer.CSS_TRANSITION_TIME)
};
goog.history = {};
goog.history.EventType = {
	NAVIGATE: "navigate"
};
goog.history.Event = function(a, b) {
	goog.events.Event.call(this, goog.history.EventType.NAVIGATE);
	this.token = a;
	this.isNavigation = b
};
goog.inherits(goog.history.Event, goog.events.Event);
goog.history.Html5History = function(a, b) {
	goog.events.EventTarget.call(this);
	goog.asserts.assert(goog.history.Html5History.isSupported(a), "HTML5 history is not supported.");
	this.window_ = a || window;
	this.transformer_ = b || null;
	goog.events.listen(this.window_, goog.events.EventType.POPSTATE, this.onHistoryEvent_, !1, this);
	goog.events.listen(this.window_, goog.events.EventType.HASHCHANGE, this.onHistoryEvent_, !1, this)
};
goog.inherits(goog.history.Html5History, goog.events.EventTarget);
goog.history.Html5History.isSupported = function(a) {
	a = a || window;
	return !(!a.history || !a.history.pushState)
};
goog.history.Html5History.prototype.enabled_ = !1;
goog.history.Html5History.prototype.useFragment_ = !0;
goog.history.Html5History.prototype.pathPrefix_ = "/";
goog.history.Html5History.prototype.setEnabled = function(a) {
	a != this.enabled_ && (this.enabled_ = a) && this.dispatchEvent(new goog.history.Event(this.getToken(), !1))
};
goog.history.Html5History.prototype.getToken = function() {
	if (this.useFragment_) {
		var a = this.window_.location.href,
			b = a.indexOf("#");
		return 0 > b ? "" : a.substring(b + 1)
	}
	return this.transformer_ ? this.transformer_.retrieveToken(this.pathPrefix_, this.window_.location) : this.window_.location.pathname.substr(this.pathPrefix_.length)
};
goog.history.Html5History.prototype.setToken = function(a, b) {
	a != this.getToken() && (this.window_.history.pushState(null, b || this.window_.document.title || "", this.getUrl_(a)), this.dispatchEvent(new goog.history.Event(a, !1)))
};
goog.history.Html5History.prototype.replaceToken = function(a, b) {
	this.window_.history.replaceState(null, b || this.window_.document.title || "", this.getUrl_(a));
	this.dispatchEvent(new goog.history.Event(a, !1))
};
goog.history.Html5History.prototype.disposeInternal = function() {
	goog.events.unlisten(this.window_, goog.events.EventType.POPSTATE, this.onHistoryEvent_, !1, this);
	this.useFragment_ && goog.events.unlisten(this.window_, goog.events.EventType.HASHCHANGE, this.onHistoryEvent_, !1, this)
};
goog.history.Html5History.prototype.setUseFragment = function(a) {
	this.useFragment_ != a && (a ? goog.events.listen(this.window_, goog.events.EventType.HASHCHANGE, this.onHistoryEvent_, !1, this) : goog.events.unlisten(this.window_, goog.events.EventType.HASHCHANGE, this.onHistoryEvent_, !1, this), this.useFragment_ = a)
};
goog.history.Html5History.prototype.setPathPrefix = function(a) {
	this.pathPrefix_ = a
};
goog.history.Html5History.prototype.getPathPrefix = function() {
	return this.pathPrefix_
};
goog.history.Html5History.prototype.getUrl_ = function(a) {
	return this.useFragment_ ? "#" + a : this.transformer_ ? this.transformer_.createUrl(a, this.pathPrefix_, this.window_.location) : this.pathPrefix_ + a + this.window_.location.search
};
goog.history.Html5History.prototype.onHistoryEvent_ = function(a) {
	this.enabled_ && this.dispatchEvent(new goog.history.Event(this.getToken(), !0))
};
goog.history.Html5History.TokenTransformer = function() {};
goog.history.Html5History.TokenTransformer.prototype.retrieveToken = function(a, b) {};
goog.history.Html5History.TokenTransformer.prototype.createUrl = function(a, b, c) {};
qp.ui.ScrollSpy = function(a) {
	qp.ui.ScrollSpyMonitor.getInstance().addElement(a)
};
goog.exportSymbol("qp.ui.ScrollSpy", qp.ui.ScrollSpy);
qp.ui.ScrollSpyMonitor = function() {
	goog.ui.Component.call(this);
	this.elements_ = [];
	this.history_ = new goog.history.Html5History;
	this.getHandler().listen(this.getDomHelper().getWindow(), [goog.events.EventType.SCROLL, goog.events.EventType.RESIZE], this.update_)
};
goog.inherits(qp.ui.ScrollSpyMonitor, goog.ui.Component);
goog.addSingletonGetter(qp.ui.ScrollSpyMonitor);
goog.exportSymbol("qp.ui.ScrollSpyMonitor", qp.ui.ScrollSpyMonitor);
qp.ui.ScrollSpyMonitor.prototype.addElement = function(a) {
	a.id && this.elements_.push(a)
};
qp.ui.ScrollSpyMonitor.prototype.update_ = function(a) {
	a = this.elements_;
	for (var b = -Infinity, c = "", d = 0, e = a.length; d < e; ++d) {
		var f = a[d],
			g = f.getBoundingClientRect().top;
		0 >= g && g > b && (c = f.id, b = g)
	}
	c !== this.history_.getToken() && this.history_.replaceToken(c)
};
qp.ui.Features = function() {
	this.docElement_ = document.documentElement;
	this.video_ = null;
	this.features_ = {}
};
goog.addSingletonGetter(qp.ui.Features);
goog.exportSymbol("qp.ui.Features", qp.ui.Features);
qp.ui.Features.prototype.hasTouch = function() {
	"HAS_TOUCH" in this || (this.HAS_TOUCH = goog.events.BrowserFeature.TOUCH_ENABLED);
	return this.HAS_TOUCH
};
goog.exportProperty(qp.ui.Features.prototype, "hasTouch", qp.ui.Features.prototype.hasTouch);
qp.ui.Features.prototype.canPlayVideo = function() {
	"CAN_PLAY_VIDEO" in this || (this.video_ = goog.dom.createDom("video"), this.CAN_PLAY_VIDEO = !!this.video_.canPlayType);
	return this.CAN_PLAY_VIDEO
};
goog.exportProperty(qp.ui.Features.prototype, "canPlayVideo", qp.ui.Features.prototype.canPlayVideo);
qp.ui.Features.prototype.canPlayH264Video = function() {
	"CAN_PLAY_H264_VIDEO" in this || (this.CAN_PLAY_H264_VIDEO = this.canPlayVideo() && !!this.video_.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""));
	return this.CAN_PLAY_H264_VIDEO
};
goog.exportProperty(qp.ui.Features.prototype, "canPlayH264Video", qp.ui.Features.prototype.canPlayH264Video);
qp.ui.Features.prototype.canPlayWebmVideo = function() {
	"CAN_PLAY_WEBM_VIDEO" in this || (this.CAN_PLAY_WEBM_VIDEO = this.canPlayVideo() && !!this.video_.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, ""));
	return this.CAN_PLAY_WEBM_VIDEO
};
goog.exportProperty(qp.ui.Features.prototype, "canPlayWebmVideo", qp.ui.Features.prototype.canPlayWebmVideo);
qp.ui.Features.prototype.canPlayOggVideo = function() {
	"CAN_PLAY_OGG_VIDEO" in this || (this.CAN_PLAY_OGG_VIDEO = this.canPlayVideo() && !!this.video_.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""));
	return this.CAN_PLAY_OGG_VIDEO
};
goog.exportProperty(qp.ui.Features.prototype, "canPlayOggVideo", qp.ui.Features.prototype.canPlayOggVideo);
qp.search = {};
qp.search.GoogleCustomSearch = function() {
	this.searchEngineID = this.apiKey = "";
	this.queryParams_ = null;
	this.defaultSearch_ = ""
};
goog.addSingletonGetter(qp.search.GoogleCustomSearch);
goog.exportSymbol("qp.search.GoogleCustomSearch", qp.search.GoogleCustomSearch);
qp.search.GoogleCustomSearch.prototype.init = function(a, b) {
	a && (this.apiKey = a);
	b && (this.searchEngineID = b);
	this.queryParams_ = this.getQueryParams_();
	"q" in this.queryParams_ && (this.defaultSearch_ = this.queryParams_.q)
};
qp.search.GoogleCustomSearch.prototype.search = function(a, b) {
	var c = new XMLHttpRequest;
	c.onreadystatechange = function() {
		if (4 == c.readyState && 200 == c.status && b) {
			var a = JSON.parse(c.responseText);
			b(a)
		}
	};
	var d;
	d = "https://www.googleapis.com/customsearch/v1?key=" + encodeURIComponent(this.apiKey);
	d += "&cx=" + encodeURIComponent(this.searchEngineID);
	d += "&q=" + encodeURIComponent(a);
	c.open("GET", d, !0);
	c.send()
};
qp.search.GoogleCustomSearch.prototype.fetchSearchResults = function(a) {
	if ("undefined" === typeof a || null === a || "" == a)
		if (null !== this.defaultSearch_ && "" !== this.defaultSearch) a = this.defaultSearch_;
		else return;
	this.clearResults_();
	document.getElementById("title_search_term").textContent = a;
	var b = function(a) {
		this.populateResults_(a)
	}.bind(this);
	this.search(a, b)
};
qp.search.GoogleCustomSearch.prototype.clearResults_ = function() {
	document.getElementById("result_list").innerHTML = ""
};
qp.search.GoogleCustomSearch.prototype.populateResults_ = function(a) {
	var b = document.getElementById("result_list"),
		c = document.getElementById("template_result_standard"),
		d = document.getElementById("template_result_image"),
		e = document.querySelector('meta[property="og:image"]');
	if ("items" in a) {
		a = a.items;
		for (var f = 0; f < a.length && 40 > f; f++) {
			var g = a[f],
				h = !1,
				k, l = null;
			g.pagemap && g.pagemap.cse_image && 0 < g.pagemap.cse_image.length && (h = !0, l = g.pagemap.cse_image[0], e && e.getAttribute("content", "") == l.src && (h = !1));
			var m =
				g.title;
			g.pagemap && g.pagemap.document && 0 < g.pagemap.document.length && g.pagemap.document[0].title && (m = g.pagemap.document[0].title, g.pagemap.document[0].section_title && (m += " \u2013 " + g.pagemap.document[0].section_title));
			k = h ? d.cloneNode(!0) : c.cloneNode(!0);
			k.setAttribute("id", "");
			k.style.display = "block";
			k.querySelector(".template-title").textContent = m;
			k.querySelector(".template-anchor").setAttribute("href", g.link);
			g = g.htmlSnippet;
			g = g.replace(/\<br\>\n/g, "");
			k.querySelector(".template-short-desc").innerHTML =
				g;
			h && (k.querySelector(".template-img").setAttribute("src", l.src), h = parseInt(l.width) / parseInt(l.height), k.querySelector(".template-img").setAttribute("height", "192"), k.querySelector(".template-img").setAttribute("width", Math.floor(192 * h)));
			b.appendChild(k)
		}
	}
};
qp.search.GoogleCustomSearch.prototype.getQueryParams_ = function() {
	for (var a = {}, b = window.location.search.substring(1).split("&"), c = 0; c < b.length; c++) {
		var d = b[c].split("="),
			e = decodeURIComponent(d[0].replace(/\+/g, " ")),
			f = null;
		1 < d.length && (f = decodeURIComponent(d[1].replace(/\+/g, " ")));
		a[e] = f
	}
	return a
};
goog.ui.AnimatedZippy = function(a, b, c, d) {
	d = d || goog.dom.getDomHelper();
	var e = d.createDom("div", {
		style: "overflow:hidden"
	});
	b = d.getElement(b);
	b.parentNode.replaceChild(e, b);
	e.appendChild(b);
	this.elWrapper_ = e;
	this.anim_ = null;
	goog.ui.Zippy.call(this, a, b, c, void 0, d);
	a = this.isExpanded();
	this.elWrapper_.style.display = a ? "" : "none";
	this.updateHeaderClassName(a)
};
goog.inherits(goog.ui.AnimatedZippy, goog.ui.Zippy);
goog.tagUnsealableClass(goog.ui.AnimatedZippy);
goog.ui.AnimatedZippy.prototype.animationDuration = 500;
goog.ui.AnimatedZippy.prototype.animationAcceleration = goog.fx.easing.easeOut;
goog.ui.AnimatedZippy.prototype.isBusy = function() {
	return null != this.anim_
};
goog.ui.AnimatedZippy.prototype.setExpanded = function(a) {
	if (this.isExpanded() != a || this.anim_) {
		"none" == this.elWrapper_.style.display && (this.elWrapper_.style.display = "");
		var b = this.getContentElement().offsetHeight,
			c = 0;
		this.anim_ ? (a = this.isExpanded(), goog.events.removeAll(this.anim_), this.anim_.stop(!1), c = parseInt(this.getContentElement().style.marginTop, 10), c = b - Math.abs(c)) : c = a ? 0 : b;
		this.updateHeaderClassName(a);
		this.anim_ = new goog.fx.Animation([0, c], [0, a ? b : 0], this.animationDuration, this.animationAcceleration);
		goog.events.listen(this.anim_, [goog.fx.Transition.EventType.BEGIN, goog.fx.Animation.EventType.ANIMATE, goog.fx.Transition.EventType.END], this.onAnimate_, !1, this);
		goog.events.listen(this.anim_, goog.fx.Transition.EventType.END, goog.bind(this.onAnimationCompleted_, this, a));
		this.anim_.play(!1)
	}
};
goog.ui.AnimatedZippy.prototype.onAnimate_ = function(a) {
	var b = this.getContentElement();
	b.style.marginTop = a.y - b.offsetHeight + "px"
};
goog.ui.AnimatedZippy.prototype.onAnimationCompleted_ = function(a) {
	a && (this.getContentElement().style.marginTop = "0");
	goog.events.removeAll(this.anim_);
	this.setExpandedInternal(a);
	this.anim_ = null;
	a || (this.elWrapper_.style.display = "none");
	this.dispatchEvent(new goog.ui.ZippyEvent(goog.ui.Zippy.Events.TOGGLE, this, a))
};
qp.ui.SideNavZippy = function(a, b) {
	goog.ui.AnimatedZippy.call(this, a, goog.dom.getNextElementSibling(a), b)
};
goog.inherits(qp.ui.SideNavZippy, goog.ui.AnimatedZippy);
goog.exportSymbol("qp.ui.SideNavZippy", qp.ui.SideNavZippy);
qp.ui.SearchInput = function(a, b) {
	qp.ui.Widget.call(this, a, b);
	this.pubSub_ = qp.PubSub.getInstance()
};
goog.inherits(qp.ui.SearchInput, qp.ui.Widget);
goog.exportSymbol("qp.ui.SearchInput", qp.ui.SearchInput);
qp.ui.SearchInput.UI_CLASS = "qp-ui-search-input";
goog.exportProperty(qp.ui.SearchInput, "UI_CLASS", qp.ui.SearchInput.UI_CLASS);
qp.ui.SearchInput.UI_OPEN_CLASS = "search-open";
qp.ui.SearchInput.UI_FOCUSED_CLASS = "focused";
qp.ui.SearchInput.UI_TEXT_ENTERED_CLASS = "text-entered";
qp.ui.SearchInput.UI_OPEN_BUTTON_CLASS = "search-button";
qp.ui.SearchInput.UI_CLOSE_BUTTON_CLASS = "search-close-button";
qp.ui.SearchInput.CHANGE_EVENT = "searchInputChange";
qp.ui.SearchInput.FOCUS_EVENT = "searchInputFocus";
qp.ui.SearchInput.BLUR_EVENT = "searchInputBlur";
qp.ui.SearchInput.INPUT_EVENT = "searchInputInput";
qp.ui.SearchInput.prototype.decorateInternal = function(a) {
	qp.ui.SearchInput.superClass_.decorateInternal.call(this, a);
	this.inputField_ = a.querySelector("input");
	this.label_ = a.querySelector("label");
	this.openButton_ = a.querySelector("." + qp.ui.SearchInput.UI_OPEN_BUTTON_CLASS);
	this.closeButton_ = a.querySelector("." + qp.ui.SearchInput.UI_CLOSE_BUTTON_CLASS);
	this.isOpen_ = !1;
	this.updateUI_();
	goog.events.listen(this.inputField_, goog.events.EventType.FOCUS, this.handleFocus_, !1, this);
	goog.events.listen(this.inputField_,
		goog.events.EventType.BLUR, this.handleBlur_, !1, this);
	goog.events.listen(this.inputField_, goog.events.EventType.CHANGE, this.handleChange_, !1, this);
	goog.events.listen(this.inputField_, goog.events.EventType.INPUT, this.handleInput_, !1, this);
	goog.events.listen(this.inputField_, goog.events.EventType.KEYDOWN, this.handleKeyDown_, !1, this);
	goog.events.listen(this.openButton_, goog.events.EventType.CLICK, this.handleOpen_, !1, this);
	goog.events.listen(this.closeButton_, goog.events.EventType.CLICK, this.handleClose_, !1, this)
};
qp.ui.SearchInput.prototype.handleFocus_ = function(a) {
	this.open();
	this.pubSub_.publish(qp.ui.SearchInput.FOCUS_EVENT);
	goog.dom.classes.add(this.element_, qp.ui.SearchInput.UI_FOCUSED_CLASS)
};
qp.ui.SearchInput.prototype.handleBlur_ = function(a) {
	this.pubSub_.publish(qp.ui.SearchInput.BLUR_EVENT);
	goog.dom.classes.remove(this.element_, qp.ui.SearchInput.UI_FOCUSED_CLASS)
};
qp.ui.SearchInput.prototype.handleOpen_ = function(a) {
	a.preventDefault();
	this.isOpen_ && this.submitSearch();
	this.open()
};
qp.ui.SearchInput.prototype.handleClose_ = function(a) {
	a.preventDefault();
	this.close()
};
qp.ui.SearchInput.prototype.handleChange_ = function(a) {
	this.pubSub_.publish(qp.ui.SearchInput.CHANGE_EVENT)
};
qp.ui.SearchInput.prototype.handleInput_ = function(a) {
	this.pubSub_.publish(qp.ui.SearchInput.INPUT_EVENT);
	this.updateUI_()
};
qp.ui.SearchInput.prototype.handleKeyDown_ = function(a) {
	13 == a.keyCode && this.submitSearch()
};
qp.ui.SearchInput.prototype.updateUI_ = function() {
	"" != this.inputField_.value ? goog.dom.classes.add(this.element_, qp.ui.SearchInput.UI_TEXT_ENTERED_CLASS) : goog.dom.classes.remove(this.element_, qp.ui.SearchInput.UI_TEXT_ENTERED_CLASS)
};
qp.ui.SearchInput.prototype.open = function() {
	this.inputField_.focus();
	goog.dom.classes.add(document.body, qp.ui.SearchInput.UI_OPEN_CLASS);
	this.isOpen_ = !0
};
qp.ui.SearchInput.prototype.close = function() {
	this.inputField_.blur();
	goog.dom.classes.remove(document.body, qp.ui.SearchInput.UI_OPEN_CLASS);
	this.isOpen_ = !1
};
qp.ui.SearchInput.prototype.submitSearch = function() {
	"" != this.inputField_.value && this.inputField_.form.submit()
};
qp.ui.Futurizr = function(a, b) {
	var c = qp.ui.Features.getInstance(),
		d;
	for (d in b) b.hasOwnProperty(d) && goog.isFunction(c[d]) && goog.dom.classes.enable(a, b[d], c[d]())
};
goog.exportSymbol("qp.ui.Futurizr", qp.ui.Futurizr);
qp.ui.SideNavToggle = function(a, b) {
	qp.ui.Widget.call(this, a, b);
	this.pubSub_ = qp.PubSub.getInstance();
	this.pubSub_.subscribe(qp.ui.SideNavDrawer.HIDE_EVENT, this.enable_, this);
	this.pubSub_.subscribe(qp.ui.SideNavDrawer.SHOW_EVENT, this.disable_, this)
};
goog.inherits(qp.ui.SideNavToggle, qp.ui.Widget);
goog.exportSymbol("qp.ui.SideNavToggle", qp.ui.SideNavToggle);
qp.ui.SideNavToggle.UI_CLASS = "qp-ui-side-nav-toggle";
goog.exportProperty(qp.ui.SideNavToggle, "UI_CLASS", qp.ui.SideNavToggle.UI_CLASS);
qp.ui.SideNavToggle.CLICK_EVENT = "uiSideNavToggleClick";
qp.ui.SideNavToggle.prototype.decorateInternal = function(a) {
	qp.ui.SideNavToggle.superClass_.decorateInternal.call(this, a);
	this.enable_();
	goog.events.listen(a, goog.events.EventType.CLICK, this.handleClick_, !1, this)
};
qp.ui.SideNavToggle.prototype.handleClick_ = function(a) {
	this.pubSub_.publish(qp.ui.SideNavToggle.CLICK_EVENT);
	this.element_.blur()
};
qp.ui.SideNavToggle.prototype.enable_ = function() {
	this.element_.setAttribute("aria-expanded", !1)
};
qp.ui.SideNavToggle.prototype.disable_ = function() {
	this.element_.setAttribute("aria-expanded", !0)
};
var spec = {
	init: function() {
		qp.tracking.DownloadTracker.getInstance();
		qp.ui.Initializer.getInstance()
	}
};
goog.exportSymbol("spec.init", spec.init);
spec.searchInstance = qp.search.GoogleCustomSearch.getInstance();
goog.exportSymbol("spec.searchInstance", spec.searchInstance);

;
spec.init();
