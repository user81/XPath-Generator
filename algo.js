(function () {
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
        return selectedOptions.indexOf(OPTION_TAGNAME) == -1 ? TAGNAME_ALL : element.tagName.toLowerCase();
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
                attr = buildSpecialAttribute(element, selectedOptions[i],selectedOptions);
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
                result = buildSpecialAttributeText(element,true);
                break;
            //dans le cas ou mon option speciale est le childPosition
            case OPTION_POSITION:
                result = buildSpecialAttributePosition(element);
                break;
        }
        return result;
    }

    function buildSpecialAttributePosition(element){
        var children = element.parentElement ? element.parentElement.children : null;
        if(children && children.length > 0){
            var counter = 0;
            for(var i = 0; i < children.length; i++){
                if(children[i].tagName === element.tagName){
                    counter++;
                }
                if(children[i] === element){
                    return "position()="+counter;
                }
            }
        }
    }

    function buildSpecialAttributeText(element,perfectMatch){
        var result = null;
        //ici je prend le text dont j'ai besoin sans espace inutile et avec les quote escaped
        var text = element.innerHTML.replace(/'/g, ESCAPE_QUOTE);
        //si et seulement si j'ai du contenu, je traite le resultat
        if (text.length > 0 && text.length < 300) {
            if (text.indexOf(ESCAPE_QUOTE) === -1) {
                result = perfectMatch ? "text()='"+text+"'" : "contains(text(),'" + text + "')";
            } else {
                result = perfectMatch ? "text()=concat('"+text+"')" : "contains(text(),concat('" + text + "'))";
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

    function defineOtherOptions(element,arrayOfOptions){
       var otherPosition = arrayOfOptions.indexOf(OPTION_OTHER_ATTRIBUTES);
       if(otherPosition > -1){
            //TODO
       }
       return arrayOfOptions;
    }

    function tryPossibilities(element, arrayOfOptions, parentTry, suffix, rootElement) {
        //Si je n'ai pas d'essai parent, je cree un tableau vide
        parentTry = parentTry ? parentTry : [];
        rootElement = rootElement ? rootElement : element;
        //J'initialise mon suffix s'il n'était pas renseigné
        suffix = suffix ? suffix : "";

        var dig = false;
        //pour chaque options
        arrayOfOptions = defineOtherOptions(element, arrayOfOptions);
        for (var i = 0; i < arrayOfOptions.length; i++) {
            //si je suis en train de creuser et que je peux encore creuser d'avantage et que je n'ai pas deja inclus l'option dans ma possibilité
            //if(dig && parentTry.length < arrayOfOptions.length && parentTry.indexOf(arrayOfOptions[i]) == -1){
            //Mais il faut aussi tenir compte du fait que:
            /* Lorsque j'essaye mes options : essayer "tag" et "id" c'est la meme chose que "id" et "tag"
               Alors je prefere utiliser la condition suivante
            */
            if (dig && i == parentTry.length) {
                //Je specifie mes options actuelles
                var currentTry = parentTry.slice();
                currentTry.push(arrayOfOptions[i]);
                //Je creuse plus profond et j'essaye de nouvelles possibilités
                var result = tryPossibilities(element, arrayOfOptions, currentTry, suffix, rootElement);
                if(result) return result;
                //sinon
            } else if (!dig) {
                //si cette option n'est pas deja utilise dans le parent
                if (parentTry.indexOf(arrayOfOptions[i]) === -1) {
                    //je construit la possibilité local en utilisant le parent + ma current option
                    var currentTry = parentTry.slice();
                    currentTry.push(arrayOfOptions[i]);
                    var xpath = buildElementXpathPossibility(element, currentTry) + suffix;
                    //je teste la possibilité
                    //console.log("j'essaye la possibilité : " + parentTry + " - " + arrayOfOptions[i]);
                    if (TRY_HISTORY.indexOf(xpath)  === -1) {
                        var xpathResultElement = __x(xpath);
                        if (rootElement.isSameNode(xpathResultElement)) {
                            //console.log(xpathResultElement);
                            return xpath;
                        }
                        TRY_HISTORY.push(xpath);
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
        if(parentTry.length === 0 ){
            return tryPossibilitiesOnParent(element, arrayOfOptions, TRY_HISTORY,rootElement);
        }
    }

    //here i manage the call with the parent element
    function tryPossibilitiesOnParent(element, arrayOfOptions, TRY_HISTORY,rootElement){
        var lastXpath = null;
        if(TRY_HISTORY && TRY_HISTORY.length > 0){
            for(var i = TRY_HISTORY.length - 1; i >= 0 ; i--){
                if(TRY_HISTORY[i].indexOf("text()=") === -1){
                    lastXpath = TRY_HISTORY[i];
                    break;
                }
            }
        }
        return element.parentElement && lastXpath ? tryPossibilities(element.parentElement,arrayOfOptions,[],lastXpath.replace("/",""),rootElement) : null;
    }

    function __x(xpath) {
        var xpathResult = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        console.log(xpath + " => " + xpathResult.snapshotLength);
        /*if(xpathResult.snapshotLength === 1) console.log(xpathResult.snapshotItem(0));*/
        return xpathResult.snapshotLength != 1 ? null : xpathResult.snapshotItem(0);
    }

    var COUNTER_MOUSE_OVER = 0;
    var ELEMENT_MOUSE_OVER = null;

    function createMouseOverHelper(){
        var elem = document.createElement("style");
        elem.id = "os-style-over-helper";
        document.head.appendChild(elem);
        document.body.onmousemove = function (e) {
            var elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
            if (document.getElementById('os-style-over-helper') && ELEMENT_MOUSE_OVER !== elementMouseIsOver) {
                elem.innerHTML = "[currentmouseover='"+(++COUNTER_MOUSE_OVER)+"']{box-shadow: 0px 0px 10px 1px #989898! important;}";
                ELEMENT_MOUSE_OVER = elementMouseIsOver;
                elementMouseIsOver.setAttribute("currentmouseover",""+COUNTER_MOUSE_OVER);
            }
        };
    }

    var GLOBAL_PREFIX = null;

    document.addEventListener('click', function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        //Je reset mon historique de try
        TRY_HISTORY = [];
        //console.log(tryPossibilities(target, ["_tag", "id", "class", "_innerText", "type", "value"]));
        if(GLOBAL_PREFIX === null){
            GLOBAL_PREFIX = tryPossibilities(target, ["_tag", "id", "class", "_innerText", "_position"]);
            console.log(GLOBAL_PREFIX);
            console.log(__x(GLOBAL_PREFIX));
        }else{
            var result = searchElementFromPrefix(GLOBAL_PREFIX,__x(GLOBAL_PREFIX),target,[__x(GLOBAL_PREFIX)]);
            console.log(result + " final");
        }

    }, false);

    createMouseOverHelper();

    function searchElementFromPrefix(prefix,prefixElem,target,history){
        history = history ? history : [];

        //Search Children
        if(prefixElem.children && prefixElem.children.length > 0) {
            for(var i = 0 ; i < prefixElem.children.length ; i++){
                if(history.indexOf(prefixElem.children[i]) === -1){
                    //build xpath to be improved
                    //var xpath = prefix + "/" + prefixElem.children[i].tagName.toLowerCase() + "[" + buildSpecialAttributePosition(prefixElem.children[i]) + "]";
                    var xpath = prefix + "/*["+(i+1)+"]";
                    var e = __x(xpath);
                    history.push(e);
                    if(target.isSameNode(e)){
                        return xpath;
                    }else{
                        var result = searchElementFromPrefix(xpath,e,target,history);
                        if(result) return result;
                    }
                }
            }
        }

        //Search Parent
        if(prefixElem.parentElement && history.indexOf(prefixElem.parentElement) === -1){
            var xpath = prefix + "/..";
            var e = __x(xpath);
            history.push(e);
            console.log(e);
            if(target.isSameNode(e)){
                return xpath;
            }else{
                var result = searchElementFromPrefix(xpath,e,target,history);
                if(result) return result;
            }
        }

    }


})();