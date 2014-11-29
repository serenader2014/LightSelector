(function (global, factory) {

    factory(global);

})(this, function (window) {

    function LightSelector (e) {
        var self = this;

        self.e = e;
        self.origin = {
            options: function () {
                return self.e.find('option');
            },
            selected: function () {
                return self.e.find('option:selected');
            }
        };
        self.options = (function () {
            var arr = [];
            self.origin.options().each(function (index, o) {
                arr.push($(o).html());
            });

            return arr;
        })();
        self.current = self.origin.options().index(self.origin.selected());
        self.status = {
            isExpanded: false
        };
    }

    LightSelector.count = 1;

    LightSelector.prototype = {
        constructor: LightSelector,
        init: function (opt) {
            var self = this;

            self.createUI().eventBinding();
            
            return self;
        },
        createUI: function () {
            var self = this;

            var selector = $('<div>')
                    .addClass(self.css.selector.substring(1))
                    .addClass('s-'+(++LightSelector.count)),
                
                selectorWrapper = $('<div>')
                    .addClass(self.css.wrapper.substring(1)),
                
                current = $('<span>')
                    .addClass(self.css.currentSelected.substring(1))
                    .html(self.options[self.current]),
                
                optionsList = $('<ul>')
                    .addClass(self.css.optionsList.substring(1)),

                pageHeight = $(document).height(),
                position,
                height;
                
            selector
                .append(current)
                .append(selectorWrapper.append(optionsList));

            self.e.after(selector);

            self.e.addClass(self.css.selector.substring(1));
            self.origin.options().each(function (index, option) {
                optionsList.append($('<li>').html($(option).html()).addClass(self.current === index ? self.css.optionSelected.substring(1) : ''));
            });

            self.selector = self.e.next();

            position = self.selector.offset();
            height = self.selector.height();
            optionsList.css({maxHeight: pageHeight - (height + position.top) - 20});
            
            return self;
        },
        expand: function () {
            var self = this;
            
            self.getDomElement().wrapper.fadeIn(100);
            self.status.isExpanded = true;
            
            return self;
        },
        collapse: function () {
            var self = this;
            
            self.getDomElement().wrapper.fadeOut(100);
            self.status.isExpanded = false;
            
            return self;
        },
        changeOption: function (index) {
            var self = this;

            self.current = index;
            self.origin.options().eq(index).prop('selected', true);
            self.updateUI(function () {
                self.collapse();
            });

            return self;
        },
        updateUI: function (callback) {
            var self = this;

            self.getDomElement().currentSelected.html(self.options[self.current]);
            self.getDomElement().optionsList.find('li').removeClass(self.css.optionSelected.substring(1))
                .eq(self.current).addClass(self.css.optionSelected.substring(1));

            if (callback && typeof callback === 'function') {
                callback();
            }
            return self;
        },
        eventBinding: function () {
            var self = this;
            
            self.getDomElement().currentSelected.on('click', function () {
                if (self.status.isExpanded) {
                    self.collapse();
                } else {
                    self.expand();
                }
            });

            self.getDomElement().optionsList.find('li').on('click', function () {
                self.changeOption(self.getDomElement().optionsList.find('li').index($(this)));
            });

            $(document).on('click', function (e) {
                if (self.status.isExpanded && $(e.target).parents(self.css.selector).length === 0) {
                    self.collapse();
                } 
            });

            return self;
        },
        css: {
            selector: '.light-selector',
            wrapper: '.ls-wrapper',
            currentSelected: '.ls-current',
            optionsList: '.ls-list',
            optionSelected: '.selected'
        },
        getDomElement: function () {
            var self = this;

            return {
                selector: self.selector,
                wrapper: self.selector.find(self.css.wrapper),
                currentSelected: self.selector.find(self.css.currentSelected),
                optionsList: self.selector.find(self.css.optionsList)
            };
        }

    };

    $.fn.lightSelector = function (opt) {
        return (new LightSelector(this)).init(opt);
    };
});