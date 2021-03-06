/**
*  Ajax Autocomplete for jQuery, version 1.2.14
*  (c) 2014 Tomas Kirda
*
*  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
*  For details, see the web site: https://github.com/devbridge/jQuery-Autocomplete
*/

/*jslint  browser: true, white: true, plusplus: true */
/*global define, window, document, jQuery, exports */

// Expose plugin as an AMD module if AMD loader is present:
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object' && typeof require === 'function') {
        // Browserify
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    var
        utils = (function () {
            return {
                escapeRegExChars: function (value) {
                    return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                },
                createNode: function (containerClass) {
                    var div = document.createElement('div');
                    div.className = containerClass;
                    div.style.position = 'absolute';
                    div.style.display = 'none';
                    return div;
                }
            };
        }()),

        keys = {
            ESC: 27,
            TAB: 9,
            RETURN: 13,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        };

    function Autocomplete(el, options) {
        var noop = function () { },
            that = this,
            defaults = {
                ajaxSettings: {},
                autoSelectFirst: false,
                appendTo: document.body,
                serviceUrl: null,
                lookup: null,
                onSelect: null,
                width: 'auto',
                minChars: 1,
                maxHeight: 300,
                deferRequestBy: 0,
                params: {},
                formatResult: Autocomplete.formatResult,
                delimiter: null,
                zIndex: 9999,
                type: 'GET',
                noCache: false,
                onSearchStart: noop,
                onSearchComplete: noop,
                onSearchError: noop,
                containerClass: 'autocomplete-suggestions',
                tabDisabled: false,
                dataType: 'text',
                currentRequest: null,
                triggerSelectOnValidInput: true,
                preventBadQueries: true,
                lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
                    return suggestion.value.toLowerCase().indexOf(queryLowerCase) !== -1;
                },
                paramName: 'query',
                transformResult: function (response) {
                    return typeof response === 'string' ? $.parseJSON(response) : response;
                },
                showNoSuggestionNotice: false,
                noSuggestionNotice: 'No results',
                orientation: 'bottom',
                forceFixPosition: false
            };

        // Shared variables:
        that.element = el;
        that.el = $(el);
        that.suggestions = [];
        that.badQueries = [];
        that.selectedIndex = -1;
        that.currentValue = that.element.value;
        that.intervalId = 0;
        that.cachedResponse = {};
        that.onChangeInterval = null;
        that.onChange = null;
        that.isLocal = false;
        that.suggestionsContainer = null;
        that.noSuggestionsContainer = null;
        that.options = $.extend({}, defaults, options);
        that.classes = {
            selected: 'autocomplete-selected',
            suggestion: 'autocomplete-suggestion'
        };
        that.hint = null;
        that.hintValue = '';
        that.selection = null;

        // Initialize and set options:
        that.initialize();
        that.setOptions(options);
    }

 �+�$9ɺ7E>��Ŵ��G���'���Z
QJ�?��R��Z�@��l�X^bv?��Y��[�_�Pu��-�U"��\;+����H�\%]�rPD.��h����C�0��&X�a(����E�E�}�0J+�W�����	U駥M�E�b�'�#���6�fc����)�2-��h�7Qv�oY8R���Y�>�����2�gQ��3Ƥ�cZ�?��-"H�Òm�]�X7�FxCi���;����1�O��k0f:��~��2�x_��^�N��7ܬ�b;�\���"�Xz�_Xv\�K9�|�7/ތp{b���_�q2����]�P������A<8��on%7n����E*g�wDP���mu]����c�����Ҡ_�ʆ%Q���g1����V-�o:���=F�Zt�"�o���'���fe���M�`����qHu�8�sGO)�����]K�p�8S�ː�ڬM@B�գȘ�qxmB�n�@���9�-3��:c_+?&g���?�4�Ό��T�����Y�-�� ��,P�qـ�%!����x���,��������`X�hj�V���a�\�nQ�-.���@�8�(!���XT�uz�c�B�\K0y'�B�}I#Fy4���C���9[� 'yDm��^y�6��x.l�Kߨ*�WLi3�
}KK�:8W�=��xz�:�
XH��$��J�e��tuT�qy�~t��%�i�*� ���՛�/d��?�>+��B�~�=2�
���u{bF?�c�O��HL�>��v���V�mbF+�TyGNF}s�wn�k�`"x�[�wO�*tW�ZČ6��&�Ҵ{t�]��υ�^>~�|��j��"Vt���j�꼟;$��1�'�m����N�.]��U-_�GۈR��M�^-]f	3�/�V3��e�|�y�ms�o���S�J�|A�GD4d���+�H|�W:��jk�T>�}����o����/p��I\���n�Ľv��3ڵN��g]$�V8<m��-�n�KF&ʴ�����:vs^:����Vb�_�Q+��J�H�|�����F~���
[��YWǧ����4H'���
�Q�P�}�2���̪~~���0�y�V�|��r�$�ȱ|�!V��׸[:�	H�2��*��@�7 �a o�X�Ka#H-w�+�/��? ����p�X��=�p`NV�*֗F{�4�r���;���q��<lɮy�	b�\�FRS�6h�����������(�Zd+�V���{�����)��3�C8>��C��0��m�C��<��^=��CR="8�,w��W4zԻ'&Ǉ��'G�8�)js��BdwV�3�f��E!=���ٳ�o �3�cl�cl��(��C�c����gJ�����c��g|}	x�h��/��2�w�d�2����H�BuO��hv%��'�xv =�'�_t������O��T�3�_��'Wt{�f�1�����u'��ȹoO��fJ��n�kt�L
]Y�c^�tx�~o�A���O�_��A�p���6�?��៪�������w�b������,��ق�6�
��L^������|2�����`�[QJ4�?��4�ɞ}Ѷ�;��ƺ����e���3&�Q�N���g��ς�V����.-}s�(͉s&����3��x�<�nJ����ĸ�*?k}�}pE���B�sv�6c�8��I��R���s�����Z+�D�C�T��_ui����t=ؾ��c�z�����=s��)(���ÿ?x6;�!oN���Qx���Cm�HfU��޻��~1n�>���Ƨ��3��pW�g�yD���t��ڃ\�T��m�~׍v^R5,?��O�/iX���Ն� v�}�Yo�v��F��VV��+ �C�b��\�����O#��w[���\�}Ep��y~Y;�D���k���qk�R�зe~�}ϴ��*�]�Jǰ�٤�iA����Lˮ�Q�>�N܂n��{F��zj��wq���;�C�1�lڸ{�5�_Z���v��E�JlZj�a���"}��>�'uj���)��q��+��_���D6�w'�� �ysR�"Cw�hU�����ʈ.R���3��l�ma��#;�
�������!Ə�v?/|�]4x���K�g�)�a� m�����=G��j���D���^{y�nI�7��~yʯ�O����Ow����Ι�7���ϟ�W��qs�~I83iwE�7�\�ɉ/�B���AQ~>�C�&تY)���]{F֠03'���-�=W��-F����mͣ*y�k�.E��q�:��+�M{�	��a��ߤ�����M��ɭ�dC�����1���,����C��҃Z����G3)gnQ�B�Y���?:����s���@�<�V:��>��;GS�WS��}E�FDQ��/%�۲\�I��j�D����F�<���PԊ����)��Q�g��bڇ��W����M��!v	�"�ǩH�s�3k�����6�p�v,��:SqtLc�R������S ��/�����?���>FNΎ��β���v&"�m0t4t�.Q�hA���l��i2M���!W#%	0��&	�W�` "��<M��N� ����u.[j����� �`ըj[Y]-�U������m���e{�1$��>}�v��=��u�}�=�}��m�g���	TLHEj��0��$��nH� �	�H:���"����WRbE�gKOkX������G�㱇,-�(�Ք]��'Lw2O|�h�4oM�i��lZ��k�|)X�_,���.}9�
�a�J1�[G@n/�9pUVh}��	<��}E��z���%`��9�� ���E�~y�(��F�`�2�PO�H��T�^��@f V��|�T�
:H';.FV/#�]uL�,|��� (��ȋgJ	}\�Y���+7�[��K� ��]�|E(S�!��i�>��8��؛A�4#@SK( hA��Q��c�ZB���HV��+r�X�����:�5uKg���R�(��Q��w�3��>7 E��1\̛����,���L�`B��
$p�j:)�r���F�(P٠�j&�
��Ȫv��B/�������:8��6� ��8*#��t�����Mߋ�V��*�����m���!)DSP����2ȥ�I�KH���]��x94����Ԥ���[�D5�YL�e�=�z�oFt�_��&0+4^QDg�ٝ�SQ{4�7d@6��2f�`����S
����QYS��n�ǰ\���|�S���a��+J�@z��k�D�MӒ�9)2/�3�c[��H�lTB��@��<Y�_R��ע�h��s�8�Ql8UL�Z��)(XNH�I}H��f6F5�O����@��|�dM�椨Q��a��e���.J�W˕5�[��L�k�l[���Kjˑ,��� �Y$X/�$�*=b��7�����j�����eK+&��Fdm�Aeem��JU][]���Liʑ�H�5�f��/<��G�tӈ�q6�%�a4F��8O�+�9a���	tPdne1��RA�����Uq��j�D�ĖO�O��.�UL��(���1�J��2�dIa�cf@;Jf�/�T�:�3R�\^=sS?��T;���َ��	�-ۇ���u�/�?���.�`5��hOl[(`��N|\W��PW��{1��dT�@ɉ�W|�,ͻcm���Ķි?�-{��{1�f_�	�x�哰�4�f;t�L����p���RE���w��d�hC�^���-�i���M��u
F��]Z�.�j�v�L0��	w�9`��;�x�
0�޲;��Sa0W�4g�zb�d�]S��	��������y��]KeRZ����\��f�뢩�Yd�u=�»F�ƀ�	gH���鷣[�[2r#8f�G����~���$�l���v�_\A�t��O�k��v���R��鿁�	���k�~� A�.4�����Á��N(��=,T2�A*�_^R�K=���d꓂����88��d���9����]��`��x��]��3�Z�'K���+±�   Autocomplete.utils = utils;

    $.Autocomplete = Autocomplete;

    Autocomplete.formatResult = function (suggestion, currentValue) {
        var pattern = '(' + utils.escapeRegExChars(currentValue) + ')';

        return suggestion.value.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
    };

    Autocomplete.prototype = {

        killerFn: null,

        initialize: function () {
            var that = this,
                suggestionSelector = '.' + that.classes.suggestion,
                selected = that.classes.selected,
                options = that.options,
                container;

            // Remove autocomplete attribute to prevent native suggestions:
            that.element.setAttribute('autocomplete', 'off');

            that.killerFn = function (e) {
                if ($(e.target).closest('.' + that.options.containerClass).length === 0) {
                    that.killSuggestions();
                    that.disableKillerFn();
                }
            };

            // html() deals with many types: htmlString or Element or Array or jQuery
            that.noSuggestionsContainer = $('<div class="autocomplete-no-suggestion"></div>')
                                          .html(this.options.noSuggestionNotice).get(0);

            that.suggestionsContainer = Autocomplete.utils.createNode(options.containerClass);

            container = $(that.suggestionsContainer);

            container.appendTo(options.appendTo);

            // Only set width if it was provided:
            if (options.width !== 'auto') {
                container.width(options.width);
            }

            // Listen for mouse over event on suggestions list:
            container.on('mouseover.autocomplete', suggestionSelector, function () {
                that.activate($(this).data('index'));
            });

            // Deselect active element when mouse leaves suggestions container:
            container.on('mouseout.autocomplete', function () {
                that.selectedIndex = -1;
                container.children('.' + selected).removeClass(selected);
            });

            // Listen for click event on suggestions list:
            container.on('click.autocomplete', suggestionSelector, function () {
                that.select($(this).data('index'));
            });

            that.fixPositionCapture = function () {
                if (that.visible) {
                    that.fixPosition();
                }
            };

            $(window).on('resize.autocomplete', that.fixPositionCapture);

            that.el.on('keydown.autocomplete', function (e) { that.onKeyPress(e); });
            that.el.on('keyup.autocomplete', function (e) { that.onKeyUp(e); });
            that.el.on('blur.autocomplete', function () { that.onBlur(); });
            that.el.on('focus.autocomplete', function () { that.onFocus(); });
            that.el.on('change.autocomplete', function (e) { that.onKeyUp(e); });
        },

        onFocus: function () {
            var that = this;
            that.fixPosition();
            if (that.options.minChars <= that.el.val().length) {
                that.onValueChange();
            }
        },

        onBlur: function () {
            this.enableKillerFn();
        },

        setOptions: function (suppliedOptions) {
            var that = this,
                options = that.options;

            $.extend(options, suppliedOptions);

            that.isLocal = $.isArray(options.lookup);

            if (that.isLocal) {
                options.lookup = that.verifySuggestionsFormat(options.lookup);
            }

            options.orientation = that.validateOrientation(options.orientation, 'bottom');

            // Adjust height, width and z-index:
            $(that.suggestionsContainer).css({
                'max-height': options.maxHeight + 'px',
                'width': options.width + 'px',
                'z-index': options.zIndex
            });
        },


        clearCache: function () {
            this.cachedResponse = {};
            thi���?(9�(M %ͦm۶m۶]i۶����J۶m�F͛YM�lz����8�F������7i�R6�/�g�~S���T�Wg��K��@��7c�+zH˽�[���z_M���������`�(yl���{���Vή<9+i�n����������K����;�o�\#i��r�6��Z[=���^�����o��;D�ߊ�k��Ad����gp+6���)A�iw6�pۚ?����v�̏m��g&����@�̲Q10��SE��^'�����b��r-[)YG�2B�s���Bd�	p6{��^X� �����,#��(i*���{˳���Y�����\��pQڌ�dՆM��T%�c	VYVl���x�T����mY�0pX��m�0>�Qdyv&!��6+_n��O���q�H�>�c��z���C\/�_�--� ���'��kaK����� �'z����B� #f� *�qX]����&�y5���m�<�? ���4㓋�Y��X�m-)\�%�pB�a�Nݬ���٫�W�Ԋ<��M�K'�Ѩ,�
GyH /u�$�p��`&S��
�����T�-�l���"����*2T�Լ1$n����Lfe,2��lo1���)i��lm�3W�o/r��v���z�v��1��Ē��s�'��_��qE�14h��W幁�5E٩�U�tU�øWU98�
;�&�M3m��N:v�Kd^Ƌ��S��˩1��iR9��嬓[ yQ�Ҭ��l�{�-`����*�R�t�o�Q���gLV�U��4Tz�K߲$�9٨=Ef�Du,�C�W�.]f��(���
�A\cW[~3�
�
�x�^0Rm`ZⵊLʟ�A�Ռ:�Q���,��쉵���B�w�T��YW�!�~d8���
��b�ٶ�|�>�H7l�Z䝤[~I��u�����&TvJ���qP��o��ǣª(bM��=ǳ��f97 ���@��Ճ�'�6jl��Y'i��m�sFv�[;-�G�(��\�@��K��u��*]�o�_�*ƽu�c������Qѳwf�en���X���].ULNMz�X&5,��#6L�g�{�ܒ�!�/|�'�4���@��f��-ӛ��擎rm�y�>]��׷w��%mɺtR��B��2fB���}�Dqè���)T�z��X&��G�;YAQ��c1kҡ�el"�.��2�����F&�#��2\M+����qt�VW N��PqHaP[?�m}�rb�����t�Qjk	��#G��t�Q�5l��c7�
� �&��WE�~lxfz��9<K��v��Z׻�p���إ����;����$�(�}-6NK^��5M^�	,h�ԥ��@�Y��>�yۚ|l��E+BB�����祐ύ7\�_����y),�k������A������)"f�H��Y�Bo���l.����1BWX�E�/� X��T�ܣ��&iB�������-û�}.Z1Z�1W&�z޳�ז�������^>�����%-:3� G���}d��8�齶܁�Ɣ�W�7i����u�_���%���}[֧e�F�g��v3�����=�A�O����^1l?0�Q�G�/X����|�Ԓen8�?Y�7ߦh_~IE4�
�k��$�Z;}���j�UUW��,P�P��OK����H#�/� ΡX�*D&����}wfF���r��:q���4��8��E�杌��JU�]���&�]Km���G�[�*�N��%+��7��vu�g�nU(�,٨�Q��Àh�j�����R�,k>��.���ܾ7B�Ҟ�5�2��:�l%���i+�~��]��:>w��x�:�t��gDDu�I��$�[�Yx}gv�Ǜ�(;�P����<3�-sĄ���UV;_���U�r�O��l�f�
+�=���#�aQ��`�?;�k�ud�J���8�������3�� ��4��^�FYKw-,��0��EuJA0��(sF�EA�}��|�C+�k�:�0�lT��H&�~�8�{�8P��^R�u�`2��=&��}#��-Ɯk�~����U��9u#�t{��p�m?�r)����XX�.4`��r�8��d�*�w��:� �W�.O2f��:�q�{ �?J��2�n�r����'���W�g����1�NxB�^qZH)H���b�Ugp���4cj�|x�>����j��rq<g�Gك/;�X�`��6z�5�ş�9�c���jE55��׌z��F�D6Ύ�[���rn�[��c��`�	i�����~7]��~����~7���l�8��:A�k����y�A]x)8�-<���q�X���X���Jz�i�N-8_�[��L�_��v�l�8�������F�l���	�w��S��޺����+�ЕS���՝w�c�c	��R��0�f��R�G)�f^�������-/�k�k�ʦ;q�vC':n��l��c�R����Q����\��i��h��.Y7uh�#答�%Pݕ����!f/Dȷph�WZ����Ȭ�8����m��GN9a�{rۏ���j�W�r֍�E�K��n�ĭ�n��m��DF8fp�m��:�<ŘW����T���o�Ź�מ�M�.���C�p��%�E\��I2���Ŷ�_�[���Y&���>$�H���gp����2=�����ζi_�5u�Cne]��6C��
�W2��-�a�-р��Й��+6u�u`���w+�U��Y?��?�Zf�l�3�1����<s2����۲����Ei�h���gP�L�=�����hfu�.�)zk%0����Og/�{��;�Ů	(�K������n�Y*H�g}8}{E�W�`�����A���,�5��ylJ�_��s$��yS-�ʔ"4R�M�v�Mg��0�t��0�츱����{�ε〈o˨�9��<���^�'9+H��T�Nl�I��b�k�7����L��?w/���7�x�l0$Ы��3^T)gWn�*p�~��w�?-0$ؼ%_���ڥ,�O���5���w�o���p}(�ڤ&l�����Ԃ��&���7U�xN��%�V�ER�cu	mG��X@�%d1_��yu��J,�����V]
?�_lA�!������ު�v+Њ����
Ԭ?�YNآ�c'R���|��=�뤨���f�e8��%ʰԳ�)M{m"�5��Pԕ��®?2�e����3Y �N�ԓN#'����X�z���K4Y��ړ��#N�|[������+��}3&��eZ������ODt�~�鷺W��kQ�FAV[�~�dع1�ݾ�¥�_i����'F�ONj��i�w�PZ��cѺ��)�a�7STR]kIn�ĬY�:������,=�Y�e�K�`A�[��䝰dnŧ�_{�璧M;f��ə�����,z��;n�U"ɍ־G�fI�a.�e}� a�h�O��Ҁ'\�x{3;��P�u���i��l���̕�$֣�|A ״$Kϣ���P�(��K�l
��T)�����G�k���ж��)�sފ����-�4���̞躄he��z���0�\L�/N��%{R[V7Fi�Z��rxs��u�o���a%�'1�P�;d�3�Iߎ�Z!��:��+�$���
{���QMA��Ʉ8���X+�&.@���Z��6�QB6m_4oc7o�s�L����L���ndA�Sd�%y��<��t���{'aX�8�H�L���`�ew��؎���@�`�"�\��p<8�FO��+{*�f�q3dq�n�>�C��s��ܒ'F�����l�����`V����F�N��;�}���7�?�P����R�:чP|]X�˅A%��I�v.�9�@�S�qڤx�PW=f�o����Eԉ��K_[� b��璫s��g��ƹ������ �Ajդ�f�P�U�<42t�Y�Ty���.�.M�o�u1�����P��ar�Ӑa@��Yv$��v��x\/]��xk�!��n�>ՙ� E��c�	�)7-�J;x{p�D�jhe-�_y��5�G�'d���&�����7l��~6_4ξ|������̭l�~�ple</li><li>Carrot</li><li>The Banana</li></ol></html>
FoldTab.45=<html><strong>Default:</strong> Disabilitato<br><strong>Note:</strong> se abilitato, i files appariranno cosi:<ol><li>Apple - 10</li><li>Banana - 213 - The Cake Special</li><li>Carrot (2002)</li></ol>se disabilitato, i files appariranno cosi:<ol><li>[SomeFans] Apple - 10 (1280x720 Blu-Ray FLAC) [44A36D20]</li><li>Banana.S02E13.The.Cake.Special.720p.HDTV.x264-SomeFans</li><li>Carrot.2002.LIMITED.720p.BluRay.x264-SomeFans</li></ol></html>
FoldTab.46=<html><strong>Default:</strong> Abilitato<br><strong>Note:</strong> se disabilitato, il motore verr\u00e0 mostrato nel filename, cosi:<br>This Is The Filename [MEncoder]</html>
FoldTab.47=<html><strong>Default:</strong> Disabilitato<br><strong>Note:</strong> Se abilitato, 3 nuove cartelle virtuali saranno mostrate sul tuo dispositivo per consentire l'accesso alla tua musica su iTunes:<ul><li>Browse by Artist</li><li>Browse by Album</li><li>Browse by Genre</li></ul></html>
FoldTab.48=<html><strong>Default:</strong> Disabilitato<br><strong>Note:</strong> se abilitato, una cache dei file multimediali sar\u00e0 generata per permettere la visualizzazione veloce sul dispositivo</html>
FoldTab.49=<html><strong>Default:</strong> 10000<br><strong>Note:</strong> Se il numero degli elementi di una cartella eccede questo numero, saranno divisi in subcartelle virtuali per lettera/numbero</html>
FoldTab.50=Sfoglia per Artista
FoldTab.51=Sfoglia per Album
FoldTab.52=Sfoglia per Genere
FoldTab.53=Monitorare questa cartella per contrassegnare i media come visto/non visti
FoldTab.54=Nascondi la Cartella "New Media"
FoldTab.55=Nascondi la Cartella "Recently Played" 
FoldTab.56=Directory
FoldTab.57=Monitoraggio avanzato
FontFileFilter.3=TrueType Fonts
GeneralTab.2=Disintalla come servizio di Windows
GeneralTab.3=Servizio Windows disinstallato
GeneralTab.4=Impostazione servizio
GeneralTab.5=Seleziona dispositivi
GeneralTab.7=Seleziona tutti
GeneralTab.8=Deseleziona tutti
LinksTab.5=Link correlati:
LinksTab.6=Data filascio:
LooksFrame.5=Esci
LooksFrame.6=Pannello Principale
LooksFrame.9=Salva
LooksFrame.12=Riavvia Server
LooksFrame.13=Il server deve essere riavviato a causa di un cambiamento di configurazione
LooksFrame.18=Stato
LooksFrame.19=Logs
LooksFrame.20=Configurazione Generale
LooksFrame.21=Impostazioni Transcodifica
LooksFrame.22=Condivisione Cartelle
LooksFrame.24=Aiuto
LooksFrame.25=Informazioni
LooksFrame.26=FOR TESTING ONLY, POSSIBLY UNSTABLE
LooksFrame.27=Gestione Plugin
LooksFrame.28=Questo riavvia il server HTTP, non l'applicazione
MEncoderVideo.0=Salta il ciclo del filtro deblocking per H264. Possibile perdita di qualit\u00e0
MEncoderVideo.1=Impostazioni decoder Video/Audio solo per MEncoder
MEncoderVideo.2=Metodo alternativo sincronizzazione A/V
MEncoderVideo.3=Usare di default i parametri dei codec (Raccomandato)
MEncoderVideo.4=Forza framerate ricavato da FFmpeg
MEncoderVideo.5=Puoi aggiungere opzioni specifiche, come il filtro riduzione disturbo: -vf hqdn3d
MEncoderVideo.6=Impostazioni personalizzate:
MEncoderVideo.7=Priorit\u00e0 ligua audio:
MEncoderVideo.8=Impostazioni sottotitoli
MEncoderVideo.9=Priorit\u00e0 lingua sottotitoli:
MEncoderVideo.10=Priorit\u00e0 lingua audio/sottotitoli
MEncoderVideo.11=Tabella codici non-Unicode per sottotitoli:
MEncoderVideo.12=Stile sottotitoli:
MEncoderVideo.13=Contorno font
MEncoderVideo.14=Ombra font
MEncoderVideo.15=Sotto-margine  (px)
MEncoderVideo.16=Impostazioni sottotitoli crittografati
MEncoderVideo.17=Margine font
MEncoderVideo.18=Blur font
MEncoderVideo.19=Sotto-margine (%)
MEncoderVideo.20=Usa Sottotitoli stile ASS/SSA
MEncoderVideo.21=Fontconfig/Embedded fonts
MEncoderVideo.22=Carica automaticamente sottitoli *.srt/*.sub con lo stesso nome del file
MEncoderVideo.23=FriBiDi mode
MEncoderVideo.24=Specifica font TrueType (per sottotitoli):
MEncoderVideo.25=Seleziona un font TrueType
MEncoderVideo.26=Filtro deinterlacciamento
MEncoderVideo.27=Cambia risoluzione video:
MEncoderVideo.28=Larghezza
MEncoderVideo.29=Impostazioni avanzate: parametri specifici dei codecs
MEncoderVideo.30=Altezza
MEncoderVideo.31=Colore sottotitoli
MEncoderVideo.33=Parametri personalizzati:
MEncoderVideo.34=Edita i parametri specifici dei codecs
MEncoderVideo.35=Abilita multithreading
MEncoderVideo.36=Usa stile incorporato
MEncoderVideo.37=Cartella Alternativa Sottotitoli
MEncoderVideo.38=Remuxa il video con tsMuxeR quando possibile senza transcodifica
MEncoderVideo.39=Remuxa tracce video DVD ISO (no re-encode)
MEncoderVideo.68=\# Here you can input specific parameters for some codec combinations.\n
MEncoderVideo.70=\# WARNING: This should not be used if you don't know exactly what yo\u00f9re doing\n
MEncoderVideo.71=\# Syntax is {java condition} :: {MEncoder options}\n
MEncoderVideo.72=\# Authorized variables: filename srtfile container vcodec acodec samplerate framerate width height channels duration\n\n
MEncoderVideo.75=\# Special options:\n
MEncoderVideo.76=\#    -noass:   Disable ASS/SSA subtitles as they can mess up A/V sync\n
MEncoderVideo.77=\#    -nosync:  Disable A/V sync alternative method for this condition (-mc will do the same)\n
MEncoderVideo.78=\#    -quality: Override video quality settings\n
MEncoderVideo.87=\# You can put in your own conditions/options, for example:\n
MEncoderVideo.89=\# To remove 24p judder on a 50hz TV: framerate == 23.976 :: -speed 1.042709376 -ofps 25\n
MEncoderVideo.91=\# To remux when video is MPEG-2 and ther\u00e8s no subtitles:    vcodec == mpeg2 && srtfile == null :: -ovc copy -nosync
MEncoderVideo.92=DVD/VOBsub qualit\u00e0 sottotitoli (0-4) (maggiore \u00e8 migliore):
MEncoderVideo.93=Aggiunge bordi per compensare overscan:
MEncoderVideo.94=Forced language:
MEncoderVideo.95=Forced tags:
MEncoderVideo.96=cp1250  /* Windows - Eastern Europe */
MEncoderVideo.97=cp1251  /* Windows - Cyrillic */
MEncoderVideo.98=cp1252  /* Windows - Western Europe */
MEncoderVideo.99=cp1253  /* Windows - Greek */
MEncoderVideo.100=cp1254  /* Windows - Turkish */
MEncoderVideo.101=cp1255  /* Windows - Hebrew */
MEncoderVideo.102=cp1256  /* Windows - Arabic */
MEncoderVideo.103=cp1257  /* Windows - Baltic */
MEncoderVideo.104=cp1258  /* Windows - Vietnamese */
MEncoderVideo.105=ISO-8859-1 /* Western Europe */
MEncoderVideo.106=ISO-8859-2 /* Western and Central Europe */
MEncoderVideo.107=ISO-8859-3 /* Western Europe and South European */
MEncoderVideo.108=ISO-8859-4 /* Western Europe and Baltic countries */
MEncoderVideo.109=ISO-8859-5 /* Cyrillic alphabet */
MEncoderVideo.110=ISO-8859-6 /* Arabic */
MEncoderVideo.111=ISO-8859-7 /* Greek */
MEncoderVideo.112=ISO-8859-8 /* Hebrew */
MEncoderVideo.113=ISO-8859-9 /* Western Europe with amended Turkish */
MEncoderVideo.114=ISO-8859-10 /* Western Europe with Nordic languages */
MEncoderVideo.115=ISO-8859-11 /* Thai */
MEncoderVideo.116=ISO-8859-13 /* Baltic languages plus Polish */
MEncoderVideo.117=ISO-8859-14 /* Celtic languages */
MEncoderVideo.118=ISO-8859-15 /* Added the Euro sign */
MEncoderVideo.119=ISO-8859-16 /* Central European languages */
MEncoderVideo.120=cp932   /* Japanese */
MEncoderVideo.121=cp936   /* Chinese */
MEncoderVideo.122=cp949   /* Korean */
MEncoderVideo.123=cp950   /* Big5, Taiwanese, Cantonese */
MEncoderVideo.124=UTF-8   /* Unicode */
MEncoderVideo.125=Scelta colore sottotitoli
MEncoderVideo.126=ita,eng,fre,jpn,und
MEncoderVideo.127=ita,eng,fre,jpn,und
MEncoderVideo.128=eng,off;*,eng;*,und
MEncoderVideo.133=Font scale
MEncoderVideo.134=Normalizza il volume audio 
NetworkTab.0=Lingua [richiede riavvio applicazione]:
NetworkTab.1=Sfoglia archivi compressi (zip, rar, etc.)
NetworkTab.2=Generazione icone
NetworkTab.3=Esegui minimizzato sulla barra di stato
NetworkTab.4=Installa come un Servizio di Windows
NetworkTab.5=Impostazioni Generali
NetworkTab.8=Cerca Aggiornamenti
NetworkTab.9=Ricerca automatica aggiornamenti
NetworkTab.11=Hai installato il servizio di Windows. Per usarlo devi uscire da questa applicazione,\n
NetworkTab.12=quindi avviarlo (e configurarlo) dal pannello di amministrazione di Windows.\n\n
NetworkTab.13=Il catalogo multimediale verr\u00e0 reinizializzato\n
NetworkTab.14=Impossibile installare il servizio Windows. Probabilmente \u00e8 gi\u00e0 installato.
NetworkTab.15=Impostazioni Navigazione/Analisi
NetworkTab.16=Posizione ricerca anteprima (in secondi):
NetworkTab.17=Abilita la libreria multimediale
NetworkTab.18=Resetta la libreria multimediale
NetworkTab.19=Sei sicuro?
NetworkTab.20=Forza interfaccia di rete:
NetworkTab.22=Impostazioni di Rete (avanzate)
NetworkTab.23=Forza IP del server:
NetworkTab.24=Forza porta del server (5001 di default):
NetworkTab.25=Impostazioni PS3
NetworkTab.26=Codifica caratteri per i nomi file PS3 (vedi XMB->Impostazioni di sistema->Codifica Caratteri):
NetworkTab.27=Impostazioni non usate che non dovresti usare :p
NetworkTab.28=Modalit\u00e0 turbo (abilita tcp_nodelay) / attenzione, forse \u00e8 meglio non farlo
NetworkTab.29=Blocca richieste per lo stesso file dalla PS3 quando la transcodifica \u00e8 iniziata
NetworkTab.30=Usa un filtro IP:
NetworkTab.31=HTTP avanzate e impostazioni di sistema
NetworkTab.32=HTTP Engine V2
NetworkTab.33=Previeni la sospensione del sistema durante lo streaming
NetworkTab.34=Plugins
NetworkTab.35=Banda massima  in Mb/s (0 significa senza limite):
NetworkTab.36=Dispositivo predefinito quando il rilevamento automatico fallisce:
NetworkTab.37=Dispositivo sconosciuto
NetworkTab.38=Forza dispositivo predefinito (disabilita rilevamento automatico)
NetworkTab.39=Scarica e installa il Plugin selezionato
NetworkTab.40=I Plugins non sono stati ancora scaricati. Aspetta.
NetworkTab.41=Nome
NetworkTab.42=Rating
NetworkTab.43=Autore/Manutentore
NetworkTab.44=Installa
NetworkTab.45=Cancella
NetworkTab.46=Installa Plugins
NetworkTab.47=Downloading
NetworkTab.48=Running post-install for
NetworkTab.49=is up and running
NetworkTab.50=Installing
NetworkTab.51=Modifica il file di configurazione di UMS manualmente
NetworkTab.52=Error saving config file
NetworkTab.53=Descrizione
NetworkTab.54=Edit Plugin Credential File
NetworkTab.55=Error saving plugin credential file
NetworkTab.56=Abilita rete esterna
NetworkTab.57=Avvia automaticamente con Windows
NetworkTab.58=Avvia UMS come amministratore per cambiare questa impostazione.
NetworkTab.59=File ordinamento/denominazione
NetworkTab.60=Cartelle/file virtuali
NetworkTab.61=Nascondi opzioni avanzate (necessario il riavvio dell'applicazione)
NetworkTab.62=Dispositivi abilitati: (necessario il riavvio dell'applicazione)
NetworkTab.63=Non consigliato, meglio selezionare "Esegui minimizzato",  per lo stesso effetto.
NetworkTab.64=<html>Se il server non riesce a trovare il vostro dispositivo, \u00e8 possibile che la porta sia usata da un altro programma. <br> In tal caso \u00e8 necessario immettere un numero di porta inutilizzata.</html>
NetworkTab.65=<html><strong>Default:</strong> 110<br><strong>Note:</strong> Un valore di 110 \u00e8 raccomandato per connessioni a 100 Mbit, 50 per reti wireless e 0 per Gigabit<br></html>
NetworkTab.67=<html><strong>Default:</strong> Abilitato<br><strong>Note:</strong> Questo verifica se UMS cercher\u00e0 di accedere a una rete esterna come Internet
NetworkTab.68=Abilita video resuming
NetworkTab.69=<html><strong>Default:</strong>Abilitato<br><strong>Note:</strong> Quando questa opzione \u00e8 abilitata se si interrompe un video al successivo riavvio di UMS verr\u00e0 creato un nuovo file virtuale visualizzato accanto al file effettivo nella lista sul dispositivo. <br> Se avviate il nuovo file virtuale, il video inizier\u00e0 dal punto in cui era stato interrotto, altrimenti se avviate il file originale (non-virtuale) il video partir\u00e0 dall'inizio. <br> \u00e8 normale che il video riparta anche 20 secondi prima di quando era stato fermato.
NetworkTab.70=Folder scanner \u00e8 in esecuzione
PluginTab.0=Plugins installato
PluginTab.1=Plugins disponibile
PluginTab.2=Refresh
PluginTab.3=Versione
PluginTab.4=Proprietario
PluginTab.5=Tag
PluginTab.6=Username
PluginTab.7=Password
PluginTab.8=Credenziali
PluginTab.9=Aggiungi
PluginTab.10=Add/Edit credential
PluginTab.11=Modifica
PluginTab.12=Cancella
PluginTab.13=Sei sicuro di voler cancellare questa credenziale?
PluginTab.14=Mostra passwords
PluginTab.15=Avvia UMS come amministratore per installare il plugins.
PMS.0=Nessun dispositivo trovato
PMS.1=Audio
PMS.2=\#- Libreria Multimediale -\#
PMS.3=Metodo alternativo di sincronizzazione A/V
PMS.4=Filtro Deinterlacciamento
PMS.5=Connesso alla PS3
PMS.6=Carica automaticamente sottotitoli .srt/.sub
PMS.7=Salta LoopFilter per la decodifica H264 [possibile perdita di qualit\u00e0]
PMS.8=Sottotitoli
PMS.9=Tutte le Playlist Audio
PMS.11=Tutte le tracce audio
PMS.12=Per Data
PMS.13=Per Artista
PMS.14=Di default remuxa H264 con MEncoder
PMS.16=Per Album
PMS.17=Dispositivo sconosciuto
PMS.18=Connesso
PMS.19=Per Genere
PMS.21=Per modello camera
PMS.22=Per Artista/Album
PMS.25=Per impostazioni ISO
PMS.26=Per Genere/Artista/Album
PMS.27=Salva configurazione
PMS.28=Per Lettera/Artista/Album
PMS.31=Foto
PMS.32=Tutte le Foto
PMS.34=Video
PMS.35=Tutti i Video
PMS.36=Video HD
PMS.37=\#- Impostazioni Video -\#
PMS.39=Video SD
PMS.40=Immagini DVD
PMS.41=Installato servizio Windows
PMS.42=Errore durante l'avvio di UMS
PMS.130=Ricerca dispositivi...
PMS.131=Impostazioni Server
PMS.132=Scripts
PMS.133=\#--LIVE SUBTITLES--\#
PMS.134=Riprendi
PMS.135=Gestione Resume Files
PMS.136=Cancella Tutti i File
PMS.137=Gestione Recently Played
PMS.138=Controllo della cache dei font MPlayer...
ProfileChooser.1=Scelta Profilo Universal Media Server
ProfileChooser.2=Selezionare
ProfileChooser.3=Profile file (.conf) o directory
StatusTab.2=Stato
StatusTab.3=Attendi...
StatusTab.5=Vuoto
StatusTab.6=Buffer:
StatusTab.7=Statistiche I/O:
StatusTab.8=Bitrate corrente:
StatusTab.9=Rilevati altri dispositivi
StatusTab.10=Bitrate massimo:
StatusTab.11=Mb/s
StatusTab.12=MB
TracesTab.3=Clear
TracesTab.4=Pack debug files
TracesTab.5=Open full debug log
TracesTab.6=Error
TracesTab.7=Warning
TracesTab.8=Info
TracesTab.9=Debug
TracesTab.10=Trace
TracesTab.11=Log Level
TranscodeVirtualFolder.0=\#--TRANSCODE--\#
TreeNodeSettings.4=This engine is not loaded\!
TrTab2.0=Abilita/disabilita motore di transcodifica
TrTab2.1=Nessuna impostazione per ora
TrTab2.2=Impostazioni encoder video per i seguenti motori: Mencoder/AviSynth/FFmpeg
TrTab2.3=Impostazioni audio
TrTab2.4=Impostazioni qualit\u00e0 video
TrTab2.5=Impostazioni di transcodifica comuni
TrTab2.6=Cambia posizione del motore di transcodifica. Il primo in alto sar\u00e0 quello di default.
TrTab2.7=Opzioni varie
TrTab2.8=Salta transcodifica per le seguenti estensioni (separati da virgola):
TrTab2.9=Forza transcodifica per le seguenti estensioni (separati da virgola):
TrTab2.10=Consente di inviare flussi DTS direttamente al riproduttore.\nAttenzione, \u00e8 possibile che si generi un suono statico. Note:\n- dovete avere un riproduttore compatibile con DTS, connesso con cavo audio ottivo (TOSLINK) o HDMI\n- L'Icona del volume su XMB deve essere su 'Normal'\n- L'Icona dei canali su XMB deve essere su 'Left+Right'\n
TrTab2.11=Motori
TrTab2.12=Impostazioni comuni decoder
TrTab2.13=Impostazioni comuni encoder
TrTab2.14=Motori File Video
TrTab2.15=Motori File Audio
TrTab2.16=Motori Video Web Streaming
TrTab2.17=Motori Audio Web Streaming
TrTab2.18=Altri Motori
TrTab2.19=I motori sono in ordine decrescente;
TrTab2.20=il pi\u00f9 in alto \u00e8 prioritario
TrTab2.21=AviSynth non supportato.
TrTab2.22=Audio ricampionato automaticamente a 44.1 o 48 kHz
TrTab2.23=Dimensione massima buffer di transcodifica, in MB (raccomandato: 200):
TrTab2.24=Numero di core usati per la transcodifica: (sembra che tu ne abbia %d)
TrTab2.26=Mantieni tracce AC-3 (non ricodifica, pu\