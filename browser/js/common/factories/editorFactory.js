app.factory('EditorFactory', function () {
    var editor = ace.edit('editor');
    editor.setByAPI = false;
    editor.setFontSize(14);
    editor.setTheme("ace/theme/monokai");
    editor.$blockScrolling = Infinity;
    editor.getSession().setMode("ace/mode/javascript");
    var themes = ["Chrome", "Clouds", "Clouds Midnight", "Cobalt", "Crimson Editor", "Dawn", "Eclipse", "Idle Fingers", "Kr Theme", "Merbivore", "Merbivore Soft", "Mono Industrial", "Monokai", "Pastel On Dark", "Solarized Dark", "Solarized Light", "TextMate", "Tomorrow", "Tomorrow Night", "Tomorrow Night Blue", "Tomorrow Night Bright", "Tomorrow Night Eighties", "Twilight", "Vibrant Ink"];
    var languages = ["abap","abc","actionscript","ada","apache_conf","asciidoc","assembly_x86","autohotkey","batchfile","c_cpp","c9search","cirru","clojure","cobol","coffee","coldfusion","csharp","css","curly","d","dart","diff","dockerfile","dot","dummy","dummysyntax","eiffel","ejs","elixir","elm","erlang","forth","ftl","gcode","gherkin","gitignore","glsl","golang","groovy","haml","handlebars","haskell","haxe","html","html_ruby","ini","io","jack","jade","java","javascript","json","jsoniq","jsp","jsx","julia","latex","lean","less","liquid","lisp","livescript","logiql","lsl","lua","luapage","lucene","makefile","markdown","mask","matlab","maze","mel","mushcode","mysql","nix","objectivec","ocaml","pascal","perl","pgsql","php","powershell","praat","prolog","properties","protobuf","python","r","rdoc","rhtml","ruby","rust","sass","scad","scala","scheme","scss","sh","sjs","smarty","snippets","soy_template","space","sql","sqlserver","stylus","svg","tcl","tex","text","textile","toml","twig","django","typescript","vala","vbscript","velocity","verilog","vhdl","xml","xquery","yaml"];
    function changeTheme(theme) {
        editor.setTheme('ace/theme/' + theme.toLowerCase());
    }

    function changeLanguage(language) {
        editor.getSession().setMode('ace/mode/' + language.toLowerCase());
    }

    return {
        editor,
        changeTheme,
        themes,
        languages,
        changeLanguage
    };
});
