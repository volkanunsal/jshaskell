/// <reference path="../../../../jshaskell/src/Haskell.js" local />
/// <reference path="../../../../base/src/Prelude.js" local />

// -------------------------------------------------
// ParseState
// -------------------------------------------------

var undef;

function ParseState(input, index) {
    this.input  = input;
    this.index  = index || 0;
    this.length = input.length - this.index;
    this.cache  = {};
    return this;
}

ParseState.prototype = {

    memoize: false,

    scrollTo: function(index) {
        this.index  = index;
        this.length = this.input.length - index;
        return this;
    },

    scroll: function(index) {
        this.index  += index;
        this.length -= index;
        return this;
    },
    
    dropped: 0, //TODO: cut input periodically if there's no try_

    at: function(index){
        return this.input.charAt(this.index + index);
    },

    substring: function(start, end){
        return this.input.substring(
            start + this.index,
            (end || this.length) + this.index);
    },

    substr: function(start, length){
        return this.input.substring(
            start + this.index,
            length || this.length);
    },

    toString: function(){
        var substr = this.substring(0);
        return 'PS at ' + this.index + ' ' + 
            (substr.length ? '"' + substr + '"' : "Empty"); 
    },

    getCached: function(pid) {
        if(!this.memoize)
            return;

        var p = this.cache[pid];
        if(!p)
            return;

        var result = p[this.index];

        if(!result)
            return;

        this.index  = result.index;
        this.length = result.length;

        return result;
    },

    putCached: function(pid, index, cached) {
        if(!this.memoize)
            return false;
        
        cached.index  = this.index;
        cached.length = this.length;


        var p = this.cache[pid];
        if(!p)
            p = this.cache[pid] = {};

        p[index] = cached;
    }
    
    ,sourceLine: function(pos){
        var m = this.input.substring(0, pos).match(/(\r\n)|\r|\n/g);
        return m ? m.length : 0;
    }

    /*

    //returns a new state object
    ,from: function(index) {
        var r = new ParseState(this.input, this.index + index);
        r.cache  = this.cache;
        r.length = this.length - index;
        return r;
    }

    ,skipWhitespace: function(){
        var m = this.substring(0).match(/^\s+/);
        return m ? this.scroll(m[0].length) : this;
    }

    */
};

function ps(str) {
    return new ParseState(str);
}




// -------------------------------------------------
// Result
// -------------------------------------------------


// ast:       is the AST returned by the parse, which doesn't need to be successful
//                this is the value that Functor, Applicative, and Monad functions operate on
// success:   might be true or false
// expecting: contains the value that the parser expected but haven't matched completely or at all
//                It's either a single string, or an object with a property 'string' and 'at'.
//                If it's just a string, then the index can be determined from ParseState.index,
//                else the latter form should be used (this might be changed later!).
//                It might be an array of these values, which represents a choice.

function unexpected(name){
    return function(scope, state, k){
        return k({ast: null, success: false, expecting: {unexpected: name}});
    };
}

//accepts an identifier string, see usage with notFollowedBy
function unexpectedIdent(name){
    return function(scope, state, k){
        return k({ast: null, success: false, expecting: {unexpected: scope[name]}});
    };
}


function parserFail(msg){
    return function(scope, state, k){
        return k({success: false, expecting: msg});
    };
};

var fail = parserFail;


function parserZero(scope, state, k){
    return k({success: false});
}

var mzero = parserZero;
var empty = mzero;



// -------------------------------------------------
// Parser
// -------------------------------------------------


// Helper function to convert string literals and CallStreams to token parsers
function toParser(p){
    return (typeof p == "string") ? string(p) : 
        isArray(p) ? resolve(p) : p;
}


function run(p, strOrState, complete, error, async){
    var input = strOrState instanceof ParseState ? strOrState : ps(strOrState);
    evalThunks(p(new Scope(), input, function(result){
        result.state = input;
        delete result.index;
        delete result.length;
        if(!result.success){
            result.error = processError(result.expecting, result.state);
            error && error(result.error);
        }else{
            delete result.error;
            delete result.expecting;
        }
        complete(result);
    }), async);
}

function processError(e, s, i, unexp){
    var index = i === undefined ? s.index : i;

    if(typeof e == "string"){
        var lines = s.input.split("\n"),
            linecount = lines.length,
            restlc = s.input.substr(index).split("\n").length,
            line = linecount - restlc + 1,
            lindex = index - lines.splice(0,line-1).join("\n").length,
            unexpMsg = unexp || s.input.substr(index, e.length).substr(0, 6);
        return 'Unexpected "' + (unexpMsg.length ? unexpMsg : "end of input") +  
                (unexp ? "" : ('", expecting "' + e)) + 
                '" at line ' + line + ' char ' + lindex;
    }

    if(isArray(e)){
        var err = map(function(er){ return typeof er == "object" ? er.expecting : er }, e);
        return processError(err.join('" or "'), s);
    }else if(typeof e == "object")
        return processError(e.expecting, s, e.at, e.unexpected);
}

var parser_id = 0;

function Parser(){}

function parserBind(p, f){ 
    return function(scope, state, k){
        return function(){ return p(scope, state, function(result){
            if(result.success){
                return function(){ return f(result.ast)(scope, state, k) }
            }else{
                return k(result);
            }
        })};
    };
}


var do2 = function(p1, p2){
    function fn(scope, state, k){
        return function(){ return p1(scope, state, function(result){
            return result.success ? p2(scope, state, k) : k(result); //TODO: p2
        })};
    }
    fn.constructor = Parser;
    return fn;
};

//TODO: foldl
var do_ = function(p1, p2, p3 /* ... */){
    var parsers = map(toParser, arguments);
    function fn(outerScope, state, k){
        var scope = new Scope(outerScope),
            i = 1,
            l = parsers.length,
            result = parsers[0];

        for(; i < l; ++i)
            result = do2(result, parsers[i]);

        return result(scope, state, k);
    }
    fn.constructor = Parser;
    return fn;
};


function bind(name, p){ 
    if(name == "scope")
        throw "Can't use 'scope' as an identifier!";
    return function(scope, state, k){
        return function(){ return p(scope, state, function(result){
            if(result.success)
                scope[name] = result.ast;
            return k(result);
        })};
    };
}


function ret(name, more){
    var args;
    if(more) 
        args = slice(arguments);

    return function(scope, state, k){

        return function(){ return function(){
            var ast, type = typeof name;
            //if(args){
            //  ast =  resolve(resolveBindings(args, scope));
            //}else 
            if(type == "string"){
                if(!(name in scope))
                    throw 'Not in scope: "' + name + '"';
                ast = scope[name];      
            }else
                ast = name(scope);

            return k({ast: ast, success: true});

        }};
    };
}

function resolveBindings(arr, scope){
    return isArray(arr) ?
        map(function(e){ return (e in scope) ? scope[e] : resolveBindings(e) }, arr)
        : arr;
}

function withBound(fn){
    var args = slice(arguments, 1);
    return function(scope){
        return fn.apply(null, map(function(e){ return scope[e] }, args));
    };
}

var returnCall = compose(ret, withBound);

function getPosition(scope, state, k){
    return k({ast: state.index, success: true});
}

var getParserState = getPosition; //TODO?

function setPosition(id){
    var type = typeof id;
    return function(scope, state, k){
        state.scrollTo(type == "string" ? scope[id] : id);
        return k({success: true});
    };
}

var setParserState = setPosition; //TODO?

//in contrast with Haskell here's no closure in the do_ notation,
//it's simulated with `bind` and `ret`,
//this function does what `pure` and `return` do in Haskell
function parserReturn(value){
    return function(scope, state, k){
        return k({ast: value, success: true});
    };
}

var return_ = parserReturn;
var pure = return_;


function ap(a, b){
    return do_(bind("a", a), bind("b", b), ret(function(scope){ return scope.a(scope.b) }));
}

//liftM f m1 = do { x1 <- m1; return (f x1) }
function liftM(f, m1){
    return do_(bind("x1", m1), returnCall(f, "x1"));
}
var parsecMap = liftM;
var fmap   = parsecMap;
var liftA  = fmap;

//liftM2 f m1 m2 = do { x1 <- m1; x2 <- m2; return (f x1 x2) }
function liftM2(f, m1, m2){
    return do_(bind("x1", m1), bind("x2", m2), returnCall(f, "x1", "x2"));
}
var liftA2 = liftM2;

//liftM3 f m1 m2 m3 = do { x1 <- m1; x2 <- m2; x3 <- m3; return (f x1 x2 x3) }
function liftM3(f, m1, m2, m3){
    return do_(bind("x1", m1), bind("x2", m2), bind("x3", m3),
               returnCall(f, "x1", "x2", "x3"));
}
var liftA3 = liftM3;



//var skip_fst = function(p1, p2){ return liftA2(const_(id), p1, p2) };
//function skip_fst(p1, p2){ return do_(p1, p2) }
var skip_fst = do2;

//var skip_snd = function(p1, p2){ return liftA2(const_, p1, p2) };
function skip_snd(p1, p2){ return do_(bind("a", p1), p2, ret("a")) }



function parserPlus(p1, p2){
    function fn(scope, state, k){
        return function(){ return p1(scope, state, function(result){
            var errors =  [];

            function handleError(result){
                var err = result.expecting;
                if(err){
                    if(err.constructor == Array)
                        errors = errors.concat(err);
                    else
                        errors.push(err);
                }
                result.expecting = result.success ? undef : errors;
            }
            
            handleError(result);
            if(result.ast !== undef)
                return function(){ return k(result) };
            else
                return function(){ return p2(scope, state, function(result){
                    handleError(result);
                    return k(result);
                })};
            
        })};
    }
    fn.constructor = Parser;
    return fn;
}

// 'parserPlus' is a parser combinator that provides a choice between other parsers.
// It takes any number of parsers as arguments and returns a parser that will try
// each of the given parsers in order. The first one that matches some string 
// results in a successfull parse. It fails if all parsers fail.
function parserPlusN(p1, p2, p3 /* ... */){
    var parsers = map(toParser, arguments);
    return function(scope, state, k){
        var i = 1,
            l = parsers.length,
            result = parsers[0];
        
        for(; i < l; ++i)
            result = parserPlus(result, parsers[i]);

        return result(scope, state, k);
    };
}

var mplus = parserPlus;



//accepts multiple parsers and returns a new parser that
//evaluates them in order and
//succeeds if all the parsers succeeded
//fails when a parser fails but returns the array of previous ASTs in the result
function tokens(parsers){
    return function(scope, state, k){
        var i = 0,
            ast = [],
            length = parsers.length;
        
        function next(parser){
            return function(scope, state, k){
                return function(){ return parser(scope, state, function(result){
                    i++;
                    if(!result.success)
                        return k(result);
                    if(result.ast !== undef)
                        ast.push(result.ast);
                    return i < length ? next(parsers[i])(scope, state, k) : k(result);
                })};
            };
        }

        return function(){ return next(parsers[i])(scope, state, function(result){
            var success = result.success;
            return k({ast: ast, success: success, expecting: success ? undef : result.expecting });
        })};
    };
}

function _many(onePlusMatch){
    return function(parser){
        return function(scope, state, k){
            var matchedOne = false,
                ast = [];
            
            function next(parser){
                return function(scope, state, k){
                    return function(){ return parser(scope, state, function(result){
                        if(!result.success)
                            return k(result);
                            
                        matchedOne = true;
                        if(result.ast !== undef)
                            ast.push(result.ast);
                                
                        return next(parser)(scope, state, k);
                    })};
                };
            }
    
            return function(){ return next(parser)(scope, state, function(result){
                var success = !onePlusMatch || (matchedOne && onePlusMatch);
                return k({ast: success ? ast : undef
                         ,success: success
                         ,expecting: success ? undef : result.expecting
                         });
            })};
        };
    };
}

var many = _many(false);

var many1 = _many(true);

//tokenPrim :: (c -> ParseState -> startIndex -> Result) -> (c -> Parser)
function tokenPrim(fn){
    return function(c){
        var pid = parser_id++;
        var combinator = function(scope, state, k){
            var startIndex = state.index;
            var result = state.getCached(pid);
            if(result !== undef)
                return k(result);
                
            result = fn(c, state, startIndex);
                        
            state.putCached(pid, startIndex, result);
            return k(result);
        };
        combinator.constructor = Parser;
        return combinator;
    };
}

//tokenPrimP1 :: (arg2 -> parser1Result -> ParseState -> startIndex -> newResult)
//              -> (Parser -> arg2 -> Parser)
function tokenPrimP1(fn){
    return function(p1, arg2){
        var pid = parser_id++;
        var combinator = function(scope, state, k){
            var startIndex = state.index;
            var result = state.getCached(pid);
            if(result !== undef)
                return k(result);
                
            return function(){ return p1(scope, state, function(result){
                    
                    result = fn(arg2, result, state, startIndex);
                    
                    state.putCached(pid, startIndex, result);
                    return k(result);
                })};
            
        };
        combinator.constructor = Parser;
        return combinator;
    };
}


var try_ = tokenPrimP1(function(_, result, state, startIndex){
    if(result.success)
        return result;
    state.scrollTo(startIndex);
    return {ast: undef, success: false, expecting: result.expecting };
});


var skipMany = function(p){
    return tokenPrimP1(function(_, result, state, startIndex){
        return {ast: undef, success: result.success, expecting: result.expecting };
    })(many(p), null);
};

//char_ :: Char -> Parser
var char_ = tokenPrim(function(c, state, startIndex){
    if(state.length > 0 && state.at(0) == c){
        state.scroll(1);
        return {ast: c, success: true};
    }
    return {success: false, expecting: c};
});


//satisfy :: (Char -> Bool) -> Parser
var satisfy = tokenPrim(function(cond, state){
    var fstchar = state.at(0);
    if(state.length > 0 && cond(fstchar)){
        state.scroll(1);
        return {ast: fstchar, success: true};
    }
    return {success: false, expecting: fstchar};
});



//string :: String -> Parser
var string = function(s){ //TODO
    return tokenPrimP1(function(_, result, state, startIndex){
        var ast = result.ast.join("");
        return {ast: ast.length ? ast : undef //TODO
               ,success: result.success
               ,expecting: result.success ? undef : {at:startIndex, expecting: s}
               };
    })(tokens(map(char_, s)), null);
};


//tokenPrimP1 :: (a -> parser1Result -> ParseState -> startIndex -> newResult)
//              -> (Parser -> a -> Parser)
//label :: Parser -> String -> Parser
var label = tokenPrimP1(function(str, result, state, startIndex){
    return result.success ? result : 
        {ast: result.ast, success: false, expecting: {at: startIndex, expecting: str}};
});


//accepts a regexp or a string
//in case of a string it either matches the whole string or nothing

//match :: StringOrRegex -> Parser
var match = tokenPrim(function(sr, state){
        if(typeof sr == "string"){
            if(state.substring(0, sr.length) == sr){
                state.scroll(sr.length);
                return {ast: sr, success: true};
            }else
                return {success: false, expecting: sr};
                        
        }else if(sr.exec){
            var rx = new RegExp("^" + sr.source);
            var substr = state.substring(0);
            var match = rx.exec(substr);
            match = match && match[0];
            var length = match && match.length;
            var matched = substr.substr(0, length);
            if(length){
                state.scroll(length);
                return {ast: matched, success: true};
            }else
                return {success: false, expecting: sr.source};
        }
});



extend(operators, {
    "<-" : {
        func:   bind,
        fixity: infixr(-1) //this is a special operator, don't use negative fixity anywhere else!
        //,type:    [String, Parser, Parser]
    },
    ">>=": {
        func:   parserBind,
        fixity: infixl(1)
        //,type:    [Parser, Function, Parser]
    },
    "=<<": {
        func:   flip(parserBind),
        fixity: infixr(1)
        //,type:    [Parser, Parser, Parser]
    },
    ">>" : {
        func:   skip_fst,
        fixity: infixl(1)
        //,type:    [Parser, Parser, Parser]
    },
    "*>" : { //liftA2 (const id)
        func:   skip_fst,
        fixity: infixl(4)
        //,type:    [Parser, Parser, Parser]
    },
    "<*" : { //liftA2 const
        func:   skip_snd,
        fixity: infixl(4)
        //,type:    [Parser, Parser, Parser]
    },
    "<$>": {
        func:   fmap,
        fixity: infixl(4)
        //,type:    [Function, Parser, Parser]
    },
    "<*>": {
        func:   ap,
        fixity: infixl(4)
        //,type:    [Parser, Parser, Parser]
    },
    "<**>": { //liftA2 (flip ($))
        func:   curry(liftA2)(flip(call)),
        fixity: infixl(4)
        //,type:    [Parser, Parser, Parser]
    },
        //the (<$) combinator uses the value on the left 
        //if the parser on the right succeeds. x <$ p = pure x <* p
        //from Control.Applicative: (<$>) . const :: Functor f => a -> f b -> f a
    "<$" : {
        func:   function(val, parser){ return skip_snd(pure(value), parser) },
        fixity: infixl(4)
        //,type:    ["*", Parser, Parser]
    },
    "<|>": {
        func:   parserPlus,
        fixity: infixr(1)
        //,type:    [Parser, Parser, Parser]
    },
    "<?>": {
        func:   label,
        fixity: infix(0)
        //,type:    [Parser, String, Parser]
    }   
});



//a specialized version of `lazy`
function withScope(f){
    return function(scope, state, k){
        return f(scope)(scope, state, k);
    }
}

//#region comment
/*
usage: 

//assignExpr :: ExpressionParser st
//assignExpr = do
//  p <- getPosition
//  lhs <- parseTernaryExpr
//  let assign = do
//        op <- assignOp
//        lhs <- asLValue p lhs
//        rhs <- assignExpr
//        return (AssignExpr p op lhs rhs)
//  assign <|> (return lhs)

var assignExpr = do$
  ("p"   ,"<-", getPosition)
  ("lhs" ,"<-", parseTernaryExpr)
  (do$("op"  ,"<-", assignOp)
      ("lhs" ,"<-", withScope, function(scope){
        //bring p to the current scope, so that returnCall can be used:
        scope.p = scope.scope.p;
        return asLValue(scope.scope.p, scope.scope.lhs); //here asLValue retruns a parser
      })
      ("rhs" ,"<-", withScope, function(){ return assignExpr })
      (returnCall, Expression.AssignExpr, "p", "op", "lhs", "rhs")
  ,"<|>", ret, "lhs")

  withScope first is used to directly access variables from the enclosing scope,
  and second for just referencing the current parser recursively.

*/
//#endregion


instance(Monad, Parser, function(inst){return{
    ">>="   : parserBind,
    ">>"    : do2,
    do_     : do_,
    return_ : parserReturn,
    fail    : parserFail,
    run     : run

    //the default implementation can be used too, which is slightly slower
    //because `arguments` and `apply` is used instead of directly calling each function
    ,do$  : function (){

        function rec(scope, state, k){ return p(scope, state, k) }

        var lines = [], p, resolved;

        lines.push(resolve(arguments, rec));

        function line(scope, state, k){
            if(resolved || (scope instanceof Scope))
                return (resolved ? p : line.resolve())(scope, state, k);
        
            lines.push(resolve(arguments, rec));
            return line;
        }

        line.resolve = function(){
            if(resolved)
                return p;
            p = do_.apply(null, lines);
            resolved = true;
            lines = null;
            return p;
        };

        line.CallStream = true;
        line.constructor = Parser;
        return line;
    }
    
}})
var ParserMonad = getInstance(Monad, Parser);
var do$ = ParserMonad.do$;
//var do_ = ParserMonad.do_
var ex = exl(Parser);



//from Control.Monad
//
//-- | Evaluate each action in the sequence from left to right,
//-- and collect the results.
//sequence       :: Monad m => [m a] -> m [a] 
//{-# INLINE sequence #-}
//sequence ms = foldr k (return []) ms
//            where
//              k m m' = do { x <- m; xs <- m'; return (x:xs) }
function sequence(ms){
    //TODO!!!!
    //var inst = getInstance(Monad, typeOf(ms[0]));

    function k(m1, m2){
        return do_(
            bind("x", m1),
            bind("xs", m2),
            ret(withBound(cons, "x", "xs"))
        );
    }

    return foldr(k, return_([]), ms);
}

namespace("Text_Parsec_Prim", {
    sequence        : sequence,

    run             : run,
    Parser          : Parser,
    ParseState      : ParseState,
    ps              : ps, 
    toParser        : toParser,
    unexpected      : unexpected,
    parsecMap       : parsecMap,
    fmap            : fmap,
    liftM           : liftM,
    liftM2          : liftM2,
    liftM3          : liftM3,
    liftA           : liftA,
    liftA2          : liftA2,
    liftA3          : liftA3,
    ap              : ap,
    parserBind      : parserBind,
    parserReturn    : parserReturn,
    return_         : return_,
    pure            : pure,
    parserFail      : parserFail,
    fail            : fail,
    parserZero      : parserZero,
    mzero           : mzero,
    empty           : empty,
    parserPlus      : parserPlus,
    parserPlusN     : parserPlusN,
    mplus           : mplus,
    do_             : do_,
    do$             : do$,
    do2             : do2,
    bind            : bind,
    ret             : ret,
    withBound       : withBound,
    returnCall      : returnCall,
    getPosition     : getPosition,
    setPosition     : setPosition,
    getParserState  : getParserState,
    setParserState  : setParserState,
    tokens          : tokens,
    many            : many,
    many1           : many1,
    string          : string,
    char_           : char_,
    satisfy         : satisfy,
    label           : label,
    try_            : try_,
    skipMany        : skipMany,
    match           : match,
    withScope       : withScope,
    ex              : ex
});
