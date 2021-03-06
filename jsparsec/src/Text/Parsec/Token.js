/// <reference path="../../../../base/src/Data/Char.js" local />
/// <reference path="../../../../base/src/Data/List.js" local />
/// <reference path="Prim.js" />
/// <reference path="Char.js" />
/// <reference path="Combinator.js" />

// -------------------------------------------------
// Token
// -------------------------------------------------

 
//-- A helper module to parse lexical elements (tokens). See 'makeTokenParser'
//-- for a description of how to use it.

//module Text.Parsec.Token
//  ( LanguageDef
//  , GenLanguageDef (..)
//  , TokenParser
//  , GenTokenParser (..)
//  , makeTokenParser
//  ) where
//
//import Data.Char ( isAlpha, toLower, toUpper, isSpace, digitToInt )
//import Data.List ( nub, sort )
//import Control.Monad.Identity
//import Text.Parsec.Prim
//import Text.Parsec.Char
//import Text.Parsec.Combinator
//
//-----------------------------------------------------------
//-- Language Definition
//-----------------------------------------------------------
//
//type LanguageDef st = GenLanguageDef String st Identity
//
//-- | The @GenLanguageDef@ type is a record that contains all parameterizable
//-- features of the 'Text.Parsec.Token' module. The module 'Text.Parsec.Language'
//-- contains some default definitions.
//


function GenLanguageDef(){}

data(GenLanguageDef, [["LanguageDef", {

//data GenLanguageDef s u m
//  = LanguageDef { 
//  
//  -- | Describes the start of a block comment. Use the empty string if the
//  -- language doesn't support block comments. For example \"\/*\". 
//
//  commentStart   :: String,
commentStart: String,
//
//  -- | Describes the end of a block comment. Use the empty string if the
//  -- language doesn't support block comments. For example \"*\/\". 
//
//  commentEnd     :: String,
commentEnd: String,
//
//  -- | Describes the start of a line comment. Use the empty string if the
//  -- language doesn't support line comments. For example \"\/\/\". 
//
//  commentLine    :: String,
commentLine: String,
//
//  -- | Set to 'True' if the language supports nested block comments. 
//
//  nestedComments :: Bool,
nestedComments: Boolean,
//
//  -- | This parser should accept any start characters of identifiers. For
//  -- example @letter \<|> char \"_\"@. 
//
//  identStart     :: ParsecT s u m Char,
identStart: Parser,
//
//  -- | This parser should accept any legal tail characters of identifiers.
//  -- For example @alphaNum \<|> char \"_\"@. 
//
//  identLetter    :: ParsecT s u m Char,
identLetter: Parser,
//
//  -- | This parser should accept any start characters of operators. For
//  -- example @oneOf \":!#$%&*+.\/\<=>?\@\\\\^|-~\"@ 
//
//  opStart        :: ParsecT s u m Char,
opStart: Parser,
//
//  -- | This parser should accept any legal tail characters of operators.
//  -- Note that this parser should even be defined if the language doesn't
//  -- support user-defined operators, or otherwise the 'reservedOp'
//  -- parser won't work correctly. 
//
//  opLetter       :: ParsecT s u m Char,
opLetter: Parser,
//
//  -- | The list of reserved identifiers. 
//
//  reservedNames  :: [String],
reservedNames: Array,
//
//  -- | The list of reserved operators. 
//
//  reservedOpNames:: [String],
reservedOpNames: Array,
//
//  -- | Set to 'True' if the language is case sensitive. 
//
//  caseSensitive  :: Bool
caseSensitive: Boolean
//
//  }

}]]);



//-----------------------------------------------------------
//-- A first class module: TokenParser
//-----------------------------------------------------------
//
//type TokenParser st = GenTokenParser String st Identity
//
//-- | The type of the record that holds lexical parsers that work on
//-- @s@ streams with state @u@ over a monad @m@.
//

function GenTokenParser(){}

data(GenTokenParser, [["TokenParser", {

//data GenTokenParser s u m
//  = TokenParser {
//
//      -- | This lexeme parser parses a legal identifier. Returns the identifier
//      -- string. This parser will fail on identifiers that are reserved
//      -- words. Legal identifier (start) characters and reserved words are
//      -- defined in the 'LanguageDef' that is passed to
//      -- 'makeTokenParser'. An @identifier@ is treated as
//      -- a single token using 'try'.
//
//      identifier       :: ParsecT s u m String,
identifier: Parser,
//      
//      -- | The lexeme parser @reserved name@ parses @symbol 
//      -- name@, but it also checks that the @name@ is not a prefix of a
//      -- valid identifier. A @reserved@ word is treated as a single token
//      -- using 'try'. 
//
//      reserved         :: String -> ParsecT s u m (),
reserved: Function,
//
//      -- | This lexeme parser parses a legal operator. Returns the name of the
//      -- operator. This parser will fail on any operators that are reserved
//      -- operators. Legal operator (start) characters and reserved operators
//      -- are defined in the 'LanguageDef' that is passed to
//      -- 'makeTokenParser'. An @operator@ is treated as a
//      -- single token using 'try'. 
//
//      operator         :: ParsecT s u m String,
operator: Parser,
//
//      -- |The lexeme parser @reservedOp name@ parses @symbol
//      -- name@, but it also checks that the @name@ is not a prefix of a
//      -- valid operator. A @reservedOp@ is treated as a single token using
//      -- 'try'. 
//
//      reservedOp       :: String -> ParsecT s u m (),
reservedOp: Function,
//
//
//      -- | This lexeme parser parses a single literal character. Returns the
//      -- literal character value. This parsers deals correctly with escape
//      -- sequences. The literal character is parsed according to the grammar
//      -- rules defined in the Haskell report (which matches most programming
//      -- languages quite closely). 
//
//      charLiteral      :: ParsecT s u m Char,
charLiteral: Parser,
//
//      -- | This lexeme parser parses a literal string. Returns the literal
//      -- string value. This parsers deals correctly with escape sequences and
//      -- gaps. The literal string is parsed according to the grammar rules
//      -- defined in the Haskell report (which matches most programming
//      -- languages quite closely). 
//
//      stringLiteral    :: ParsecT s u m String,
stringLiteral: Parser,
//
//      -- | This lexeme parser parses a natural number (a positive whole
//      -- number). Returns the value of the number. The number can be
//      -- specified in 'decimal', 'hexadecimal' or
//      -- 'octal'. The number is parsed according to the grammar
//      -- rules in the Haskell report. 
//
//      natural          :: ParsecT s u m Integer,
natural: Parser,
//
//      -- | This lexeme parser parses an integer (a whole number). This parser
//      -- is like 'natural' except that it can be prefixed with
//      -- sign (i.e. \'-\' or \'+\'). Returns the value of the number. The
//      -- number can be specified in 'decimal', 'hexadecimal'
//      -- or 'octal'. The number is parsed according
//      -- to the grammar rules in the Haskell report. 
//      
//      integer          :: ParsecT s u m Integer,
integer: Parser,
//
//      -- | This lexeme parser parses a floating point value. Returns the value
//      -- of the number. The number is parsed according to the grammar rules
//      -- defined in the Haskell report. 
//
//      float            :: ParsecT s u m Double,
float_: Parser,
//
//      -- | This lexeme parser parses either 'natural' or a 'float'.
//      -- Returns the value of the number. This parsers deals with
//      -- any overlap in the grammar rules for naturals and floats. The number
//      -- is parsed according to the grammar rules defined in the Haskell report. 
//
//      naturalOrFloat   :: ParsecT s u m (Either Integer Double),
naturalOrFloat: Parser,
//
//      -- | Parses a positive whole number in the decimal system. Returns the
//      -- value of the number. 
//
//      decimal          :: ParsecT s u m Integer,
decimal: Parser,
//
//      -- | Parses a positive whole number in the hexadecimal system. The number
//      -- should be prefixed with \"0x\" or \"0X\". Returns the value of the
//      -- number. 
//
//      hexadecimal      :: ParsecT s u m Integer,
hexadecimal: Parser,
//
//      -- | Parses a positive whole number in the octal system. The number
//      -- should be prefixed with \"0o\" or \"0O\". Returns the value of the
//      -- number. 
//
//      octal            :: ParsecT s u m Integer,
octal: Parser,
//
//      -- | Lexeme parser @symbol s@ parses 'string' @s@ and skips
//      -- trailing white space. 
//
//      symbol           :: String -> ParsecT s u m String,
symbol: Function,
//
//      -- | @lexeme p@ first applies parser @p@ and than the 'whiteSpace'
//      -- parser, returning the value of @p@. Every lexical
//      -- token (lexeme) is defined using @lexeme@, this way every parse
//      -- starts at a point without white space. Parsers that use @lexeme@ are
//      -- called /lexeme/ parsers in this document.
//      -- 
//      -- The only point where the 'whiteSpace' parser should be
//      -- called explicitly is the start of the main parser in order to skip
//      -- any leading white space.
//      --
//      -- >    mainParser  = do{ whiteSpace
//      -- >                     ; ds <- many (lexeme digit)
//      -- >                     ; eof
//      -- >                     ; return (sum ds)
//      -- >                     }
//
//      lexeme           :: forall a. ParsecT s u m a -> ParsecT s u m a,
lexeme: Function,
//
//      -- | Parses any white space. White space consists of /zero/ or more
//      -- occurrences of a 'space', a line comment or a block (multi
//      -- line) comment. Block comments may be nested. How comments are
//      -- started and ended is defined in the 'LanguageDef'
//      -- that is passed to 'makeTokenParser'. 
//
//      whiteSpace       :: ParsecT s u m (),
whiteSpace: Parser,
//
//      -- | Lexeme parser @parens p@ parses @p@ enclosed in parenthesis,
//      -- returning the value of @p@.
//
//      parens           :: forall a. ParsecT s u m a -> ParsecT s u m a,
parens: Function,
//
//      -- | Lexeme parser @braces p@ parses @p@ enclosed in braces (\'{\' and
//      -- \'}\'), returning the value of @p@. 
//
//      braces           :: forall a. ParsecT s u m a -> ParsecT s u m a,
braces: Function,
//
//      -- | Lexeme parser @angles p@ parses @p@ enclosed in angle brackets (\'\<\'
//      -- and \'>\'), returning the value of @p@. 
//
//      angles           :: forall a. ParsecT s u m a -> ParsecT s u m a,
angles: Function,
//
//      -- | Lexeme parser @brackets p@ parses @p@ enclosed in brackets (\'[\'
//      -- and \']\'), returning the value of @p@. 
//
//      brackets         :: forall a. ParsecT s u m a -> ParsecT s u m a,
brackets: Function,
//
//      -- | DEPRECATED: Use 'brackets'.
//
//      squares          :: forall a. ParsecT s u m a -> ParsecT s u m a,
squares: Function,
//
//      -- | Lexeme parser |semi| parses the character \';\' and skips any
//      -- trailing white space. Returns the string \";\". 
//
//      semi             :: ParsecT s u m String,
semi: Parser,
//
//      -- | Lexeme parser @comma@ parses the character \',\' and skips any
//      -- trailing white space. Returns the string \",\". 
//
//      comma            :: ParsecT s u m String,
comma: Parser,
//
//      -- | Lexeme parser @colon@ parses the character \':\' and skips any
//      -- trailing white space. Returns the string \":\". 
//
//      colon            :: ParsecT s u m String,
colon: Parser,
//
//      -- | Lexeme parser @dot@ parses the character \'.\' and skips any
//      -- trailing white space. Returns the string \".\". 
//
//      dot              :: ParsecT s u m String,
dot: Parser,
//
//      -- | Lexeme parser @semiSep p@ parses /zero/ or more occurrences of @p@
//      -- separated by 'semi'. Returns a list of values returned by
//      -- @p@.
//
//      semiSep          :: forall a . ParsecT s u m a -> ParsecT s u m [a],
semiSep: Function,
//
//      -- | Lexeme parser @semiSep1 p@ parses /one/ or more occurrences of @p@
//      -- separated by 'semi'. Returns a list of values returned by @p@. 
//
//      semiSep1         :: forall a . ParsecT s u m a -> ParsecT s u m [a],
semiSep1: Function,
//
//      -- | Lexeme parser @commaSep p@ parses /zero/ or more occurrences of
//      -- @p@ separated by 'comma'. Returns a list of values returned
//      -- by @p@. 
//
//      commaSep        :: forall a . ParsecT s u m a -> ParsecT s u m [a]
commaSep: Function,
//
//      -- | Lexeme parser @commaSep1 p@ parses /one/ or more occurrences of
//      -- @p@ separated by 'comma'. Returns a list of values returned
//      -- by @p@. 
//
//      commaSep1        :: forall a . ParsecT s u m a -> ParsecT s u m [a]
commaSep1: Function
//  }
}]]);

//
//-----------------------------------------------------------
//-- Given a LanguageDef, create a token parser.
//-----------------------------------------------------------
//
//-- | The expression @makeTokenParser language@ creates a 'GenTokenParser'
//-- record that contains lexical parsers that are
//-- defined using the definitions in the @language@ record.
//--
//-- The use of this function is quite stylized - one imports the
//-- appropiate language definition and selects the lexical parsers that
//-- are needed from the resulting 'GenTokenParser'.
//--
//-- >  module Main where
//-- >
//-- >  import Text.Parsec
//-- >  import qualified Text.Parsec.Token as P
//-- >  import Text.Parsec.Language (haskellDef)
//-- >
//-- >  -- The parser
//-- >  ...
//-- >
//-- >  expr  =   parens expr
//-- >        <|> identifier
//-- >        <|> ...
//-- >       
//-- >
//-- >  -- The lexer
//-- >  lexer       = P.makeTokenParser haskellDef    
//-- >      
//-- >  parens      = P.parens lexer
//-- >  braces      = P.braces lexer
//-- >  identifier  = P.identifier lexer
//-- >  reserved    = P.reserved lexer
//-- >  ...
//
//makeTokenParser :: (Stream s m Char)
//              => GenLanguageDef s u m -> GenTokenParser s u m
//makeTokenParser languageDef
//  = TokenParser{ identifier = identifier
//               , reserved = reserved
//               , operator = operator
//               , reservedOp = reservedOp
//
//               , charLiteral = charLiteral
//               , stringLiteral = stringLiteral
//               , natural = natural
//               , integer = integer
//               , float = float
//               , naturalOrFloat = naturalOrFloat
//               , decimal = decimal
//               , hexadecimal = hexadecimal
//               , octal = octal
//
//               , symbol = symbol
//               , lexeme = lexeme
//               , whiteSpace = whiteSpace
//
//               , parens = parens
//               , braces = braces
//               , angles = angles
//               , brackets = brackets
//               , squares = brackets
//               , semi = semi
//               , comma = comma
//               , colon = colon
//               , dot = dot
//               , semiSep = semiSep
//               , semiSep1 = semiSep1
//               , commaSep = commaSep
//               , commaSep1 = commaSep1
//               }


function makeTokenParser(languageDef){
    if(!languageDef.LanguageDef)
        throw "Type error: unexpected '" + languageDef.constructor.name + "', expecting 'GenLanguageDef.LanguageDef'";


//  -----------------------------------------------------------
//  -- White space & symbols
//  -----------------------------------------------------------

//  symbol name
//      = lexeme (string name)

function symbol(name){
    return lexeme(string(name));
}


//
//  lexeme p
//      = do{ x <- p; whiteSpace; return x  }

function lexeme(p){
    return do_(bind("x", p), whiteSpace, ret("x") );
}


//
//
//  simpleSpace =
//      skipMany1 (satisfy isSpace)

var simpleSpace =
        skipMany1(satisfy(isSpace));


//
//  oneLineComment =
//      do{ try (string (commentLine languageDef))
//        ; skipMany (satisfy (/= '\n'))
//        ; return ()
//        }

var oneLineComment =
       do$( try_(string(languageDef.commentLine)) )
          ( skipMany, satisfy(function(c){ return c != '\n' }) )
          ( return_, null)


//
//  inCommentSingle
//      =   do{ try (string (commentEnd languageDef)); return () }
//      <|> do{ skipMany1 (noneOf startEnd)         ; inCommentSingle }
//      <|> do{ oneOf startEnd                      ; inCommentSingle }
//      <?> "end of comment"
//      where
//        startEnd   = nub (commentEnd languageDef ++ commentStart languageDef)

var startEnd = nub( slice( languageDef.commentEnd + languageDef.commentStart ) );

function _inCommentSingle(scope, state, k){ return inCommentSingle(scope, state, k) }

var inCommentSingle
            = ex( do_( try_ (string ( languageDef.commentEnd )) , return_(null) )
        ,"<|>", do_( skipMany1(noneOf (startEnd))          , _inCommentSingle )
        ,"<|>", do_( oneOf(startEnd)                       , _inCommentSingle )
        ,"<?>", "end of comment")



//  inCommentMulti
//      =   do{ try (string (commentEnd languageDef)) ; return () }
//      <|> do{ multiLineComment                     ; inCommentMulti }
//      <|> do{ skipMany1 (noneOf startEnd)          ; inCommentMulti }
//      <|> do{ oneOf startEnd                       ; inCommentMulti }
//      <?> "end of comment"
//      where
//        startEnd   = nub (commentEnd languageDef ++ commentStart languageDef)

function _inCommentMulti(scope, state, k){ return inCommentMulti(scope, state, k) }

var inCommentMulti
            = ex( do_( try_ (string ( languageDef.commentEnd )) , return_(null) )
        ,"<|>", do_( _multiLineComment                     , _inCommentMulti )
        ,"<|>", do_( skipMany1(noneOf (startEnd))          , _inCommentMulti )
        ,"<|>", do_( oneOf(startEnd)                       , _inCommentMulti )
        ,"<?>", "end of comment")



//  inComment
//      | nestedComments languageDef  = inCommentMulti
//      | otherwise                = inCommentSingle

var inComment = languageDef.nestedComments ? inCommentMulti : inCommentSingle;


//  multiLineComment =
//      do { try (string (commentStart languageDef))
//         ; inComment
//         }

function _multiLineComment(scope, state, k){ return multiLineComment(scope, state, k) }

var multiLineComment =
        do_( try_ (string (languageDef.commentStart))
           , inComment);


//  whiteSpace
//      | noLine && noMulti  = skipMany (simpleSpace <?> "")
//      | noLine             = skipMany (simpleSpace <|> multiLineComment <?> "")
//      | noMulti            = skipMany (simpleSpace <|> oneLineComment <?> "")
//      | otherwise          = skipMany (simpleSpace <|> oneLineComment <|> multiLineComment <?> "")
//      where
//        noLine  = null (commentLine languageDef)
//        noMulti = null (commentStart languageDef)

var noLine   = null_(languageDef.commentLine);
var noMulti  = null_(languageDef.commentStart);

var whiteSpace = exs(
    (noLine && noMulti) ? [skipMany, [simpleSpace ,"<?>", ""]] :
    noLine              ? [skipMany, [simpleSpace ,"<|>", multiLineComment ,"<?>", ""]] :
    noMulti             ? [skipMany, [simpleSpace ,"<|>", oneLineComment ,"<?>", ""]] :
                          [skipMany, [simpleSpace ,"<|>", oneLineComment ,"<|>", multiLineComment ,"<?>", ""]]
    );




//  -----------------------------------------------------------
//  -- Bracketing
//  -----------------------------------------------------------
//  parens p        = between (symbol "(") (symbol ")") p
//  braces p        = between (symbol "{") (symbol "}") p
//  angles p        = between (symbol "<") (symbol ">") p
//  brackets p      = between (symbol "[") (symbol "]") p
//
//  semi            = symbol ";"
//  comma           = symbol ","
//  dot             = symbol "."
//  colon           = symbol ":"
//
//  commaSep p      = sepBy p comma
//  semiSep p       = sepBy p semi
//
//  commaSep1 p     = sepBy1 p comma
//  semiSep1 p      = sepBy1 p semi



function parens(p){
    return between(symbol("("), symbol(")"), p);
}
function braces(p){
    return between(symbol("{"), symbol("}"), p);
}
function angles(p){
    return between(symbol("<"), symbol(">"), p);
}
function brackets(p){
    return between(symbol("["), symbol("]"), p);
}

var semi  = symbol(";");
var comma = symbol(",");
var dot   = symbol(".");
var colon = symbol(":");

function commaSep(p){
    return sepBy(p, comma);
}
function semiSep(p){
    return sepBy(p, semi);
}

function commaSep1(p){
    return sepBy1(p, comma);
}
function semiSep1(p){
    return sepBy1(p, semi);
}



//  -----------------------------------------------------------
//  -- Chars & Strings
//  -----------------------------------------------------------


var ascii2codes     = ["BS","HT","LF","VT","FF","CR","SO","SI","EM",
                       "FS","GS","RS","US","SP"];

var ascii3codes     = ["NUL","SOH","STX","ETX","EOT","ENQ","ACK","BEL",
                       "DLE","DC1","DC2","DC3","DC4","NAK","SYN","ETB",
                       "CAN","SUB","ESC","DEL"];


var ascii2          = ['\BS','\HT','\LF','\VT','\FF','\CR','\SO','\SI',
                       '\EM','\FS','\GS','\RS','\US','\SP'];

var ascii3          = ['\NUL','\SOH','\STX','\ETX','\EOT','\ENQ','\ACK',
                       '\BEL','\DLE','\DC1','\DC2','\DC3','\DC4','\NAK',
                       '\SYN','\ETB','\CAN','\SUB','\ESC','\DEL'];


//  -- escape code tables
//  escMap          = zip ("abfnrtv\\\"\'") ("\a\b\f\n\r\t\v\\\"\'")
//  asciiMap        = zip (ascii3codes ++ ascii2codes) (ascii3 ++ ascii2)

var escMap          = zip(slice("abfnrtv\\\"\'"), slice("\a\b\f\n\r\t\v\\\"\'"));
var asciiMap        = zip(ascii3codes.concat(ascii2codes), ascii3.concat(ascii2));

//
//  charEsc         = choice (map parseEsc escMap)
//                  where
//                    parseEsc (c,code)     = do{ char c; return code }

var charEsc         = choice(map(parseEsc, escMap));
                    
function parseEsc(tuple){
    return do_( char_(tuple[0]), return_(tuple[1]) );
}


//  charAscii       = choice (map parseAscii asciiMap)
//                  where
//                    parseAscii (asc,code) = try (do{ string asc; return code })

var charAscii       = choice(map(parseAscii, asciiMap));

function parseAscii(tuple){
    return try_(do_( string(tuple[0]), return_(tuple[1]) ));
}


//  stringLetter    = satisfy (\c -> (c /= '"') && (c /= '\\') && (c > '\026'))

var stringLetter    = satisfy(function(c){
                            return (c != '"') && (c != '\\') && (c > '\026');
                      });


//  escapeEmpty     = char '&'

var escapeEmpty     = char_('&');


//  escapeGap       = do{ many1 space
//                      ; char '\\' <?> "end of string gap"
//                      }

var escapeGap       = do$( many1, space )
                         ( char_('\\') ,"<?>", "end of string gap")
                        

//  charNum         = do{ code <- decimal
//                                <|> do{ char 'o'; number 8 octDigit }
//                                <|> do{ char 'x'; number 16 hexDigit }
//                      ; return (toEnum (fromInteger code))
//                      }

var charNum         = do$( "code" ,"<-", _decimal
                                      ,"<|>", do_( char_('o'), number(8, octDigit) )
                                      ,"<|>", do_( char_('x'), number(16, hexDigit) )
                         )
                         ( ret(function(scope){ return toEnum(fromInteger(scope.code)) }) )


//  charControl     = do{ char '^'
//                      ; code <- upper
//                      ; return (toEnum (fromEnum code - fromEnum 'A'))
//                      }

var charControl     = do$( char_('^') )
                         ( "code" ,"<-", upper )
                         ( ret(function(scope){ return toEnum(fromEnum(scope.code) - fromEnum('A'))  }) )
 

//  -- escape codes
//  escapeCode      = charEsc <|> charNum <|> charAscii <|> charControl
//                  <?> "escape code"

var escapeCode      = ex(charEsc ,"<|>", charNum ,"<|>", charAscii ,"<|>", charControl
                    ,"<?>", "escape code")


//  charEscape      = do{ char '\\'; escapeCode }

var charEscape      = do_(char_('\\'), escapeCode);



//  charLetter      = satisfy (\c -> (c /= '\'') && (c /= '\\') && (c > '\026'))

var charLetter      = satisfy(function(c){
                            return (c != '\'') && (c != '\\') && (c > '\026');
                      });


//
//  characterChar   = charLetter <|> charEscape
//                  <?> "literal character"

var characterChar   = ex(charLetter ,"<|>", charEscape
                    ,"<?>", "literal character")


//  charLiteral     = lexeme (between (char '\'')
//                                    (char '\'' <?> "end of character")
//                                    characterChar )
//                  <?> "character"

var charLiteral     = ex(lexeme, [between, char_('\''), 
                                    [char_('\'') ,"<?>", "end of character"],
                                    characterChar]
                    ,"<?>", "character");


//
//  stringEscape    = do{ char '\\'
//                      ;     do{ escapeGap  ; return Nothing }
//                        <|> do{ escapeEmpty; return Nothing }
//                        <|> do{ esc <- escapeCode; return (Just esc) }
//                      }

var stringEscape    = do$( char_('\\') )
                         (        do_( escapeGap,   return_(Maybe.Nothing) )
                          ,"<|>", do_( escapeEmpty, return_(Maybe.Nothing) )
                          ,"<|>", do$( "esc" ,"<-", escapeCode)
                                     ( returnCall, Maybe.Just, "esc" )
                         )


//  stringChar      =   do{ c <- stringLetter; return (Just c) }
//                  <|> stringEscape
//                  <?> "string character"

var stringChar      = ex(do$( "c" ,"<-", stringLetter )
                            ( returnCall, Maybe.Just, "c" )
                      ,"<|>", stringEscape
                      ,"<?>", "string character");


//  stringLiteral   = lexeme (
//                    do{ str <- between (char '"')
//                                       (char '"' <?> "end of string")
//                                       (many stringChar)
//                      ; return (foldr (maybe id (:)) "" str)
//                      }
//                    <?> "literal string")

var stringLiteral   = ex(lexeme,
                          [do$( "str", "<-", between, char_('"'),
                                                      [char_('"') ,"<?>", "end of string"],
                                                      [many, stringChar]
                               )
                               (ret, function(scope){ return foldr(curry(maybe)(id, curry(cons)), "", scope.str) })
                          ,"<?>", "literal string"]
                      );



//  -----------------------------------------------------------
//  -- Numbers
//  -----------------------------------------------------------


//  number base baseDigit
//      = do{ digits <- many1 baseDigit
//          ; let n = foldl (\x d -> base*x + toInteger (digitToInt d)) 0 digits
//          ; seq n (return n)
//          }

function number(base, baseDigit){ 
    return do$( "digits" ,"<-", many1, baseDigit )
              ( ret, function(scope){
                        return foldl(function(x, d){
                                  return base * x + toInteger(digitToInt(d));
                              }, 0, scope.digits);
              })
}


//  decimal         = number 10 digit
//  hexadecimal     = do{ oneOf "xX"; number 16 hexDigit }
//  octal           = do{ oneOf "oO"; number 8 octDigit  }

function _decimal(scope, state, k){ return decimal(scope, state, k) }

var decimal         = number(10, digit);
var hexadecimal     = do$( oneOf, "xX" ) ( number, 16, hexDigit )
var octal           = do$( oneOf, "oO" ) ( number, 8, octDigit  )



//
//  fraction        = do{ char '.'
//                      ; digits <- many1 digit <?> "fraction"
//                      ; return (foldr op 0.0 digits)
//                      }
//                    <?> "fraction"
//                  where
//                    op d f    = (f + fromIntegral (digitToInt d))/10.0

function _op(d, f){
    return (f + fromIntegral(digitToInt(d))) / 10.0;
}

var fraction        = ex(do$( char_('.'))
                            ( "digits" ,"<-", many1, digit ,"<?>", "fraction")
                            ( ret, function(scope){ return foldr(_op, 0.0, scope.digits) })
                        ,"<?>", "fraction")



//
//  sign            =   (char '-' >> return negate)
//                  <|> (char '+' >> return id)
//                  <|> return id

var sign            = ex([char_('-') ,">>", return_, negate]
                            ,"<|>", [char_('+') ,">>", return_, id]
                            ,"<|>", return_, id);


//
//  exponent'       = do{ oneOf "eE"
//                      ; f <- sign
//                      ; e <- decimal <?> "exponent"
//                      ; return (power (f e))
//                      }
//                    <?> "exponent"
//                  where
//                     power e  | e < 0      = 1.0/power(-e)
//                              | otherwise  = fromInteger (10^e)

function power(e){
    return (e < 0) ?  1.0 / power(-e) :  fromInteger(Math.pow(10,e));
}

var exponent_       = ex(do$( oneOf, "eE" )
                            ( "f" ,"<-", sign )
                            ( "e" ,"<-", decimal ,"<?>", "exponent" )
                            ( returnCall, power, "f", "e")
                        ,"<?>", "exponent");



//  fractExponent n = do{ fract <- fraction
//                      ; expo  <- option 1.0 exponent'
//                      ; return ((fromInteger n + fract)*expo)
//                      }
//                  <|>
//                    do{ expo <- exponent'
//                      ; return ((fromInteger n)*expo)
//                      }

function fractExponent(n){
    return ex(
         do$( "fract" ,"<-", fraction )
            ( "expo"  ,"<-", option, 1.0, exponent_ )
            ( ret, function(scope){ return fromInteger(n + scope.fract) * scope.expo })
        ,"<|>",
         do$( "expo", "<-", exponent_ )
            ( ret, function(scope){ return fromInteger(n) * scope.expo })
    );
}

//  -- floats
//  floating        = do{ n <- decimal
//                      ; fractExponent n
//                      }

var floating        = do$( "n" ,"<-", decimal)
                         ( function(scope, state, k){ return fractExponent(scope.n)(scope, state, k) })


//  fractFloat n    = do{ f <- fractExponent n
//                      ; return (Right f)
//                      }

function fractFloat(n){
    return do$( "f" ,"<-", fractExponent, n)
              ( returnCall, Either.Right, "f")
}


//
//  decimalFloat    = do{ n <- decimal
//                      ; option (Left n)
//                               (fractFloat n)
//                      }

var decimalFloat    = do$( "n" ,"<-", decimal )
                         ( function(scope, state, k){ 
                               return option(Either.Left(scope.n), fractFloat(scope.n))(scope, state, k);
                         })


//  zeroNumFloat    =  do{ n <- hexadecimal <|> octal
//                       ; return (Left n)
//                       }
//                  <|> decimalFloat
//                  <|> fractFloat 0
//                  <|> return (Left 0)


var zeroNumFloat    = ex(do$( "n" ,"<-", hexadecimal ,"<|>", octal )
                            ( returnCall, Either.Left, "n" )
                       ,"<|>", decimalFloat
                       ,"<|>", fractFloat(0)
                       ,"<|>", return_, Either.Left(0)
                       );




//  natFloat        = do{ char '0'
//                      ; zeroNumFloat
//                      }
//                    <|> decimalFloat

var natFloat        = ex(do_( char_('0'),
                            zeroNumFloat
                            )
                      ,"<|>", decimalFloat);



//  zeroNumber      = do{ char '0'
//                      ; hexadecimal <|> octal <|> decimal <|> return 0
//                      }
//                    <?> ""

var zeroNumber      = ex(do$( char_, '0')
                            ( hexadecimal ,"<|>", octal ,"<|>", decimal ,"<|>", return_, 0 )
                      ,"<?>", "");


//  nat             = zeroNumber <|> decimal

var nat             = parserPlus(zeroNumber, decimal);

//  -- integers and naturals
//  int             = do{ f <- lexeme sign
//                      ; n <- nat
//                      ; return (f n)
//                      }

var int_            = do$( "f" ,"<-", lexeme, sign )
                         ( "n" ,"<-", nat )
                         ( ret, function(scope){ return scope.f(scope.n) })



//  naturalOrFloat  = lexeme (natFloat) <?> "number"
//
//  float           = lexeme floating   <?> "float"
//  integer         = lexeme int        <?> "integer"
//  natural         = lexeme nat        <?> "natural"

var naturalOrFloat  = exs(lexeme, natFloat   ,"<?>", "number" );

var float_          = exs(lexeme, floating   ,"<?>", "float"  );
var integer         = exs(lexeme, int_       ,"<?>", "integer");
var natural         = exs(lexeme, nat        ,"<?>", "natural");




//  -----------------------------------------------------------
//  -- Operators & reserved ops
//  -----------------------------------------------------------


//  reservedOp name =
//      lexeme $ try $
//      do{ string name
//        ; notFollowedBy (opLetter languageDef) <?> ("end of " ++ show name)
//        }

function reservedOp(name){
    return ex(lexeme ,"$", try_,
                do$( string(name) ) 
                   ( notFollowedBy, languageDef.opLetter ,"<?>", "end of " + name )
            );
}


//  oper =
//      do{ c <- (opStart languageDef)
//        ; cs <- many (opLetter languageDef)
//        ; return (c:cs)
//        }
//      <?> "operator"

var oper =
        ex(do$( "c"  ,"<-", languageDef.opStart )
              ( "cs" ,"<-", many, languageDef.opLetter )
              ( returnCall, consJoin, "c", "cs" )
         ,"<?>", "operator");


//  isReservedOp name =
//      isReserved (sort (reservedOpNames languageDef)) name

function isReservedOp(name){
        return isReserved( isort( languageDef.reservedOpNames ), name);
}


//  operator =
//      lexeme $ try $
//      do{ name <- oper
//        ; if (isReservedOp name)
//           then unexpected ("reserved operator " ++ show name)
//           else return name
//        }

var operator =
        ex(lexeme ,"$", try_,
           do$( "name" ,"<-", oper )
              ( function(scope, state, k){
                    return (isReservedOp(scope.name) ? 
                        unexpected("reserved operator " + scope.name) :
                        return_(scope.name) )
                    (scope, state, k);
              })
        );





//  -----------------------------------------------------------
//  -- Identifiers & Reserved words
//  -----------------------------------------------------------


//  caseString name
//      | caseSensitive languageDef  = string name
//      | otherwise               = do{ walk name; return name }
//      where
//        walk []     = return ()
//        walk (c:cs) = do{ caseChar c <?> msg; walk cs }
//
//        caseChar c  | isAlpha c  = char (toLower c) <|> char (toUpper c)
//                    | otherwise  = char c
//
//        msg         = show name

function caseString(name){

    function walk(cs){
        return (!cs.length) ? return_(null) :
                       do_( label(caseChar(cs[0]), "" + name),
                            walk(slice(cs, 1)) );
    }

    function caseChar(c){
        return isAlpha(c) ? parserPlus( char_(c.toLowerCase()),
                                        char_(c.toUpperCase())) : 
                            char_(c);
    }

    return languageDef.caseSensitive ? string(name) : do_( walk(name), return_(name) );

}

//  reserved name =
//      lexeme $ try $
//      do{ caseString name
//        ; notFollowedBy (identLetter languageDef) <?> ("end of " ++ show name)
//        }

function reserved(name){
    return ex(lexeme ,"$", try_,
              do$( caseString(name) )
                 ( notFollowedBy, languageDef.identLetter ,"<?>", "end of " + name )
            );
}


//  ident
//      = do{ c <- identStart languageDef
//          ; cs <- many (identLetter languageDef)
//          ; return (c:cs)
//          }
//      <?> "identifier"

var ident
        = ex(do$( "c"  ,"<-", languageDef.identStart )
                ( "cs" ,"<-", many, languageDef.identLetter )
                ( returnCall, consJoin, "c", "cs" )
           ,"<?>", "identifier");


//  isReserved names name
//      = scan names
//      where
//        scan []       = False
//        scan (r:rs)   = case (compare r name) of
//                          LT  -> scan rs
//                          EQ  -> True
//                          GT  -> False

function isReserved(names, name){
    //var compare = getInstance(Ord, name).compare; //TODO
    var compare = unsafeCompare;
    function scan(rs){
        if(!rs.length) 
            return false;

        var ord = compare(rs[0], name);

        return  ord.LT ? scan(slice(rs, 1)) :
                ord.EQ ? true : 
                ord.GT ? false : null;
    }

    return scan(names);
}


//  isReservedName name
//      = isReserved theReservedNames caseName
//      where
//        caseName      | caseSensitive languageDef  = name
//                      | otherwise               = map toLower name

function isReservedName(name){
    var caseName = languageDef.caseSensitive ? name : name.toLowerCase();

    return isReserved(theReservedNames, caseName);
}


//  identifier =
//      lexeme $ try $
//      do{ name <- ident
//        ; if (isReservedName name)
//           then unexpected ("reserved word " ++ show name)
//           else return name
//        }

var identifier =
        ex(lexeme ,"$", try_,
           do$( "name" ,"<-", ident )
              ( function(scope, state, k){
                    return ( isReservedName(scope.name) ? 
                                unexpected("reserved word " + scope.name) : 
                                return_(scope.name)
                            )(scope, state, k);
              })
        );


//  theReservedNames
//      | caseSensitive languageDef  = sortedNames
//      | otherwise               = map (map toLower) sortedNames
//      where
//        sortedNames   = sort (reservedNames languageDef)

var sortedNames = isort(languageDef.reservedNames);
var theReservedNames = languageDef.caseSensitive ? 
                            sortedNames : 
                            map( function(str){ return str.toLowerCase() }, sortedNames );



    return GenTokenParser.TokenParser(record, {
        identifier : identifier,
        reserved   : reserved,
        operator   : operator,
        reservedOp : reservedOp,
        
        charLiteral    : charLiteral,
        stringLiteral  : stringLiteral,
        natural        : natural,
        integer        : integer,
        float_         : float_,
        naturalOrFloat : naturalOrFloat,
        decimal        : decimal,
        hexadecimal    : hexadecimal,
        octal          : octal,
        
        symbol     : symbol,
        lexeme     : lexeme,
        whiteSpace : whiteSpace,
        
        parens     : parens,
        braces     : braces,
        angles     : angles,
        brackets   : brackets,
        squares    : brackets,
        semi       : semi,
        comma      : comma,
        colon      : colon,
        dot        : dot,
        semiSep    : semiSep,
        semiSep1   : semiSep1,
        commaSep   : commaSep,
        commaSep1  : commaSep1
    });
}


namespace("Text_Parsec_Token", {
    GenLanguageDef  : GenLanguageDef,
    GenTokenParser  : GenTokenParser,
    makeTokenParser : makeTokenParser
});