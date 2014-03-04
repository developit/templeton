/** @fileOverview A simple template engine with iterators and extensible block helpers
 *	@author Jason Miller <j AT dvlpt DOT com>
 */

var engine = {
	
	extendedKeys : true,
	
	helpers : {
		link : '<a href="{{href|html}}">{{title|html}}</a>',
		html : function(v) {
			return String(v).replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
		},
		escape : function(v) {
			return encodeURIComponent(v);
		},
		json : function(v){ return JSON.stringify(v); }
	},
	
	refs : {
		'@' : function(fields, key, fallback) {
			return engine.devle(fields, 'locale.'+key, fallback);
		}
	},
	
	blockHelpers : {
		each : function(ctx) {
			var out='', p, fields,
				top = ctx.fields,
				obj = ctx.value;
			if (engine.extendedKeys!==false) {
				fields = {
					'~' : top,
					__path__ : ctx.id==='.' ? ctx.path : ctx.id
				};
			}
			for (p in obj) {
				if (obj.hasOwnProperty(p)) {
					if (fields) {
						fields.__key__ = p;
					}
					out += engine.template(ctx.content, obj[p], fields);
				}
			}
			return out;
		},
		'if' : function(ctx) {
			return ctx.value ? engine.template(ctx.content, ctx.fields, ctx.overrides) : '';
		},
		'else' : function(ctx) {
			return ctx.value ? '' : engine.template(ctx.content, ctx.fields, ctx.overrides);
			//return ctx.previousValue ? '' : engine.template(ctx.content, ctx.fields, ctx.overrides);
		}
	},
	
	/*
	getTokenizer : function() {
		var keys = engine.refs && engine.objKeys(engine.refs).join('') || '',
			tokenizer;
		tokenizer = new RegExp('\\{\\{([#\\/\\:'+keys+']?)([^ \\{\}\\|]+)(?: ([^\\{\}\\|]*?))?(?:\\|([^\\{\\}]*?))?\\}\\}', 'g');
		return tokenizer;
	},
	*/
	
	template : function(text, fields, _overrides) {
		var tokenizer = /\{\{\{?([#\/\:]?)([^ \{\}\|]+)(?: ([^\{\}\|]*?))?(?:\|([^\{\}]*?))?\}?\}\}/g,
			out = '',
			t, j, r, f, index, mods, token,
			stack = [],
			ctx;
		ctx = {
			fields : fields || {},
			overrides : _overrides || engine._emptyObj
		};
		ctx.path = (ctx.overrides.__path__?(ctx.overrides.__path__+'.'):'')+ctx.overrides.__key__;
		tokenizer.lastIndex = 0;
		while ( (token=tokenizer.exec(text)) ) {
			if (stack.length===0) {
				out += text.substring(index || 0, tokenizer.lastIndex - token[0].length);
			}
			t = token[1];
			if (!t || (t!=='#' && t!==':' && t!=='/')) {
				f = token[2];
				if (stack.length===0) {
					if (t) {
						r = engine.refs[t](fields, f, null);
					}
					else {
						r = ctx.overrides[f] || engine.delve(fields, f, null);
					}
					if (r===null) {
						out += token[0];
					}
					else {
						if (token[4]) {
							mods = token[4].split('|');
							for (j=0; j<mods.length; j++) {
								if (engine.helpers.hasOwnProperty(mods[j])) {
									r = engine.execHelper(mods[j], r);
								}
							}
						}
						if (token[0].charAt(2)==='{') {
							r = engine.helpers.html(r);
						}
						out += r;
					}
				}
			}
			else {
				if (t==='/' || t===':') {
					ctx.id = stack.pop();
					ctx.value = ctx.overrides[ctx.id] || engine.delve(fields, ctx.id, null);
					if (stack.length===0) {
						ctx.content = text.substring(ctx.blockStart, tokenizer.lastIndex - token[0].length);
						r = engine.blockHelpers[ctx.blockHelper](ctx);
						if (r && typeof(r)==='string') {
							out += r;
						}
					}
					ctx.previousBlockHelper = ctx.blockHelper;
					ctx.previousId = ctx.id;
					ctx.previousValue = ctx.value;
				}
				if (t==='#' || t===':') {
					stack.push(t===':' ? ctx.id : token[3]);
					if (stack.length===1) {
						ctx.blockHelper = token[2];
						ctx.blockStart = tokenizer.lastIndex;
					}
					index = null;
				}
			}
			/*
			else {
				if (stack.length===0) {
					out += token[0];
				}
			}
			*/
			index = tokenizer.lastIndex;
		}
		out += text.substring(index);
		return out;
	},
	
	// internals
	
	keyPath : /(\.{2,}|\[(['"])([^\.]*?)\1\])/g,
	trimDots : /(^\.|\.$)/g,
	
	execHelper : function(name, text) {
		var parts = name.split(':'),
			id = parts[0],
			h = engine.helpers[id];
		if (typeof h==='string') {
			return engine.template(h, text);
		}
		parts.splice(0, 1, text);
		return h.apply(engine.helpers, parts);
	},
	
	isArray : Array.isArray || function(obj) {
		return Object.prototype.toString.call(obj)==='[object Array]';
	},
	
	/*
	objKeys : Object.keys || function(obj) {
		var keys=[], i;
		for (i in obj) {
			if (obj.hasOwnProperty(i)) {
				keys.push(i);
			}
		}
		return keys;
	},
	*/
	
	copy : function(obj, from) {
		for (var j in from) {
			if (from.hasOwnProperty(j)) {
				obj[j] = from[j];
			}
		}
		return obj;
	},
	
	delve : function(obj, key, fallback) {
		var c=obj, i, l;
		if (key==='.') {
			return obj.hasOwnProperty('.') ? obj['.'] : obj;
		}
		if (key.indexOf('.')===-1) {
			return obj.hasOwnProperty(key) ? obj[key] : fallback;
		}
		if (key.indexOf('[')!==-1) {
			key = key.replace(engine.keyPath,'.$2');
		}
		key = key.replace(engine.trimDots,'').split('.');
		for (i=0, l=key.length; i<l; i++) {
			if (!c.hasOwnProperty(key[i])) {
				return fallback;
			}
			c = c[key[i]];
		}
		return c;
	},
	
	_emptyObj : {}
	
};

if (typeof window.define==='function' && window.define.amd) {
	window.define('templateengine', function(){ return engine; });
}