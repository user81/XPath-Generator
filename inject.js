function hello (str){
    console.log("hello "+str);
}
(function () {

        window.xpathGenerator = true;

        var oldEPD = Event.prototype.preventDefault;
        var oldESP = Event.prototype.stopPropagation;
        Event.prototype.preventDefault = function () {
            if (this.type === "keydown") {
                document.onkeydown(this);
            } else if (this.type === "mousemove") {
                OS_MOUSE_MOVE(this);
            }
            oldEPD.call(this);
        };
        Event.prototype.stopPropagation = function () {
            if (this.type === "keydown") {
                document.onkeydown(this);
            } else if (this.type === "mousemove") {
                OS_MOUSE_MOVE(this);
            }
            oldESP.call(this);
        };


        var COUNTER_MOUSE_OVER = 0;
        var COUNTER_TRY_XPATH = 0;
        window.ELEMENT_MOUSE_OVER = null;
        var OS_OLD_MOUSE_MOVE = document.body.onmousemove;
        document.body.onmousemove = function (e) {
            OS_MOUSE_MOVE(e);
            if (typeof OS_OLD_MOUSE_MOVE === "function") {
                OS_OLD_MOUSE_MOVE(e)
            }
        };

        function OS_MOUSE_MOVE(e) {
            var elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
            if (document.getElementById('os-style-over-helper') && window.ELEMENT_MOUSE_OVER !== elementMouseIsOver) {
                document.getElementById('os-style-over-helper').innerHTML = "[currentmouseover='" + (++COUNTER_MOUSE_OVER) + "']{box-shadow: 0px 0px 20px 1px #04aec6 !important;}";
                window.ELEMENT_MOUSE_OVER = elementMouseIsOver;
                elementMouseIsOver.setAttribute("currentmouseover", "" + COUNTER_MOUSE_OVER);
            }
        }

        function OS_TRY_XPATH(xpath) {
            var arr = __x(xpath);
            document.getElementById('os-style-try-helper').innerHTML = "[currentxpathtry='" + (++COUNTER_TRY_XPATH) + "']{box-shadow: 0px 0px 20px 1px #E82895 !important;}";
            document.getElementById('os-try-it-found').innerHTML = "&nbsp;(" + arr.length + ")";
            for (var i = 0; i < arr.length; i++) {
                arr[i].setAttribute("currentxpathtry", "" + COUNTER_TRY_XPATH);
            }
        }

        if (!document.getElementById('os-style-over-helper')) {
            var elem = document.createElement("style");
            elem.id = "os-style-over-helper";
            document.head.appendChild(elem);
        }
        if (!document.getElementById('os-style-try-helper')) {
            var elem = document.createElement("style");
            elem.id = "os-style-try-helper";
            document.head.appendChild(elem);
        }

        if (!document.getElementById('os-record-interface')) {
            var elem = document.createElement("div");
            elem.id = "os-record-interface";
            __x("html")[0].appendChild(elem);
            document.getElementById('os-record-interface').innerHTML = "" +
                "<div class='os-block'>" +
                "   <div id='os-switch-side'></div>" +
                "   <h1 class='os-title'>XPath Generator 1.1.0</h1><br />" +
                "   <span class='os-label'>Press <strong>[ALT + A]</strong> on a dom element to generate its unique XPath <strong>(i)</strong></span>" +
                "   <textarea class='os-textarea' id='os-execution-prefix' placeholder='<optional XPath prefix>'></textarea>" +
                "   <textarea class='os-textarea' id='os-execution-result' placeholder='<evaluated XPath result>'></textarea><br/>" +
                "   <div style='text-align: right'><span class='os-label'>" +
                "       <strong style='text-decoration: underline;cursor:pointer;' onclick=\"document.getElementById('os-execution-prefix').value=document.getElementById('os-execution-result').value\">Copy as prefix</strong>" +
                "       -" +
                "       <strong style='text-decoration: underline;cursor:pointer;' id='os-execution-try'>Test it<b style='font-weight: normal' id='os-try-it-found'></b></strong>" +
                "       -" +
                "       <strong style='text-decoration: underline;cursor:pointer;' id='os-execution-clear-xpath'>Test clear</strong>" +
                "</span></div>" +
                "</div>" +
                "" +
                "   <div class='os-block'><span class='os-label'>XPath options to be used by the algorithm <strong>(i)<div class='os-tooltip'>" +
                "   <strong>TODO</strong><br/></div>" +
                "   </strong></span>" +
                "   <span class='os-label' style='display:none;font-size:10px;color:red;margin-top:5px;' id='os-execution-options-error'>Invalid options : it must be an array of String</span>" +
                "   <div class='os-options-list-container'>" +
                "       <ul id='os-options-list-selected'>" +
                "           <li class='os-draggable'><span class='os-checkbox'></span><span class='os-value'>tagName</span><span class='os-lock'></span></li>" +
                "           <li class='os-draggable'><span class='os-checkbox'></span><span class='os-value'>@id</span><span class='os-lock os-unlock'></span><span class='os-match os-contains'>A</span></li>" +
                "           <li class='os-draggable'><span class='os-checkbox'></span><span class='os-value'>@class</span><span class='os-lock os-unlock'></span><span class='os-match os-contains'>A</span></li>" +
                "           <li class='os-draggable'><span class='os-checkbox'></span><span class='os-value'>childPosition</span><span class='os-lock os-unlock'></span><span class='os-match'>A</span></li>" +
                "       </ul>" +
                "       <ul id='os-options-list-not-selected'>" +
                "           <li><span class='os-checkbox'></span><span class='os-value'>innerText</span></li>" +
                /*"           <li><span class='os-checkbox'></span><span class='os-value'>@href</span></li>" +
                "           <li><span class='os-checkbox'></span><span class='os-value'>@name</span></li>" +
                "           <li><span class='os-checkbox'></span><span class='os-value'>@src</span></li>" +
                "           <li><span class='os-checkbox'></span><span class='os-value'>@type</span></li>" +
                "           <li><span class='os-checkbox'></span><span class='os-value'>@value</span></li>" +*/
                "       </ul>" +
                "      <div style='clear:both'></div>" +
                "   </div>" +
                "" +
                "   <textarea class='os-textarea' id='os-execution-options' style='display: none;'>['_tag!', 'id', 'class', '_position']</textarea>" +
                "   <div style='text-align: right'><span class='os-label'><span style='font-size:11px;font-family: monospace;color:#626770;'>@</span><input type='text' class='os-text-input' id='os-additional-option' placeholder='additionalAttr'/>&nbsp; " +
                "   <strong style='text-decoration: underline;cursor:pointer;' id='os-add-additional-attribute'>Add</strong></span></div></div>" +

                "" +
                "     <div class='os-block'><span class='os-label'>List of XPath generated by the algorithm <strong> (i)</strong></span>" +
                "     <span class='os-label' style='display:none;font-size:10px;color:red;margin-top:5px;' id='os-execution-prefix-error'>This prefix must target 1 element, currently <b id='os-execution-prefix-target' style='font-weight:normal'>0</b></span>" +
                "     <br /><br />" +
                "     <ul id='os-algorithm-history-head'>" +
                "         <li>" +
                "           <span>Try</span><span style='width:216px;height:18px;border-left:1px #565b64 solid;border-right:1px #565b64 solid;'>XPath</span><span style='text-align:right;'>Match</span>" +
                "         </li>" +
                "     </ul>" +
                "     <ul id='os-algorithm-history' class='os-scrollable'>" +
                "     </ul><br /><br />" +
                "     <div style='text-align: right;display:none;'><span class='os-label'><strong style='text-decoration: underline;cursor:pointer;' " +
                "       onclick=\"document.getElementById('os-execution-prefix-error').style.display='none';document.getElementById('os-execution-prefix').value='';\">Clear prefix</strong></span></div></div>" +
                "<br />";
        }
        if (!document.getElementById('os-record-interface-stylesheet')) {
            var elem = document.createElement("style");
            elem.id = "os-record-interface-stylesheet";
            document.head.appendChild(elem);
            var orientation = getNewOrientation();
            setStylesheet(orientation);
            setChangeOrientation(orientation);
        }

        function getNewOrientation() {
            return document.getElementById('os-record-interface-stylesheet').innerHTML.indexOf("html{padding-right") === -1 ? "right" : "left";
        }

        function setChangeOrientation(orientation) {
            document.getElementById('os-switch-side').innerHTML = orientation === "right" ? "&blacktriangleleft;" : "&blacktriangleright;";
        }

        function setStylesheet(orientation) {
            document.getElementById('os-record-interface-stylesheet').innerHTML = "" +
                "html{padding-" + orientation + ":400px !important;}" +
                "#os-record-interface{padding:15px;display:block;position:fixed;top:0;" + orientation + ":0;bottom:0;width:400px;z-index:9999999;background-color:#18191c;font-family:monospace;font-size:13px;color:#d0d0d0;box-shadow:none !important;}" +
                "#os-record-interface div.os-block{background-color:#202226;border:1px #26282c solid;padding:10px 20px;box-shadow:none !important;position:relative;}" +
                "#os-record-interface h1.os-title{font-family:monospace;font-size:13px;color:#04aec6 !important;line-height:1.3;padding:10px 0;margin:0;box-shadow:none !important;}" +
                "#os-record-interface span.os-label{line-height:1.3;color:#d0d0d0;font-family:monospace;font-size:13px;box-shadow:none !important;}" +
                "#os-record-interface div.os-copyright{position:absolute;bottom:10px;left:0;right:0;text-align:center;line-height:1.3;color:#d0d0d0;font-family:monospace;font-size:10px;box-shadow:none !important;opacity:0.7}" +
                "#os-record-interface span.os-label strong{font-weight:normal;color:#04aec6;cursor:help;box-shadow:none !important;position:relative;}" +
                "#os-record-interface textarea.os-textarea{box-sizing:border-box;overflow:hidden;background-color:#202226;border:1px #04aec6 solid;font-family:monospace;font-size:10px;color:#d0d0d0 !important;width:100%;height:50px;box-shadow:none !important;padding:5px;}" +
                "#os-record-interface input.os-text-input{box-sizing:border-box;overflow:hidden;background-color:#202226;border:#565b64 1px solid;font-family:monospace;font-size:10px;color:#d0d0d0 !important;width:87px;height:18px;box-shadow:none !important;padding:5px 1px;margin-left:2px;}" +
                "#os-record-interface div, #os-record-interface strong, #os-record-interface span, #os-record-interface b{box-shadow:none !important;}" +
                "#os-switch-side{color:#04aec6;font-size:28px;position:absolute;top:17px;right:20px;cursor:pointer;line-height:21px;}" +
                ".os-tooltip{z-index:99999999;position:absolute;width:350px;background-color:#202226;border:1px #04aec6 solid;top:20px;" + orientation + ":15px;display:none;padding:10px;font-size:10px; color:#d0d0d0;}" +
                "strong:hover .os-tooltip{display:block;}" +
                "#os-record-interface textarea.os-textarea#os-execution-prefix{margin: 10px 0 2px 0;height: 25px;border: #565b64 1px solid;color: #565b64 !important;}" +
                "" +
                "" +
                ".os-options-list-container{padding:10px;}" +
                "#os-options-list-selected{width:180px;float:left;margin: 0;padding: 0;border: 0;font-size: 100%;font: inherit;vertical-align: baseline;list-style: none;font-size:12px;line-height:18px;color:#04aec6;position:relative;}" +
                "#os-options-list-selected li{box-sizing:border-box;}" +
                "#os-options-list-selected li span{display:inline-block;box-sizing: content-box;vertical-align:middle;}" +
                "#os-options-list-selected li .os-checkbox{position:relative;margin-right:10px;height:10px;width:10px;border:1px #04aec6 solid;display:inline-block;cursor:pointer;}" +
                "#os-options-list-selected li .os-checkbox::after{box-sizing: content-box;position:absolute;width:3px;height:8px;content:'';border-left:1px #04aec6 solid;border-top:1px #04aec6 solid;transform: rotate(-140deg);cursor:pointer;left:3px;top:-2px;cursor:pointer;}" +
                "#os-options-list-selected li .os-lock{vertical-align:bottom;margin:0 10px;margin-bottom:5px; cursor:pointer; position:relative; height:4px;width:6px;border:1px #04aec6 solid;background-color:#04aec6;}" +
                "#os-options-list-selected li .os-lock::before{box-sizing: content-box;position:absolute;top:-6px;left:0px;height:6px;width:4px;border-radius:4px;border:1px #04aec6 solid;content:''}" +
                "#os-options-list-selected li .os-lock.os-unlock{border:1px #565b64 solid;background-color:#565b64;}" +
                "#os-options-list-selected li .os-lock.os-unlock::before{border:1px #565b64 solid;box-sizing: content-box;}" +
                "#os-options-list-selected li .os-lock.os-unlock::after{box-sizing: content-box;position:absolute;width:3px;height:3px;background-color:#202226;content:'';top:-4px;left:-1px;}" +
                "#os-options-list-selected li .os-match{font-size:15px;font-style: italic;cursor:pointer;display:none;}" +
                "#os-options-list-selected li .os-match.os-contains{color:#565b64;}" +
                "#os-options-list-selected li.os-drop-slot{border-top:6px #202226 solid;}" +
                "#os-options-list-selected li .os-value{cursor:move;}" +
                "" +
                "#os-options-list-not-selected{width:125px;float:left;margin: 0;padding: 0;border: 0;font-size: 100%;font: inherit;vertical-align: baseline;list-style: none;font-size:12px;line-height:18px;color:#565b64;position:relative;}" +
                "#os-options-list-not-selected li{box-sizing:border-box;}" +
                "#os-options-list-not-selected li span{cursor:pointer;display:inline-block;box-sizing: content-box;vertical-align:top;vertical-align:middle;}" +
                "#os-options-list-not-selected li .os-checkbox{position:relative;margin-right:10px;height:10px;width:10px;border:1px #565b64 solid;display:inline-block;cursor:pointer;}" +
                "" +
                "#os-algorithm-history{width:auto;margin: 0;padding: 0;border: 0;font-size: 100%;font: inherit;vertical-align: baseline;list-style: none;font-size:12px;line-height:18px;color:#d0d0d0;position:relative;height:180px;overflow-y:auto;padding-right:5px;}" +
                "#os-record-interface #os-algorithm-history input.os-text-input{width:210px;border:none;border-right:0;margin:0;border-left:1px #565b64 solid;border-right:1px #565b64 solid;width:216px;}"+
                ".os-scrollable::-webkit-scrollbar{width: 5px;}" +
                ".os-scrollable::-webkit-scrollbar-track{background: #3f4247;}" +
                ".os-scrollable::-webkit-scrollbar-thumb{background: #888;border-radius:15px;}" +
                "#os-algorithm-history li{overflow:hidden;border:1px #565b64 solid;border-top:0px transparent solid;width:318px;}" +
                "#os-algorithm-history li > span{box-sizing:border-box;padding:1px 3px;vertical-align:top;height:10px;font-size:10px;width:50px;display:inline-block;}" +
                "#os-algorithm-history li > span.os-match-history{text-align:right;color:#00abc4;text-decoration:underline;cursor:pointer;}" +
                "#os-algorithm-history-head{width:auto;margin: 0;padding: 0;border: 0;font-size: 100%;font: inherit;vertical-align: baseline;list-style: none;font-size:12px;line-height:18px;color:#d0d0d0;position:relative;padding-right:5px;}" +
                "#os-algorithm-history-head li{overflow:hidden;border:1px #565b64 solid;width:318px;}" +
                "#os-algorithm-history-head li > span{box-sizing:border-box;padding:1px 3px;vertical-align:top;height:10px;font-size:10px;width:50px;display:inline-block;}" +
                "" +
                "";
        }

        //attach click event
        document.getElementById('os-execution-try').onclick = function () {
            OS_TRY_XPATH(document.getElementById('os-execution-result').value);
        };
        document.getElementById('os-execution-clear-xpath').onclick = function () {
            document.getElementById('os-style-try-helper').innerHTML = '';
            document.getElementById('os-try-it-found').innerHTML = '';
        };
        document.getElementById('os-switch-side').onclick = function () {
            var orientation = getNewOrientation();
            setStylesheet(orientation);
            setChangeOrientation(orientation);
        };

        document.onkeydown = function (e) {
            var evtobj = window.event ? event : e;

            if (document.getElementById('os-record-interface')) {
                window.OS_KEY_EVENT = evtobj.keyCode;
                if (evtobj.code === "KeyA" && evtobj.altKey) {
                    window.os_execute();
                }
            }
        };

        //Je vais utiliser cette variable pour stocker mon historique de XPATH pour ne pas tester 2 fois le meme
        var TRY_HISTORY;

        var LOCATION_EVERYWHERE = "//";
        var LOCATION_DIRECT_CHILD = "/";
        var TAGNAME_ALL = "*";

        //Ici je defini mes options speciales, tout ce qui n'est pas ici sera considéré comme un attribute
        var OPTION_TAGNAME = "_tag";
        var OPTION_INNERTEXT = "_innerText";
        var OPTION_POSITION = "_position";
        var OPTION_OTHER_ATTRIBUTES = "_other";

        //Ici je défini mes escape String
        var ESCAPE_QUOTE = "', \"'\", '";

        //Add additional attribute onclick event
        document.querySelector("#os-add-additional-attribute").onclick = function(ev){
            var input = document.querySelector("#os-additional-option");
            if(input && input.value.length > 0){
                addUnselectedOption("@"+input.value);
            }
            input.value = "";
        };

        function buildElementXpathPossibility(element, selectedOptions) {
            //Pour le moment, je ne tiens pas compte de la hiérarchie
            var prefix = LOCATION_EVERYWHERE;
            var tagName = buildXpathTagName(element, selectedOptions);
            var attributes = buildXpathAttributes(element, selectedOptions);
            /*if(selectedOptions.indexOf(OPTION_POSITION) !== -1){
                return prefix + tagName + "["+ getPosition(element) +"]";
            }*/
            return prefix + tagName + attributes;
        }

        function buildXpathTagName(element, selectedOptions) {
            //Si dans mes options selectionnes pour cet essai j'ai le tagName je le prend sinon je le laisse le all
            return selectedOptions.indexOf(OPTION_TAGNAME) === -1 ? TAGNAME_ALL : element.tagName.toLowerCase();
        }

        function buildXpathAttributes(element, selectedOptions) {

            //Ici je declare une variable pour gerer la notion de 'and'
            var firstAttributeUsed = false;

            //Je declare egalement mon resultat final
            var result = "";

            //pour chacune de mes options selectionnées
            for (var i = 0; i < selectedOptions.length; i++) {
                //si c'est une option spéciale elle commence par _ alors je la traite différamment
                var attr = null;
                if (selectedOptions[i].charAt(0) == "_") {
                    attr = buildSpecialAttribute(element, selectedOptions[i], selectedOptions);
                }
                //sinon cela veut dire que c'est un attribute standard je lui applique le traitement standard
                else {
                    attr = buildCommonAttribute(element, selectedOptions[i]);
                }

                //si j'ai bien un attribute a essayer alors
                if (attr && result.indexOf(attr) === -1) {
                    //Je renseigne le and si ce n'est pas le premier attribut, sinon je met seulement l'attribut
                    result += firstAttributeUsed ? " and " + attr : attr;
                    // j'ai trouvé un attribut donc dans tous les cas je m'assure de bien set ma valeur a true pour gérer le and au prochain coup
                    firstAttributeUsed = true;
                }
            }
            //si j'ai utilisé des attributs alors je renseigne le resultat entourè de bracket sinon je retourne rien
            return firstAttributeUsed ? "[" + result + "]" : "";
        }

        function buildSpecialAttribute(element, selectedOption) {

            var result = null;
            switch (selectedOption) {
                //dans le cas ou mon option speciale est le innerText
                case OPTION_INNERTEXT:
                    result = buildSpecialAttributeText(element, true);
                    break;
                //dans le cas ou mon option speciale est le childPosition
                case OPTION_POSITION:
                    result = buildSpecialAttributePosition(element);
                    break;
            }
            return result;
        }

        function buildSpecialAttributePosition(element) {
            var children = element.parentElement ? element.parentElement.children : null;
            if (children && children.length > 0) {
                var counter = 0;
                for (var i = 0; i < children.length; i++) {
                    if (children[i].tagName === element.tagName) {
                        counter++;
                    }
                    if (children[i] === element) {
                        return counter;
                        //return "position()=" + counter;
                    }
                }
            }
        }

        function buildSpecialAttributeText(element, perfectMatch) {
            var result = null;
            //ici je prend le text dont j'ai besoin sans espace inutile et avec les quote escaped
            var text = element.innerHTML.replace(/'/g, ESCAPE_QUOTE);
            //si et seulement si j'ai du contenu, je traite le resultat
            if (text.length > 0 && text.length < 300) {
                if (text.indexOf(ESCAPE_QUOTE) === -1) {
                    result = perfectMatch ? "text()='" + text + "'" : "contains(text(),'" + text + "')";
                } else {
                    result = perfectMatch ? "text()=concat('" + text + "')" : "contains(text(),concat('" + text + "'))";
                }
            }
            return result;
        }

        function buildCommonAttribute(element, selectedOption) {

            var result = null;
            //ici je prend l'attribut
            var text = element.getAttribute(selectedOption);
            //si il existe je continu
            if (text && text.length > 0) {
                //j'escape les quotes au cas ou
                text == text.replace(/'/g, ESCAPE_QUOTE);
                if (text.indexOf(ESCAPE_QUOTE) === -1) {
                    result = "@" + selectedOption + "='" + text + "'";
                } else {
                    result = "@" + selectedOption + "=concat('" + text + "')";
                }

            }
            return result;
        }

        function defineOtherOptions(element, arrayOfOptions) {
            var otherPosition = arrayOfOptions.indexOf(OPTION_OTHER_ATTRIBUTES);
            if (otherPosition > -1) {
                //TODO i do not remember what i wanted to do here :/
            }
            return arrayOfOptions;
        }

        var MANDATORY_OPTIONS = null;

        function initMandatoryOptions(arrayOfOptions) {
            if (MANDATORY_OPTIONS === null && arrayOfOptions) {
                MANDATORY_OPTIONS = [];
                for (var i = arrayOfOptions.length - 1; i >= 0; i--) {
                    var cleanOption = arrayOfOptions[i].replace("!", "");
                    if (cleanOption !== arrayOfOptions[i]) {
                        MANDATORY_OPTIONS.push(cleanOption);
                        arrayOfOptions.splice(i, 1);
                    }
                }
            }
        }


        function tryPossibilities(element, arrayOfOptions, parentTry, suffix, rootElement) {
            initMandatoryOptions(arrayOfOptions);
            //Si je n'ai pas d'essai parent, je cree un tableau vide
            parentTry = parentTry ? parentTry : [];
            rootElement = rootElement ? rootElement : element;
            //J'initialise mon suffix s'il n'était pas renseigné
            suffix = suffix ? suffix : "";


            if (TRUE_PREFIX && !isXpathInHistory(xpath)) {
                var xpathResultElement = __x(TRUE_PREFIX);
                addXpathToHistory(TRUE_PREFIX,xpathResultElement.length);
                if (rootElement.isSameNode(xpathResultElement[0]) && xpathResultElement.length === 1) {
                    return TRUE_PREFIX;
                }
            }

            var dig = false;
            //pour chaque options
            arrayOfOptions = defineOtherOptions(element, arrayOfOptions);
            for (var i = 0; i <= arrayOfOptions.length; i++) {
                //si je suis en train de creuser et que je peux encore creuser d'avantage et que je n'ai pas deja inclus l'option dans ma possibilité
                //if(dig && parentTry.length < arrayOfOptions.length && parentTry.indexOf(arrayOfOptions[i]) == -1){
                //Mais il faut aussi tenir compte du fait que:
                /* Lorsque j'essaye mes options : essayer "tag" et "id" c'est la meme chose que "id" et "tag"
                   Alors je prefere utiliser la condition suivante
                */
                if (dig && i === parentTry.length) {
                    //Je specifie mes options actuelles
                    var currentTry = parentTry.slice();
                    currentTry.push(arrayOfOptions[i]);
                    //Je creuse plus profond et j'essaye de nouvelles possibilités
                    var result = tryPossibilities(element, arrayOfOptions, currentTry, suffix, rootElement);
                    if (result) return result;
                    //sinon
                } else if (!dig) {
                    //si cette option n'est pas deja utilise dans le parent
                    if ((arrayOfOptions.length === i && MANDATORY_OPTIONS.length > 0) || parentTry.indexOf(arrayOfOptions[i]) === -1) {
                        //je construit la possibilité local en utilisant le parent + ma current option
                        var currentTry = parentTry.slice();
                        //un try sans seulement avec les mandatory options
                        if (i < arrayOfOptions.length) {
                            currentTry.push(arrayOfOptions[i]);
                        }
                        currentTry = currentTry.concat(MANDATORY_OPTIONS);
                        var xpath = TRUE_PREFIX + buildElementXpathPossibility(element, currentTry) + suffix;
                        //je teste la possibilité
                        //console.log("j'essaye la possibilité : " + parentTry + " - " + arrayOfOptions[i]);
                        if (!isXpathInHistory(xpath)) {
                            var xpathResultElement = __x(xpath);
                            addXpathToHistory(xpath,xpathResultElement.length);
                            if (rootElement.isSameNode(xpathResultElement[0]) && xpathResultElement.length === 1) {
                                return xpath;
                            }
                        } else {
                            //console.log("xpath généré déja essayé j'osef : " + xpath);
                        }
                    }
                }
                //Si j'ai essayé toutes les possibilités sans creuser
                if (i == (arrayOfOptions.length - 1) && !dig) {
                    //alors je recommence un tour en creusant
                    dig = true;
                    i = -1;
                }
            }

            //Si j'ai tout essayé au niveau de la racine sans avoir de résultat alors j'essaye avec le parent.
            if (parentTry.length === 0) {
                return tryPossibilitiesOnParent(element, arrayOfOptions, TRY_HISTORY, rootElement);
            }
        }

        //here i manage the call with the parent element
        function tryPossibilitiesOnParent(element, arrayOfOptions, TRY_HISTORY, rootElement) {
            var lastXpath = null;
            if (TRY_HISTORY && TRY_HISTORY.length > 0) {
                for (var i = TRY_HISTORY.length - 1; i >= 0; i--) {
                    if (TRY_HISTORY[i].xpath.indexOf("text()=") === -1) {
                        lastXpath = TRY_HISTORY[i].xpath;
                        break;
                    }
                }
            }
            return element.parentElement && lastXpath ? tryPossibilities(element.parentElement, arrayOfOptions, [], lastXpath.replace("/", ""), rootElement) : null;
        }

        function __x(xpath) {
            var xpathResult = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            //console.log(xpath + " => " + xpathResult.snapshotLength);
            var array = [];
            for (var i = 0; i < xpathResult.snapshotLength; i++)
                array.push(xpathResult.snapshotItem(i))
            return array;
        }

        window.os_execute = function() {
            document.getElementById('os-execution-options-error').style.display = "none";
            document.getElementById('os-execution-prefix-error').style.display = "none";
            document.getElementById("os-execution-prefix-target").innerHTML = "";
            MANDATORY_OPTIONS = null;
            TRUE_PREFIX = "";
            TRY_HISTORY = [];
            addAttributeOptions(window.ELEMENT_MOUSE_OVER); /** Add additional attributes as options coming from this element **/
            var GLOBAL_PREFIX = document.getElementById("os-execution-prefix").value;
            try {
                var options = eval(document.getElementById("os-execution-options").value);
                if (options.length > 0 && GLOBAL_PREFIX.trim() === "") {
                    document.getElementById("os-execution-result").value = tryPossibilities(window.ELEMENT_MOUSE_OVER, options);
                    displayHistory();
                }
                else {
                    if (options.length < 1) {
                        document.getElementById('os-execution-options-error').style.display = "block";
                    }
                    else if (__x(GLOBAL_PREFIX).length === 1) {
                        document.getElementById("os-execution-result").value = searchFromPrefix(GLOBAL_PREFIX, __x(GLOBAL_PREFIX)[0], window.ELEMENT_MOUSE_OVER, [__x(GLOBAL_PREFIX)[0]]);
                    } else {
                        document.getElementById("os-execution-prefix-target").innerHTML = __x(GLOBAL_PREFIX).length;
                        document.getElementById('os-execution-prefix-error').style.display = "block";
                    }
                }
            } catch (e) {
                console.error(e);
                document.getElementById('os-execution-options-error').style.display = "block";
            }
        }

        var TRUE_PREFIX = "";

        function isXpathInHistory(xpath){
            for(var i = 0 ; i < TRY_HISTORY.length; i++){
                if(TRY_HISTORY[i].xpath === xpath)
                    return true;
            }
            return false;
        }

        function addXpathToHistory(xpath,match){
            TRY_HISTORY.push({"order":TRY_HISTORY.length+1, "xpath":xpath, "match":match});
        }

        function displayHistory(){
            var elem = document.querySelector("#os-algorithm-history");
            elem.innerHTML = "";
            TRY_HISTORY.forEach(function(h){
               var child = document.createElement("li");
               child.innerHTML = "" +
                   "<span>#"+h.order+"</span>" +
                   "<input type='text' class='os-text-input' id='os-history-xpath-input-"+h.order+"' value=\""+h.xpath+"\"/>" +
                   "<span class='os-match-history' id='os-history-xpath-match-"+h.order+"' >"+h.match+"</span>";
               elem.appendChild(child);
               elem.querySelector("#os-history-xpath-match-"+h.order).onclick = function(ev){
                   var result = document.querySelector("#os-execution-result");
                   result.value = document.querySelector("#"+this.id.replace("match","input")).value;
                   OS_TRY_XPATH(result.value);
               };
            });
        }

        function searchFromPrefix(prefix, prefixElem, target, history) {
            //first of i reset the TRUE_PREFIX, and if we still have it null at the end of this function, it means
            //we are on situation of error
            TRUE_PREFIX = null;
            //i initiate my search history if it is not already set
            history = history ? history : [];
            //i add this prefix element inside the history
            history.push(prefixElem);

            //#1 - if prefix and target are already the same, we stop here dont need to go deeper
            if (target.isSameNode(prefixElem)) return prefix;

            //#2 - If the target is inside my children, my prefix is already my TRUE_PREFIX
            if (sourceHasChild(prefixElem, target, history)) {
                TRUE_PREFIX = prefix;
            } else {

                //#3 - If the target is not inside my children, i will try with my parents until i found the correct prefix
                //While my prefix element has a parent element not already inside the history
                while (prefixElem.parentElement && history.indexOf(prefixElem.parentElement) === -1) {
                    //I make it as the new prefix element and put it in the history
                    prefixElem = prefixElem.parentElement;
                    history.push(prefixElem);
                    //I update my prefix
                    prefix += "/..";

                    //#4 - If prefix and target are already the same, we stop here dont need to go deeper
                    if (target.isSameNode(prefixElem)) {
                        TRUE_PREFIX = prefix;
                        break;
                    }

                    //#5 - If the target is inside my children, my prefix is already my TRUE_PREFIX
                    if (sourceHasChild(prefixElem, target, history)) {
                        TRUE_PREFIX = prefix;
                        break;
                    }
                }
            }
            //#6 - If i have a prefix is search my target XPATH
            if (TRUE_PREFIX) {
                var options = eval(document.getElementById("os-execution-options").value);
                return tryPossibilities(target, options);
            }
            //#7 - In the other case, invalid prefix we are on an error situation
            return null;
        }

        function sourceHasChild(source, target, history) {
            //initiate history if not set
            history = history ? history : [];
            if (source.children && source.children.length > 0) {
                for (var i = 0; i < source.children.length; i++) {
                    //if this child is not yet in the investigation history
                    if (history.indexOf(source.children[i]) === -1) {
                        //i add this child in the investigation history
                        history.push(source.children[i]);
                        //if this is my target RETURN TRUE
                        if (source.children[i].isSameNode(target)) return true;
                        //if it has my target in its children RETURN TRUE
                        if (sourceHasChild(source.children[i], target, history)) return true;
                    }
                }
            }
            //if i did not found it
            return false;
        }

        //OPTIONS MANAGEMENT DRAG & DROP

        function createDropSlot(){
            var elem = document.createElement("li");
            elem.className = "os-drop-slot";
            return elem;
        }

        function createAllDropSlot(){
            document.querySelectorAll("#os-options-list-selected li.os-draggable").forEach(function(e){e.parentElement.insertBefore(createDropSlot(),e);});
            document.querySelector("#os-options-list-selected").appendChild(createDropSlot());
        }

        function enableDropSlot(){
            document.querySelectorAll("#os-options-list-selected li.os-drop-slot").forEach(function(elem){
                elem.style.borderTop="6px solid #04aec642";
                elem.ondragenter = function(ev){ev.preventDefault();ev.target.style.borderTop="6px solid #04aec6";};
                elem.ondragleave = function(ev){ev.preventDefault();ev.target.style.borderTop="6px solid #04aec642";};
            });
        }

        function setupDataTransfer(ev){
            var arr = [];
            document.querySelectorAll("#os-options-list-selected li.os-draggable").forEach(function(e){arr.push(e)});
            ev.dataTransfer.setData("src", ""+arr.indexOf(ev.srcElement));
        }

        function removeAllDropSlot(){
            document.querySelectorAll("#os-options-list-selected li.os-drop-slot").forEach(function(elemToRemove){
                elemToRemove.parentElement.removeChild(elemToRemove);
            });
        }

        function setupDragAndDrop(){
            document.querySelector("#os-options-list-selected").ondragover = function (ev) {ev.preventDefault();};
            document.querySelector("#os-options-list-selected").ondrop = function (ev) {
                ev.preventDefault();
                var target = ev.target;
                if(target.tagName.toLowerCase() !== "li" || target.className.toLowerCase() !== "os-drop-slot")
                    return;
                target.parentElement.insertBefore(document.querySelectorAll("#os-options-list-selected li.os-draggable")[ev.dataTransfer.getData("src")],target);
                removeAllDropSlot();
                generateAlgorithmOptions();
                createAllDropSlot();
                setupDragAndDrop();
            };
            document.querySelectorAll("#os-options-list-selected li.os-draggable").forEach(function(draggable){
                draggable.draggable = true;
                draggable.ondragstart = function (ev) {
                    setupDataTransfer(ev);
                    enableDropSlot();
                };
                setupDraggableLock(draggable);
                setupDraggableCheck(draggable);
            });
            document.querySelectorAll("#os-options-list-not-selected li").forEach(function(choice){
                setupNotDraggableCheck(choice);
            });
        }
        createAllDropSlot();
        setupDragAndDrop();


        /** ALGORITHM OPTIONS **/

        function generateAlgorithmOptions(){
            var result = "";
            document.querySelectorAll("#os-options-list-selected li.os-draggable").forEach(function(e){
                if(result !== ""){result +=","} //separator added
                result += '"' + getTrueOptionName(
                    e.querySelector(".os-value").innerText, //option text
                    e.querySelector(".os-lock").className.indexOf("unlock") === -1 //mandatory
                ) + '"';
            });
            document.getElementById('os-execution-options').value= "[" + result + "]" ;
        }

        function getTrueOptionName(str,mandatory){
            mandatory = mandatory ? "!" : "";
            if(str.startsWith("@"))
                return str.substr(1) + mandatory;
            switch (str){
                case "tagName" : return "_tag" + mandatory;
                case "childPosition" : return "_position" + mandatory;
                case "innerText" : return "_innerText" + mandatory;
            }
            return null;
        }

        /** ALGORITHM ACTIONS **/
        function setupDraggableLock(e) {
            var l = e.querySelector(".os-lock");
            l.onclick = function(ev){
                if(ev.target.className.indexOf("unlock") === -1){
                    ev.target.className = "os-lock os-unlock";
                }else{
                    ev.target.className = "os-lock";
                }
                generateAlgorithmOptions();
            };
        }

        function checkSelectedOption(ev){
            var optionName = ev.target.parentElement.querySelector(".os-value").innerText;
            addUnselectedOption(optionName); //we add here the option as unselected
            removeSelectedOption(optionName); //we remove here the option as selected
            removeAllDropSlot();
            generateAlgorithmOptions();
            createAllDropSlot();
        }

        function checkUnselectedOption(ev){
            var optionName = ev.target.parentElement.querySelector(".os-value").innerText;
            addSelectedOption(optionName); //we add here the option as unselected
            removeUnselectedOption(optionName); //we remove here the option as selected
            removeAllDropSlot();
            generateAlgorithmOptions();
            createAllDropSlot();
        }

        function setupDraggableCheck(e){
            var l = e.querySelector(".os-checkbox");
            l.onclick = checkSelectedOption;
        }

        function setupNotDraggableCheck(e){
            var l = e.querySelector(".os-checkbox");
            l.onclick = checkUnselectedOption;
        }

        function addUnselectedOption(optionName){
            var elem = document.createElement("li");
            elem.innerHTML = "<span class=\"os-checkbox\"></span><span class=\"os-value\">" + optionName + "</span>";
            document.querySelector("#os-options-list-not-selected").appendChild(elem);
            elem.querySelector(".os-checkbox").onclick = checkUnselectedOption;
            sortUnselectedElement();
        }

        function addSelectedOption(optionName){
            var elem = document.createElement("li");
            elem.innerHTML = "<span class=\"os-checkbox\"></span><span class=\"os-value\">" + optionName + "</span><span class=\"os-lock os-unlock\"></span><span class=\"os-match os-contains\">A</span>";
            elem.draggable = true;
            elem.className = "os-draggable";
            document.querySelector("#os-options-list-selected").appendChild(elem);
            elem.querySelector(".os-checkbox").onclick = checkSelectedOption;
            elem.ondragstart = function (ev) {
                setupDataTransfer(ev);
                enableDropSlot();
            };
            setupDraggableLock(elem);
        }

        function removeSelectedOption(optionName){
            var selectedOptions = document.querySelectorAll("#os-options-list-selected li.os-draggable");
            for(var i = 0; i < selectedOptions.length; i++){
                if(selectedOptions[i].querySelector(".os-value").innerText === optionName){
                    selectedOptions[i].parentElement.removeChild(selectedOptions[i]);
                    return;
                }
            }
        }

        function removeUnselectedOption(optionName){
            var selectedOptions = document.querySelectorAll("#os-options-list-not-selected li");
            for(var i = 0; i < selectedOptions.length; i++){
                if(selectedOptions[i].querySelector(".os-value").innerText === optionName){
                    selectedOptions[i].parentElement.removeChild(selectedOptions[i]);
                    return;
                }
            }
            sortUnselectedElement();
        }


        function sortUnselectedElement(){
            var parent = document.querySelector("#os-options-list-not-selected");
            [].slice.call(parent.children)
                .sort(function(a, b) {
                    var aVal = a.querySelector(".os-value").innerText;
                    var bVal = b.querySelector(".os-value").innerText;
                    var result = 0;
                    if(!aVal.startsWith("@")) result -= 100;
                    if(!bVal.startsWith("@")) result += 100;
                    if(aVal === bVal) return result;
                    if(aVal > bVal) return 1 + result;
                    if(aVal < bVal) return -1 + result;
                }).forEach(function(ele) {
                parent.appendChild(ele);
            })
        }

        function doesExistsAsOption(optionName){
            var elements = document.querySelectorAll("li span.os-value");
            for(var i=0; i <elements.length;i++){
                if(elements[i].innerText === optionName)
                    return true;
            }
            return false;
        }

        function addAttributeOptions(elem){
            for(var i = 0; i < elem.attributes.length; i++){
                var attr = elem.attributes[i];
                if(attr.nodeName !== "currentxpathtry" && attr.nodeName !== "currentmouseover" && !doesExistsAsOption("@"+attr.nodeName)){
                    addUnselectedOption("@"+attr.nodeName);
                }
            }

        }

        }
)();