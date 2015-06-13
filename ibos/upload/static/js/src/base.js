/* ===================================================
 * bootstrap-transition.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);


/* ========================================================================
 * Bootstrap: dropdown.js v3.0.3
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);


/* =============================================================
 * bootstrap-scrollspy.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }
        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){

      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }
      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ===========================================================
 * bootstrap-popover.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ==========================================================
 * bootstrap-affix.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

 // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })


}(window.jQuery);
/* ==========================================================
 * bootstrap-alert.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
/* ============================================================
 * bootstrap-button.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-collapse.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-carousel.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-typeahead.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);
// $.fn.colorPicker
/* 选色器 */
(function(window, $) {
	var lang = {
		TITLE: "请选择颜色",
		RESET: "重置颜色"
	}
	$.fn.colorPicker = function(conf) {
		// Config for plug
		var defaultData = ["#FFFFFF", "#E26F50", "#EE8C0C", "#FDE163", "#91CE31", "#3497DB", "#82939E", "#B2C0D1"];
		var config = $.extend({
			id: 'jquery-colour-picker', // id of colour-picker container
			horizontal: false, // 是否垂直排列色板
			// title: lang.TITLE, // Default dialogue title
			speed: 200, // Speed of dialogue-animation
			position: { my: "left top", at: "left top" },
			data: defaultData,
			style: "",
			reset: true,
			onPick: null // 选择时触发的回调
		}, conf);

		// Add the colour-picker dialogue if not added
		var colourPicker = $('#' + config.id);

		if (!colourPicker.length) {
			colourPicker = $('<div id="' + config.id + '" class="jquery-colour-picker ' + config.style + '"></div>').appendTo(document.body).hide();

			// Remove the colour-picker if you click outside it (on body)
			$(document.body).click(function(event) {
				if (!($(event.target).is('#' + config.id) || $(event.target).parents('#' + config.id).length)) {
					colourPicker.slideUp(config.speed);
				}
			});
		}

		if (config.horizontal) {
			colourPicker.addClass("horizontal");
			//垂直模式时，去掉title
			config.title = "";
		}

		// For every select passed to the plug-in
		return this.each(function() {
			if($.data(this, 'colorPicker')){
				return false;
			}
			// input element
			var loc = '',
				hex, title,
				createItemTemp = function(hex, title) {
					return '<li><a href="#" title="' + title + '" rel="' + hex + '" style="background: ' + hex + ';">' + title + '</a></li>'
				};

			// 当由data属性提供数据
			if (config.data) {
				for (var i = 0, len = config.data.length; i < len; i++) {
					//当data项是颜色值
					if (typeof config.data[i] === 'string') {
						loc += createItemTemp(config.data[i], config.data[i]);
						//当data项是键值对
					} else {
						loc += createItemTemp(config.data[i].hex, config.data[i].title);
					}
				}
				// 创建清除按钮
				if(config.reset){
					loc += createItemTemp("", lang.RESET);
				}

				// 为select元素时，从option中获取数据
			} else {
				//@Debug:
				throw new Error('数据不存在')
			}

			// When you click the ctrl
			var ctrl = config.ctrl && config.ctrl.length ? config.ctrl : $(this);
			ctrl.click(function() {
				// Show the colour-picker next to the ctrl and fill it with the colours in the select that used to be there
				var heading = config.title ? '<h2>' + config.title + '</h2>' : '';
				var pos = $.extend({ of: ctrl }, config.position);
				colourPicker.html(heading + '<ul>' + loc + '</ul>').css({
					position: 'absolute'
				})
				.slideDown(config.speed)
				.position(pos);

				return false;
			});

			// When you click a colour in the colour-picker
			colourPicker.on('click', 'a', function() {
				// The hex is stored in the link's rel-attribute
				var hex = $(this).attr('rel'),
					title = $(this).text();
				config.onPick && config.onPick(hex, title)
				// Hide the colour-picker and return false
				colourPicker.slideUp(config.speed);
				return false;
			});

			$.data(this, "colorPicker", true);
		});
	}

})(window, window.jQuery);


/**
 * @license
 * =========================================================
 * bootstrap-datetimepicker.js
 * http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 *
 * Contributions:
 *  - Andrew Rowls
 *  - Thiago de Arruda
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================
 */

(function($) {

  // Picker object
  var smartPhone = (window.orientation != undefined);
  var DateTimePicker = function(element, options) {
    this.id = dpgId++;
    this.init(element, options);
  };

  var dateToDate = function(dt) {
    if (typeof dt === 'string') {
      return new Date(dt);
    }
    return dt;
  };

  DateTimePicker.prototype = {
    constructor: DateTimePicker,

    init: function(element, options) {
      var icon;
      if (!(options.pickTime || options.pickDate))
        throw new Error('Must choose at least one picker');
      this.options = options;
      this.$element = $(element);
      this.language = options.language in dates ? options.language : 'en'
      this.pickDate = options.pickDate;
      this.pickTime = options.pickTime;
      this.range = options.range;
      // 当日期范围可用时，禁用时分秒选择
      if(this.range) this.pickTime = false;
      this.isInput = this.$element.is('input');
      this.component = false;
      if (this.$element.is('.input-append') || this.$element.is('.input-prepend')) {
    	  this.component = this.$element.find('.add-on');
      } else {
        this.component = this.options.component
      }

      this.format = options.format;
      if (!this.format) {
        if (this.isInput) this.format = this.$element.data('format');
        else this.format = this.$element.find('input').data('format');
        if (!this.format) this.format = 'mm/dd/yyyy';
      }
      this._compileFormat();
      if (this.component) {
        icon = this.component.find('i');
      }
      if (this.pickTime) {
        if (icon && icon.length) {
        	this.timeIcon = icon.data('time-icon');
        	icon.addClass(this.timeIcon);
        }
        if (!this.timeIcon) this.timeIcon = 'glyphicon-time';
      }
      if (this.pickDate) {
        if (icon && icon.length) {
        	this.dateIcon = icon.data('date-icon');
        	icon.removeClass(this.timeIcon);
        	icon.addClass(this.dateIcon);
        }
        if (!this.dateIcon) this.dateIcon = 'glyphicon-calendar';
      }
      this.widget = $(getTemplate(this.timeIcon, options.pickDate, options.pickTime, options.pick12HourFormat, options.pickSeconds, options.collapse)).appendTo('body');
      this.widget.find('.datepicker-months thead').append('<tr><th colspan="7">' + dates[this.language].selectMonth + '</th></tr>');
      this.widget.find('.datepicker-years thead').append('<tr><th colspan="7">' + dates[this.language].selectYear + '</th></tr>');
      this.minViewMode = options.minViewMode||this.$element.data('date-minviewmode')||0;
      if (typeof this.minViewMode === 'string') {
        switch (this.minViewMode) {
          case 'months':
            this.minViewMode = 1;
          break;
          case 'years':
            this.minViewMode = 2;
          break;
          default:
            this.minViewMode = 0;
          break;
        }
      }
      this.viewMode = options.viewMode||this.$element.data('date-viewmode')||0;
      if (typeof this.viewMode === 'string') {
        switch (this.viewMode) {
          case 'months':
            this.viewMode = 1;
          break;
          case 'years':
            this.viewMode = 2;
          break;
          default:
            this.viewMode = 0;
          break;
        }
      }
      this.startViewMode = this.viewMode;
      this.weekStart = options.weekStart||this.$element.data('date-weekstart')||0;
      this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
      this.setStartDate(options.startDate || this.$element.data('date-startdate'));
      this.setEndDate(options.endDate || this.$element.data('date-enddate'));
      this.fillDow();
      this.fillMonths();
      this.fillHours();
      this.fillMinutes();
      this.fillSeconds();
      this.update();
      this.showMode();
      this._attachDatePickerEvents();
    },

    show: function(e) {
      this.widget.show();
      this.height = this.component ? this.component.outerHeight() : this.$element.outerHeight();
      this.place();
      this.$element.trigger({
        type: 'show',
        date: this._date,
        lastDate: this._lastDate
      });
      this._attachDatePickerGlobalEvents();
      var expanded = this.widget.find(".collapse.in");
      this.widget.find(".accordion-toggle").html(this.formatDate(this._date).split(" ")[+!expanded.find(".timepicker").length])


      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
    },

    disable: function(){
          this.$element.find('input').prop('disabled',true);
          this._detachDatePickerEvents();
    },
    enable: function(){
          this.$element.find('input').prop('disabled',false);
          this._attachDatePickerEvents();
    },

    hide: function() {
      // Ignore event if in the middle of a picker transition
      var collapse = this.widget.find('.collapse')
      for (var i = 0; i < collapse.length; i++) {
        var collapseData = collapse.eq(i).data('collapse');
        if (collapseData && collapseData.transitioning)
          return;
      }
      this.widget.hide();
      this.viewMode = this.startViewMode;
      this.showMode();
      this.set();
      this.$element.trigger({
        type: 'hide',
        date: this._date,
        lastDate: this._lastDate
      });
      this._detachDatePickerGlobalEvents();
    },

    // set: function() {
    //   var formatted = '';
    //   if (!this._unset) formatted = this.formatDate(this._date);
    //   if (!this.isInput) {
    //     if (this.component){
    //       var input = this.$element.find('input');
    //       input.val(formatted);
    //       this._resetMaskPos(input);
    //     }
    //     this.$element.data('date', formatted);
    //   } else {
    //     this.$element.val(formatted);
    //     this._resetMaskPos(this.$element);
    //   }
    // },
    set: function() {
      var formatted = '';
      if (!this._unset) {
        if(this.range && this._lastDate) {
          var start, end;
          if(this._date.valueOf() > this._lastDate.valueOf()){
            start = this.formatDate(this._lastDate);
            end = this.formatDate(this._date);
          } else {
            start = this.formatDate(this._date);
            end = this.formatDate(this._lastDate);
          }
          formatted = start + " - " + end;
        }
        else {
          formatted = this.formatDate(this._date);
        }
      }
      if (!this.isInput) {
        if (this.component){
          var input = this.$element.find('input');
          input.val(formatted);
          this._resetMaskPos(input);
        }
        this.$element.data('date', formatted);
      } else {
        this.$element.val(formatted);
        this._resetMaskPos(this.$element);
      }
    },

    setValue: function(newDate) {
      if (!newDate) {
        this._unset = true;
      } else {
        this._unset = false;
      }
      if (typeof newDate === 'string') {
        if(this.range){
          this._lastDate = this.parseDate(newDate.split(" - ")[0])
          this._date = this.parseDate(newDate.split(" - ")[1]);
        }
      } else if(newDate) {
        this._date = new Date(newDate);
      }
      this.set();
      this.viewDate = UTCDate(this._date.getUTCFullYear(), this._date.getUTCMonth(), 1, 0, 0, 0, 0);
      this.fillDate();
      this.fillTime();
    },

    getDate: function() {
      if (this._unset) return null;
      return new Date(this._date.valueOf());
    },

    getLastDate: function(){
      if (this._unset) return null;
      return this._lastDate ? new Date(this._lastDate.valueOf()) : null;
    },

    setDate: function(date) {
      if (!date) this.setValue(null);
      else this.setValue(date.valueOf());
    },

    setStartDate: function(date) {
      if (date instanceof Date) {
        this.startDate = date;
      } else if (typeof date === 'string') {
        this.startDate = new UTCDate(date);
        if (! this.startDate.getUTCFullYear()) {
          this.startDate = -Infinity;
        }
      } else {
        this.startDate = -Infinity;
      }
      if (this.viewDate) {
        this.update();
      }
    },

    setEndDate: function(date) {
      if (date instanceof Date) {
        this.endDate = date;
      } else if (typeof date === 'string') {
        this.endDate = new UTCDate(date);
        if (! this.endDate.getUTCFullYear()) {
          this.endDate = Infinity;
        }
      } else {
        this.endDate = Infinity;
      }
      if (this.viewDate) {
        this.update();
      }
    },

    getLocalDate: function() {
      if (this._unset) return null;
      var d = this._date;
      return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
                      d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
    },

    getLocalLastDate: function() {
      if (this._unset) return null;
      var d = this._lastDate;
      return d ? new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
                      d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()) :
                null
    },

    setLocalDate: function(localDate) {
      if (!localDate) this.setValue(null);
      else
        this.setValue(Date.UTC(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate(),
          localDate.getHours(),
          localDate.getMinutes(),
          localDate.getSeconds(),
          localDate.getMilliseconds()));
    },

    place: function(){
      var position = 'absolute';
      var offset = this.component ? this.component.offset() : this.$element.offset();
      this.width = this.component ? this.component.outerWidth() : this.$element.outerWidth();
      offset.top = offset.top + this.height;

      var $window = $(window);
      
      if ( this.options.width != undefined ) {
        this.widget.width( this.options.width );
      }
      
      if ( this.options.orientation == 'left' ) {
        this.widget.addClass( 'left-oriented' );
        offset.left   = offset.left - this.widget.width() + 20;
      }
      
      if (this._isInFixed()) {
        position = 'fixed';
        offset.top -= $window.scrollTop();
        offset.left -= $window.scrollLeft();
      }

      if ($window.width() < offset.left + this.widget.outerWidth()) {
        offset.right = $window.width() - offset.left - this.width;
        offset.left = 'auto';
        this.widget.addClass('pull-right');
      } else {
        offset.right = 'auto';
        this.widget.removeClass('pull-right');
      }

      this.widget.css({
        position: position,
        top: offset.top,
        left: offset.left,
        right: offset.right
      });
    },

    notifyChange: function(){
      this.$element.trigger({
        type: 'changeDate',
        date: this.getDate(),
        lastDate: this.getLastDate(),
        localDate: this.getLocalDate(),
        localLastDate: this.getLocalLastDate()
      });
    },

    update: function(newDate){
      var dateStr = newDate;
      if (!dateStr) {
        if (this.isInput) {
          dateStr = this.$element.val();
        } else {
          dateStr = this.$element.find('input').val();
        }
        if (dateStr) {
          if(this.range){
            var dateStrArr = dateStr.split(" - ");
            this._lastDate = this.parseDate(dateStrArr[0]);
            this._date = this.parseDate(dateStrArr[1]);
          } else {
            this._date = this.parseDate(dateStr);
          }
        }
        if (!this._date) {
          var tmp = new Date()
          this._date = UTCDate(tmp.getFullYear(),
                              tmp.getMonth(),
                              tmp.getDate(),
                              tmp.getHours(),
                              tmp.getMinutes(),
                              tmp.getSeconds(),
                              tmp.getMilliseconds())
        }
      }
      this.viewDate = UTCDate(this._date.getUTCFullYear(), this._date.getUTCMonth(), 1, 0, 0, 0, 0);
      this.fillDate();
      this.fillTime();
    },

    fillDow: function() {
      var dowCnt = this.weekStart;
      var html = $('<tr>');
      while (dowCnt < this.weekStart + 7) {
        html.append('<th class="dow">' + dates[this.language].daysMin[(dowCnt++) % 7] + '</th>');
      }
      this.widget.find('.datepicker-days thead').append(html);
    },

    fillMonths: function() {
      var html = '';
      var i = 0
      while (i < 12) {
        html += '<span class="month">' + dates[this.language].monthsShort[i++] + '</span>';
      }
      this.widget.find('.datepicker-months td').append(html);
    },

    // fillDate: function() {
    //   var year = this.viewDate.getUTCFullYear();
    //   var month = this.viewDate.getUTCMonth();
    //   var currentDate = UTCDate(
    //     this._date.getUTCFullYear(),
    //     this._date.getUTCMonth(),
    //     this._date.getUTCDate(),
    //     0, 0, 0, 0
    //   );
    //   var startYear  = typeof this.startDate === 'object' ? this.startDate.getUTCFullYear() : -Infinity;
    //   var startMonth = typeof this.startDate === 'object' ? this.startDate.getUTCMonth() : -1;
    //   var endYear  = typeof this.endDate === 'object' ? this.endDate.getUTCFullYear() : Infinity;
    //   var endMonth = typeof this.endDate === 'object' ? this.endDate.getUTCMonth() : 12;

    //   this.widget.find('.datepicker-days').find('.disabled').removeClass('disabled');
    //   this.widget.find('.datepicker-months').find('.disabled').removeClass('disabled');
    //   this.widget.find('.datepicker-years').find('.disabled').removeClass('disabled');

    //   this.widget.find('.datepicker-days th:eq(1)').text(
    //     dates[this.language].months[month] + ' ' + year);

    //   var prevMonth = UTCDate(year, month-1, 28, 0, 0, 0, 0);
    //   var day = DPGlobal.getDaysInMonth(
    //     prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
    //   prevMonth.setUTCDate(day);
    //   prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
    //   if ((year == startYear && month <= startMonth) || year < startYear) {
    //     this.widget.find('.datepicker-days th:eq(0)').addClass('disabled');
    //   }
    //   if ((year == endYear && month >= endMonth) || year > endYear) {
    //     this.widget.find('.datepicker-days th:eq(2)').addClass('disabled');
    //   }

    //   var nextMonth = new Date(prevMonth.valueOf());
    //   nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
    //   nextMonth = nextMonth.valueOf();
    //   var html = [];
    //   var row;
    //   var clsName;
    //   while (prevMonth.valueOf() < nextMonth) {
    //     if (prevMonth.getUTCDay() === this.weekStart) {
    //       row = $('<tr>');
    //       html.push(row);
    //     }
    //     clsName = '';
    //     if (prevMonth.getUTCFullYear() < year ||
    //         (prevMonth.getUTCFullYear() == year &&
    //          prevMonth.getUTCMonth() < month)) {
    //       clsName += ' old';
    //     } else if (prevMonth.getUTCFullYear() > year ||
    //                (prevMonth.getUTCFullYear() == year &&
    //                 prevMonth.getUTCMonth() > month)) {
    //       clsName += ' new';
    //     }
    //     if (prevMonth.valueOf() === currentDate.valueOf()) {
    //       clsName += ' active';
    //     }
    //     if ((prevMonth.valueOf() + 86400000) <= this.startDate) {
    //       clsName += ' disabled';
    //     }
    //     if (prevMonth.valueOf() > this.endDate) {
    //       clsName += ' disabled';
    //     }
    //     row.append('<td class="day' + clsName + '">' + prevMonth.getUTCDate() + '</td>');
    //     prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
    //   }
    //   this.widget.find('.datepicker-days tbody').empty().append(html);
    //   var currentYear = this._date.getUTCFullYear();

    //   var months = this.widget.find('.datepicker-months').find(
    //     'th:eq(1)').text(year).end().find('span').removeClass('active');
    //   if (currentYear === year) {
    //     months.eq(this._date.getUTCMonth()).addClass('active');
    //   }
    //   if (currentYear - 1 < startYear) {
    //     this.widget.find('.datepicker-months th:eq(0)').addClass('disabled');
    //   }
    //   if (currentYear + 1 > endYear) {
    //     this.widget.find('.datepicker-months th:eq(2)').addClass('disabled');
    //   }
    //   for (var i = 0; i < 12; i++) {
    //     if ((year == startYear && startMonth > i) || (year < startYear)) {
    //       $(months[i]).addClass('disabled');
    //     } else if ((year == endYear && endMonth < i) || (year > endYear)) {
    //       $(months[i]).addClass('disabled');
    //     }
    //   }

    //   html = '';
    //   year = parseInt(year/10, 10) * 10;
    //   var yearCont = this.widget.find('.datepicker-years').find(
    //     'th:eq(1)').text(year + '-' + (year + 9)).end().find('td');
    //   this.widget.find('.datepicker-years').find('th').removeClass('disabled');
    //   if (startYear > year) {
    //     this.widget.find('.datepicker-years').find('th:eq(0)').addClass('disabled');
    //   }
    //   if (endYear < year+9) {
    //     this.widget.find('.datepicker-years').find('th:eq(2)').addClass('disabled');
    //   }
    //   year -= 1;
    //   for (var i = -1; i < 11; i++) {
    //     html += '<span class="year' + (i === -1 || i === 10 ? ' old' : '') + (currentYear === year ? ' active' : '') + ((year < startYear || year > endYear) ? ' disabled' : '') + '">' + year + '</span>';
    //     year += 1;
    //   }
    //   yearCont.html(html);
    // },

    fillDate: function() {
      var year = this.viewDate.getUTCFullYear();
      var month = this.viewDate.getUTCMonth();
      var currentDate = UTCDate(
        this._date.getUTCFullYear(),
        this._date.getUTCMonth(),
        this._date.getUTCDate(),
        0, 0, 0, 0
      );
      var startYear  = typeof this.startDate === 'object' ? this.startDate.getUTCFullYear() : -Infinity;
      var startMonth = typeof this.startDate === 'object' ? this.startDate.getUTCMonth() : -1;
      var endYear  = typeof this.endDate === 'object' ? this.endDate.getUTCFullYear() : Infinity;
      var endMonth = typeof this.endDate === 'object' ? this.endDate.getUTCMonth() : 12;

      this.widget.find('.datepicker-days').find('.disabled').removeClass('disabled');
      this.widget.find('.datepicker-months').find('.disabled').removeClass('disabled');
      this.widget.find('.datepicker-years').find('.disabled').removeClass('disabled');

      this.widget.find('.datepicker-days th:eq(1)').text(
        dates[this.language].months[month] + ' ' + year);

      var prevMonth = UTCDate(year, month-1, 28, 0, 0, 0, 0);
      var day = DPGlobal.getDaysInMonth(
        prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
      prevMonth.setUTCDate(day);
      prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
      if ((year == startYear && month <= startMonth) || year < startYear) {
        this.widget.find('.datepicker-days th:eq(0)').addClass('disabled');
      }
      if ((year == endYear && month >= endMonth) || year > endYear) {
        this.widget.find('.datepicker-days th:eq(2)').addClass('disabled');
      }

      var nextMonth = new Date(prevMonth.valueOf());
      nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
      nextMonth = nextMonth.valueOf();
      var html = [];
      var row;
      var clsName;
      while (prevMonth.valueOf() < nextMonth) {
        if (prevMonth.getUTCDay() === this.weekStart) {
          row = $('<tr>');
          html.push(row);
        }
        clsName = '';
        if (prevMonth.getUTCFullYear() < year ||
            (prevMonth.getUTCFullYear() == year &&
             prevMonth.getUTCMonth() < month)) {
          clsName += ' old';
        } else if (prevMonth.getUTCFullYear() > year ||
                   (prevMonth.getUTCFullYear() == year &&
                    prevMonth.getUTCMonth() > month)) {
          clsName += ' new';
        }
        if(prevMonth.getUTCDay() === 0 || prevMonth.getUTCDay() == 6){
          clsName += ' weekend';
        }

        if(!this._lastDate) {
          if (prevMonth.valueOf() === currentDate.valueOf()) {
            clsName += ' active';
          }
        } else {
          var minDate = Math.min(this._lastDate.valueOf(), currentDate.valueOf()),
              maxDate = Math.max(this._lastDate.valueOf(), currentDate.valueOf())
          if(prevMonth.valueOf() >= minDate && prevMonth.valueOf() <= maxDate){
            clsName += ' active';
          }
        }

        if ((prevMonth.valueOf() + 86400000) <= this.startDate) {
          clsName += ' disabled';
        }
        if (prevMonth.valueOf() > this.endDate) {
          clsName += ' disabled';
        }
        row.append('<td class="day' + clsName + '">' + prevMonth.getUTCDate() + '</td>');
        prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
      }
      this.widget.find('.datepicker-days tbody').empty().append(html);
      var currentYear = this._date.getUTCFullYear();

      var months = this.widget.find('.datepicker-months').find(
        'th:eq(1)').text(year).end().find('span').removeClass('active');
      if (currentYear === year) {
        months.eq(this._date.getUTCMonth()).addClass('active');
      }
      if (currentYear - 1 < startYear) {
        this.widget.find('.datepicker-months th:eq(0)').addClass('disabled');
      }
      if (currentYear + 1 > endYear) {
        this.widget.find('.datepicker-months th:eq(2)').addClass('disabled');
      }
      for (var i = 0; i < 12; i++) {
        if ((year == startYear && startMonth > i) || (year < startYear)) {
          $(months[i]).addClass('disabled');
        } else if ((year == endYear && endMonth < i) || (year > endYear)) {
          $(months[i]).addClass('disabled');
        }
      }

      html = '';
      year = parseInt(year/10, 10) * 10;
      var yearCont = this.widget.find('.datepicker-years').find(
        'th:eq(1)').text(year + '-' + (year + 9)).end().find('td');
      this.widget.find('.datepicker-years').find('th').removeClass('disabled');
      if (startYear > year) {
        this.widget.find('.datepicker-years').find('th:eq(0)').addClass('disabled');
      }
      if (endYear < year+9) {
        this.widget.find('.datepicker-years').find('th:eq(2)').addClass('disabled');
      }
      year -= 1;
      for (var i = -1; i < 11; i++) {
        html += '<span class="year' + (i === -1 || i === 10 ? ' old' : '') + (currentYear === year ? ' active' : '') + ((year < startYear || year > endYear) ? ' disabled' : '') + '">' + year + '</span>';
        year += 1;
      }
      yearCont.html(html);

      
    },
    

    fillHours: function() {
      var table = this.widget.find(
        '.timepicker .timepicker-hours table');
      table.parent().hide();
      var html = '';
      if (this.options.pick12HourFormat) {
        var current = 1;
        for (var i = 0; i < 3; i += 1) {
          html += '<tr>';
          for (var j = 0; j < 4; j += 1) {
             var c = current.toString();
             html += '<td class="hour">' + padLeft(c, 2, '0') + '</td>';
             current++;
          }
          html += '</tr>'
        }
      } else {
        var current = 0;
        for (var i = 0; i < 6; i += 1) {
          html += '<tr>';
          for (var j = 0; j < 4; j += 1) {
             var c = current.toString();
             html += '<td class="hour">' + padLeft(c, 2, '0') + '</td>';
             current++;
          }
          html += '</tr>'
        }
      }
      table.html(html);
    },

    fillMinutes: function() {
      var table = this.widget.find(
        '.timepicker .timepicker-minutes table');
      table.parent().hide();
      var html = '';
      var current = 0;
      for (var i = 0; i < 3; i++) {
        html += '<tr>';
        for (var j = 0; j < 4; j += 1) {
          var c = current.toString();
          html += '<td class="minute">' + padLeft(c, 2, '0') + '</td>';
          current += 5;
        }
        html += '</tr>';
      }
      table.html(html);
    },

    fillSeconds: function() {
      var table = this.widget.find(
        '.timepicker .timepicker-seconds table');
      table.parent().hide();
      var html = '';
      var current = 0;
      for (var i = 0; i < 3; i++) {
        html += '<tr>';
        for (var j = 0; j < 4; j += 1) {
          var c = current.toString();
          html += '<td class="second">' + padLeft(c, 2, '0') + '</td>';
          current += 5;
        }
        html += '</tr>';
      }
      table.html(html);
    },

    fillTime: function() {
      if (!this._date)
        return;
      var timeComponents = this.widget.find('.timepicker span[data-time-component]');
      var table = timeComponents.closest('table');
      var is12HourFormat = this.options.pick12HourFormat;
      var hour = this._date.getUTCHours();
      var period = 'AM';
      if (is12HourFormat) {
        if (hour >= 12) period = 'PM';
        if (hour === 0) hour = 12;
        else if (hour != 12) hour = hour % 12;
        this.widget.find(
          '.timepicker [data-action=togglePeriod]').text(period);
      }
      hour = padLeft(hour.toString(), 2, '0');
      var minute = padLeft(this._date.getUTCMinutes().toString(), 2, '0');
      var second = padLeft(this._date.getUTCSeconds().toString(), 2, '0');
      timeComponents.filter('[data-time-component=hours]').text(hour);
      timeComponents.filter('[data-time-component=minutes]').text(minute);
      timeComponents.filter('[data-time-component=seconds]').text(second);
    },

    click: function(e) {
      e.stopPropagation();
      e.preventDefault();
      this._unset = false;
      var target = $(e.target).closest('span, td, th');
      if (target.length === 1) {
        if (! target.is('.disabled')) {
          switch(target[0].nodeName.toLowerCase()) {
            case 'th':
              switch(target[0].className) {
                case 'switch':
                  this.showMode(1);
                  break;
                case 'prev':
                case 'next':
                  var vd = this.viewDate;
                  var navFnc = DPGlobal.modes[this.viewMode].navFnc;
                  var step = DPGlobal.modes[this.viewMode].navStep;
                  if (target[0].className === 'prev') step = step * -1;
                  vd['set' + navFnc](vd['get' + navFnc]() + step);
                  this.fillDate();
                  this.set();
                  break;
              }
              break;
            case 'span':
              if (target.is('.month')) {
                var month = target.parent().find('span').index(target);
                this.viewDate.setUTCMonth(month);
              } else {
                var year = parseInt(target.text(), 10) || 0;
                this.viewDate.setUTCFullYear(year);
              }
              if (this.viewMode !== 0) {
                this._date = UTCDate(
                  this.viewDate.getUTCFullYear(),
                  this.viewDate.getUTCMonth(),
                  this.viewDate.getUTCDate(),
                  this._date.getUTCHours(),
                  this._date.getUTCMinutes(),
                  this._date.getUTCSeconds(),
                  this._date.getUTCMilliseconds()
                );
                this.notifyChange();
              }
              if(this.minViewMode === this.viewMode && !this.pickTime){
                this.hide();
              }
              this.showMode(-1);
              this.fillDate();
              this.set();
              // 
              break;
            case 'td':
              if (target.is('.day')) {
                var day = parseInt(target.text(), 10) || 1;
                var month = this.viewDate.getUTCMonth();
                var year = this.viewDate.getUTCFullYear();
                if (target.is('.old')) {
                  if (month === 0) {
                    month = 11;
                    year -= 1;
                  } else {
                    month -= 1;
                  }
                } else if (target.is('.new')) {
                  if (month == 11) {
                    month = 0;
                    year += 1;
                  } else {
                    month += 1;
                  }
                }
                this._date = UTCDate(
                  year, month, day,
                  this._date.getUTCHours(),
                  this._date.getUTCMinutes(),
                  this._date.getUTCSeconds(),
                  this._date.getUTCMilliseconds()
                );
                this.viewDate = UTCDate(
                  year, month, Math.min(28, day) , 0, 0, 0, 0);
                if(!this.range) {
                  this.fillDate();
                  this.set();
                  this.notifyChange();
                  // 只选择日期时，选完后自动关闭
                  if(!this.pickTime) {
                    this.hide();
                  } else {
                    $(".accordion-toggle", this.widget).trigger("click.togglePicker");
                  }
                // date range select
                } else {
                  if(!this._rangestart) {
                    this._lastDate = null;
                    this.fillDate();
                    this._lastDate = UTCDate(
                      this._date.getUTCFullYear(),
                      this._date.getUTCMonth(),
                      this._date.getUTCDate(),
                      0, 0, 0, 0
                    );
                    this._rangestart = true;
                  } else {
                    this.fillDate();
                    this.set(); 
                    this.notifyChange();
                    this._rangestart = false;
                  }

                }
              }
              break;
          }
        }
      }
    },

    actions: {
      incrementHours: function(e) {
        this._date.setUTCHours(this._date.getUTCHours() + 1);
      },

      incrementMinutes: function(e) {
        this._date.setUTCMinutes(this._date.getUTCMinutes() + 1);
      },

      incrementSeconds: function(e) {
        this._date.setUTCSeconds(this._date.getUTCSeconds() + 1);
      },

      decrementHours: function(e) {
        this._date.setUTCHours(this._date.getUTCHours() - 1);
      },

      decrementMinutes: function(e) {
        this._date.setUTCMinutes(this._date.getUTCMinutes() - 1);
      },

      decrementSeconds: function(e) {
        this._date.setUTCSeconds(this._date.getUTCSeconds() - 1);
      },

      togglePeriod: function(e) {
        var hour = this._date.getUTCHours();
        if (hour >= 12) hour -= 12;
        else hour += 12;
        this._date.setUTCHours(hour);
      },

      showPicker: function() {
        this.widget.find('.timepicker > div:not(.timepicker-picker)').hide();
        this.widget.find('.timepicker .timepicker-picker').show();
      },

      showHours: function() {
        this.widget.find('.timepicker .timepicker-picker').hide();
        this.widget.find('.timepicker .timepicker-hours').show();
      },

      showMinutes: function() {
        this.widget.find('.timepicker .timepicker-picker').hide();
        this.widget.find('.timepicker .timepicker-minutes').show();
      },

      showSeconds: function() {
        this.widget.find('.timepicker .timepicker-picker').hide();
        this.widget.find('.timepicker .timepicker-seconds').show();
      },

      selectHour: function(e) {
        var tgt = $(e.target);
        var value = parseInt(tgt.text(), 10);
        if (this.options.pick12HourFormat) {
          var current = this._date.getUTCHours();
          if (current >= 12) {
            if (value != 12) value = (value + 12) % 24;
          } else {
            if (value === 12) value = 0;
            else value = value % 12;
          }
        }
        this._date.setUTCHours(value);
        this.actions.showPicker.call(this);
      },

      selectMinute: function(e) {
        var tgt = $(e.target);
        var value = parseInt(tgt.text(), 10);
        this._date.setUTCMinutes(value);
        this.actions.showPicker.call(this);
      },

      selectSecond: function(e) {
        var tgt = $(e.target);
        var value = parseInt(tgt.text(), 10);
        this._date.setUTCSeconds(value);
        this.actions.showPicker.call(this);
      },

      saveTime: function(e){
        this.hide();
      }
    },

    doAction: function(e) {
      e.stopPropagation();
      e.preventDefault();
      if (!this._date) this._date = UTCDate(1970, 0, 0, 0, 0, 0, 0);
      var action = $(e.currentTarget).data('action');
      var rv = this.actions[action].apply(this, arguments);
      this.set();
      this.fillTime();
      this.notifyChange();
      return rv;
    },

    stopEvent: function(e) {
      e.stopPropagation();
      e.preventDefault();
    },

    // part of the following code was taken from
    // http://cloud.github.com/downloads/digitalBush/jquery.maskedinput/jquery.maskedinput-1.3.js
    keydown: function(e) {
      var self = this, k = e.which, input = $(e.target);
      if (k == 8 || k == 46) {
        // backspace and delete cause the maskPosition
        // to be recalculated
        setTimeout(function() {
          self._resetMaskPos(input);
        });
      }
    },

    keypress: function(e) {
      var k = e.which;
      if (k == 8 || k == 46) {
        // For those browsers which will trigger
        // keypress on backspace/delete
        return;
      }
      var input = $(e.target);
      var c = String.fromCharCode(k);
      var val = input.val() || '';
      val += c;
      var mask = this._mask[this._maskPos];
      if (!mask) {
        return false;
      }
      if (mask.end != val.length) {
        return;
      }
      if (!mask.pattern.test(val.slice(mask.start))) {
        val = val.slice(0, val.length - 1);
        while ((mask = this._mask[this._maskPos]) && mask.character) {
          val += mask.character;
          // advance mask position past static
          // part
          this._maskPos++;
        }
        val += c;
        if (mask.end != val.length) {
          input.val(val);
          return false;
        } else {
          if (!mask.pattern.test(val.slice(mask.start))) {
            input.val(val.slice(0, mask.start));
            return false;
          } else {
            input.val(val);
            this._maskPos++;
            return false;
          }
        }
      } else {
        this._maskPos++;
      }
    },

    change: function(e) {
      var input = $(e.target);
      var pattern = this.range ? this._formatRangePattern : this._formatPattern;
      var val = input.val();
      if (pattern.test(val)) {
        this.update();
        this.range ? this.setValue(val) : this.setValue(this._date.getTime());
        this.notifyChange();
        this.set();
      } else if (val && val.trim()) {
        this.range ? this.setValue(val) : this.setValue(this._date.getTime());
        if (this._date) this.set();
        else input.val('');
      } else {
        if (this._date) {
          this.setValue(null);
          // unset the date when the input is
          // erased
          this.notifyChange();
          this._unset = true;
        }
      }
      this._resetMaskPos(input);
    },

    showMode: function(dir) {
      if (dir) {
        this.viewMode = Math.max(this.minViewMode, Math.min(
          2, this.viewMode + dir));
      }
      this.widget.find('.datepicker > div').hide().filter(
        '.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
    },

    destroy: function() {
      this._detachDatePickerEvents();
      this._detachDatePickerGlobalEvents();
      this.widget.remove();
      this.$element.removeData('datetimepicker');
      if(this.component && this.component.length) {
        this.component.removeData('datetimepicker');
      }
    },

    formatDate: function(d) {
      return this.format.replace(formatReplacer, function(match) {
        var methodName, property, rv, len = match.length;
        if (match === 'ms')
          len = 1;
        property = dateFormatComponents[match].property
        if (property === 'Hours12') {
          rv = d.getUTCHours();
          if (rv === 0) rv = 12;
          else if (rv !== 12) rv = rv % 12;
        } else if (property === 'Period12') {
          if (d.getUTCHours() >= 12) return 'PM';
          else return 'AM';
	} else if (property === 'UTCYear') {
          rv = d.getUTCFullYear();
          rv = rv.toString().substr(2);   
        } else {
          methodName = 'get' + property;
          rv = d[methodName]();
        }
        if (methodName === 'getUTCMonth') rv = rv + 1;
        return padLeft(rv.toString(), len, '0');
      });
    },

    parseDate: function(str) {
      var match, i, property, methodName, value, parsed = {};
      if (!(match = this._formatPattern.exec(str)))
        return null;
      for (i = 1; i < match.length; i++) {
        property = this._propertiesByIndex[i];
        if (!property)
          continue;
        value = match[i];
        if (/^\d+$/.test(value))
          value = parseInt(value, 10);
        parsed[property] = value;
      }
      return this._finishParsingDate(parsed);
    },

    _resetMaskPos: function(input) {
      var val = input.val();
      for (var i = 0; i < this._mask.length; i++) {
        if (this._mask[i].end > val.length) {
          // If the mask has ended then jump to
          // the next
          this._maskPos = i;
          break;
        } else if (this._mask[i].end === val.length) {
          this._maskPos = i + 1;
          break;
        }
      }
    },

    _finishParsingDate: function(parsed) {
      var year, month, date, hours, minutes, seconds, milliseconds;
      year = parsed.UTCFullYear;
      if (parsed.UTCYear) year = 2000 + parsed.UTCYear;
      if (!year) year = 1970;
      if (parsed.UTCMonth) month = parsed.UTCMonth - 1;
      else month = 0;
      date = parsed.UTCDate || 1;
      hours = parsed.UTCHours || 0;
      minutes = parsed.UTCMinutes || 0;
      seconds = parsed.UTCSeconds || 0;
      milliseconds = parsed.UTCMilliseconds || 0;
      if (parsed.Hours12) {
        hours = parsed.Hours12;
      }
      if (parsed.Period12) {
        if (/pm/i.test(parsed.Period12)) {
          if (hours != 12) hours = (hours + 12) % 24;
        } else {
          hours = hours % 12;
        }
      }
      return UTCDate(year, month, date, hours, minutes, seconds, milliseconds);
    },

    _compileFormat: function () {
      var match, component, components = [], mask = [],
      str = this.format, propertiesByIndex = {}, i = 0, pos = 0;
      while (match = formatComponent.exec(str)) {
        component = match[0];
        if (component in dateFormatComponents) {
          i++;
          propertiesByIndex[i] = dateFormatComponents[component].property;
          components.push('\\s*' + dateFormatComponents[component].getPattern(
            this) + '\\s*');
          mask.push({
            pattern: new RegExp(dateFormatComponents[component].getPattern(
              this)),
            property: dateFormatComponents[component].property,
            start: pos,
            end: pos += component.length
          });
        }
        else {
          components.push(escapeRegExp(component));
          mask.push({
            pattern: new RegExp(escapeRegExp(component)),
            character: component,
            start: pos,
            end: ++pos
          });
        }
        str = str.slice(component.length);
      }
      this._mask = mask;
      this._maskPos = 0;
      this._formatPattern = new RegExp(
        '^\\s*' + components.join('') + '\\s*$');
      this._formatRangePattern = new RegExp(
        '^\\s*' + components.join('') + " - " + components.join('') + '\\s*$')
      this._propertiesByIndex = propertiesByIndex;
    },

    _attachDatePickerEvents: function() {
      var self = this;
      // this handles date picker clicks
      this.widget.on('click', '.datepicker *', $.proxy(this.click, this));
      // this handles time picker clicks
      this.widget.on('click', '[data-action]', $.proxy(this.doAction, this));
      this.widget.on('mousedown', $.proxy(this.stopEvent, this));
      if (this.pickDate && this.pickTime) {
        this.widget.on('click.togglePicker', '.accordion-toggle', function(e) {
          e.stopPropagation();
          var $this = $(this);
          var $parent = $this.closest('ul');
          var expanded = $parent.find('.collapse.in');
          var closed = $parent.find('.collapse:not(.in)');

          if (expanded && expanded.length) {
            var collapseData = expanded.data('collapse');
            if (collapseData && collapseData.transitioning) return;
            expanded.collapse('hide');
            closed.collapse('show')


            $this.html(self.formatDate(self._date).split(" ")[+!!expanded.find(".timepicker").length])

            // $this.find('i').toggleClass(self.timeIcon + ' ' + self.dateIcon);
            // self.$element.find('.add-on i').toggleClass(self.timeIcon + ' ' + self.dateIcon);
          }
        });
      }


      if (this.isInput) {
        this.$element.on({
          'focus': $.proxy(this.show, this),
          'change': $.proxy(this.change, this)
        });
        if (this.options.maskInput) {
          this.$element.on({
            'keydown': $.proxy(this.keydown, this),
            'keypress': $.proxy(this.keypress, this)
          });
        }
      } else {
        this.$element.on({
          'change': $.proxy(this.change, this)
        }, 'input');
        if (this.options.maskInput) {
          this.$element.on({
            'keydown': $.proxy(this.keydown, this),
            'keypress': $.proxy(this.keypress, this)
          }, 'input');
        }
        if (this.component){
          this.component.on('click', $.proxy(this.show, this));
        } else {
          this.$element.on('click', $.proxy(this.show, this));
        }
      }
    },

    _attachDatePickerGlobalEvents: function() {
      $(window).on(
        'resize.datetimepicker' + this.id, $.proxy(this.place, this));
      if (!this.isInput) {
        $(document).on(
          'mousedown.datetimepicker' + this.id, $.proxy(this.hide, this));
      }
    },

    _detachDatePickerEvents: function() {
      this.widget.off('click', '.datepicker *', this.click);
      this.widget.off('click', '[data-action]');
      this.widget.off('mousedown', this.stopEvent);
      if (this.pickDate && this.pickTime) {
        this.widget.off('click.togglePicker');
      }
      if (this.isInput) {
        this.$element.off({
          'focus': this.show,
          'change': this.change
        });
        if (this.options.maskInput) {
          this.$element.off({
            'keydown': this.keydown,
            'keypress': this.keypress
          });
        }
      } else {
        this.$element.off({
          'change': this.change
        }, 'input');
        if (this.options.maskInput) {
          this.$element.off({
            'keydown': this.keydown,
            'keypress': this.keypress
          }, 'input');
        }
        if (this.component){
          this.component.off('click', this.show);
        } else {
          this.$element.off('click', this.show);
        }
      }
    },

    _detachDatePickerGlobalEvents: function () {
      $(window).off('resize.datetimepicker' + this.id);
      if (!this.isInput) {
        $(document).off('mousedown.datetimepicker' + this.id);
      }
    },

    _isInFixed: function() {
      if (this.$element) {
        var parents = this.$element.parents();
        var inFixed = false;
        for (var i=0; i<parents.length; i++) {
            if ($(parents[i]).css('position') == 'fixed') {
                inFixed = true;
                break;
            }
        };
        return inFixed;
      } else {
        return false;
      }
    }
  };

  $.fn.datetimepicker = function ( option, val ) {
    return this.each(function () {
      var $this = $(this),
      data = $this.data('datetimepicker'),
      options = typeof option === 'object' && option;
      if (!data) {
        $this.data('datetimepicker', (data = new DateTimePicker(
          this, $.extend({}, $.fn.datetimepicker.defaults,options))));
      }
      if (typeof option === 'string') data[option](val);
    });
  };

  $.fn.datetimepicker.defaults = {
    maskInput: false,
    pickDate: true,
    pickTime: true,
    pick12HourFormat: false,
    pickSeconds: true,
    startDate: -Infinity,
    endDate: Infinity,
    collapse: true
  };
  $.fn.datetimepicker.Constructor = DateTimePicker;
  var dpgId = 0;
  var dates = $.fn.datetimepicker.dates = {
    en: {
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday"],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      months: ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"],
      monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct", "Nov", "Dec"]
    }
  };

  var dateFormatComponents = {
    dd: {property: 'UTCDate', getPattern: function() { return '(0?[1-9]|[1-2][0-9]|3[0-1])\\b';}},
    mm: {property: 'UTCMonth', getPattern: function() {return '(0?[1-9]|1[0-2])\\b';}},
    yy: {property: 'UTCYear', getPattern: function() {return '(\\d{2})\\b'}},
    yyyy: {property: 'UTCFullYear', getPattern: function() {return '(\\d{4})\\b';}},
    hh: {property: 'UTCHours', getPattern: function() {return '(0?[0-9]|1[0-9]|2[0-3])\\b';}},
    ii: {property: 'UTCMinutes', getPattern: function() {return '(0?[0-9]|[1-5][0-9])\\b';}},
    ss: {property: 'UTCSeconds', getPattern: function() {return '(0?[0-9]|[1-5][0-9])\\b';}},
    ms: {property: 'UTCMilliseconds', getPattern: function() {return '([0-9]{1,3})\\b';}},
    HH: {property: 'Hours12', getPattern: function() {return '(0?[1-9]|1[0-2])\\b';}},
    PP: {property: 'Period12', getPattern: function() {return '(AM|PM|am|pm|Am|aM|Pm|pM)\\b';}}
  };

  var keys = [];
  for (var k in dateFormatComponents) keys.push(k);
  keys[keys.length - 1] += '\\b';
  keys.push('.');

  var formatComponent = new RegExp(keys.join('\\b|'));
  keys.pop();
  var formatReplacer = new RegExp(keys.join('\\b|'), 'g');

  function escapeRegExp(str) {
    // http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  function padLeft(s, l, c) {
    if (l < s.length) return s;
    else return Array(l - s.length + 1).join(c || ' ') + s;
  }

  function getTemplate(timeIcon, pickDate, pickTime, is12Hours, showSeconds, collapse, range) {
    // range = true; 
    if (pickDate && pickTime) {
      return (
        '<div class="bootstrap-datetimepicker-widget dropdown-menu">' +
          '<ul>' +
            '<li' + (collapse ? ' class="collapse in"' : '') + '>' +
              '<div class="datepicker">' +
                DPGlobal.template +
              '</div>' +
            '</li>' +
            '<li class="picker-switch accordion-toggle btn"><a><i class="' + timeIcon + '"></i></a></li>' +
            '<li' + (collapse ? ' class="collapse"' : '') + '>' +
              '<div class="timepicker">' +
                TPGlobal.getTemplate(is12Hours, showSeconds) +
              '</div>' +
              '<div class="picker-switch btn" data-action="saveTime">OK</div>' +
            '</li>' +
          '</ul>' +
        '</div>'
      );
    } else if (pickTime) {
      return (
        '<div class="bootstrap-datetimepicker-widget dropdown-menu">' +
          '<div class="timepicker">' +
            TPGlobal.getTemplate(is12Hours, showSeconds) +
          '</div>' +
          '<div class="picker-switch btn" data-action="saveTime">OK</div>' +
        '</div>'
      );
    } else {
      return (
        '<div class="bootstrap-datetimepicker-widget dropdown-menu">' +
          '<div class="datepicker">' +
            DPGlobal.template +
            // (range ? DPGlobal.rangeTemplate : DPGlobal.template) +
          '</div>' +
        '</div>'
      );
    }
  }

  function UTCDate() {
    return new Date(Date.UTC.apply(Date, arguments));
  }

  var DPGlobal = {
    modes: [
      {
      clsName: 'days',
      navFnc: 'UTCMonth',
      navStep: 1
    },
    {
      clsName: 'months',
      navFnc: 'UTCFullYear',
      navStep: 1
    },
    {
      clsName: 'years',
      navFnc: 'UTCFullYear',
      navStep: 10
    }],
    isLeapYear: function (year) {
      return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
    },
    getDaysInMonth: function (year, month) {
      return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
    },
    headTemplate:
      '<thead>' +
        '<tr>' +
          '<th class="prev"></th>' +
          '<th colspan="5" class="switch"></th>' +
          '<th class="next"></th>' +
        '</tr>' +
      '</thead>',

    contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
  };
  DPGlobal.template =
    '<div class="datepicker-days">' +
      '<table class="table-condensed">' +
        DPGlobal.headTemplate +
        '<tbody></tbody>' +
      '</table>' +
    '</div>' +
    '<div class="datepicker-months">' +
      '<table class="table-condensed">' +
        DPGlobal.headTemplate +
        DPGlobal.contTemplate+
      '</table>'+
    '</div>'+
    '<div class="datepicker-years">'+
      '<table class="table-condensed">'+
        DPGlobal.headTemplate+
        DPGlobal.contTemplate+
      '</table>'+
    '</div>';

  var TPGlobal = {
    hourTemplate: '<span data-action="showHours" data-time-component="hours" class="timepicker-hour btn"></span>',
    minuteTemplate: '<span data-action="showMinutes" data-time-component="minutes" class="timepicker-minute btn"></span>',
    secondTemplate: '<span data-action="showSeconds" data-time-component="seconds" class="timepicker-second btn"></span>'
  };
  TPGlobal.getTemplate = function(is12Hours, showSeconds) {
    return (
    '<div class="timepicker-picker">' +
      '<table class="table-condensed"' +
        (is12Hours ? ' data-hour-format="12"' : '') +
        '>' +
        '<tr>' +
          '<td><a href="#" class="timepicker-up" data-action="incrementHours"></a></td>' +
          '<td class="separator"></td>' +
          '<td><a href="#" class="timepicker-up" data-action="incrementMinutes"></a></td>' +
          (showSeconds ?
          '<td class="separator"></td>' +
          '<td><a href="#" class="timepicker-up" data-action="incrementSeconds"></a></td>': '')+
          (is12Hours ? '<td class="separator"></td>' : '') +
        '</tr>' +
        '<tr>' +
          '<td>' + TPGlobal.hourTemplate + '</td> ' +
          '<td class="separator">:</td>' +
          '<td>' + TPGlobal.minuteTemplate + '</td> ' +
          (showSeconds ?
          '<td class="separator">:</td>' +
          '<td>' + TPGlobal.secondTemplate + '</td>' : '') +
          (is12Hours ?
          '<td class="separator"></td>' +
          '<td>' +
          '<button type="button" class="btn btn-primary" data-action="togglePeriod"></button>' +
          '</td>' : '') +
        '</tr>' +
        '<tr>' +
          '<td><a href="#" class="timepicker-down" data-action="decrementHours"></a></td>' +
          '<td class="separator"></td>' +
          '<td><a href="#" class="timepicker-down" data-action="decrementMinutes"></a></td>' +
          (showSeconds ?
          '<td class="separator"></td>' +
          '<td><a href="#" class="timepicker-down" data-action="decrementSeconds"></a></td>': '') +
          (is12Hours ? '<td class="separator"></td>' : '') +
        '</tr>' +
      '</table>' +
    '</div>' +
    '<div class="timepicker-hours" data-action="selectHour">' +
      '<table class="table-condensed">' +
      '</table>'+
    '</div>'+
    '<div class="timepicker-minutes" data-action="selectMinute">' +
      '<table class="table-condensed">' +
      '</table>'+
    '</div>'+
    (showSeconds ?
    '<div class="timepicker-seconds" data-action="selectSecond">' +
      '<table class="table-condensed">' +
      '</table>'+
    '</div>': '')
    );
  }


})(window.jQuery)

$.fn.datetimepicker.dates['zh-CN'] = {
		days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
		daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
		daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
		months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		monthsShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
		// monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		today: "今日",
		selectMonth: "选择月份",
		selectYear: "选择年份"
};
$.fn.datepicker = function(options){
	var opt = {},
		argu = arguments;
	if(typeof options !== "string") {
		opt = $.extend({
			language: "zh-CN",
			format: "yyyy-mm-dd",
			orientation: "left",
			pickTime: false,
			autoNext: true
		}, options);
	}

	return this.each(function(){
		var $elem = $(this),
			$cp,
			$tecp,
			$targetElem;

		if(!$elem.data("datetimepicker")) {
			$cp = $elem.find(".datepicker-btn");

			$elem.datetimepicker($.extend({
				component: $cp.length ? $cp : false
			}, opt));
			
			$targetElem = Dom.getElem(opt.target, true);
	
			// 当 target jquery对象存在时，创建日期范围组，即会对可选范围做动态限制
			if($targetElem && $targetElem.length) {
				$tecp = $targetElem.find(".datepicker-btn");
				$targetElem.datetimepicker($.extend({
					// 初始化可选时间范围
					startDate: new Date($elem.find(">input").val()),
					component: $tecp.length ? $tecp : false
				}, opt));

				$elem.datetimepicker("setEndDate", $targetElem.data("datetimepicker").getDate());
				$targetElem.datetimepicker("setStartDate", $elem.data("datetimepicker").getDate());

				// 时间变更时，改变可选时间范围
				$elem.on("changeDate", function(evt){				
					$targetElem.datetimepicker("setStartDate", evt.date);
				});

				$targetElem.on("changeDate", function(evt){				
					$elem.datetimepicker("setEndDate", evt.date);
				});

				// 选择完开始日期后，自动打开结束日期选择器
				if(opt.autoNext){
					var initDate;
					$elem.on("show", function(evt){
						initDate = $(this).data("date");
					})
					$elem.on("hide", function(evt){
						if($(this).data("date") !== initDate){
							$targetElem.datetimepicker("show");
						}
					})
				}
			}
		}
			 
		if(typeof options === "string") {
			$.fn.datetimepicker.apply($(this), argu)
		}
	})
}
/**
 * 基于jquery.select2扩展的select插件，基本使用请参考select2相关文档
 * 默认是多选模式，并提供了input模式下的初始化方法，对应的数据格式是{ id: 1, text: "Hello" } 
 * 这里的参数只对扩展的部分作介绍 
 * filter、includes、excludes、query四个参数是互斥的，理论只能有其一个参数
 * @method ibosSelect
 * @param option.filter
 * @param {Function} option.filter   用于过滤源数据的函数
 * @param {Array} 	 option.includes 用于过滤源数据的数据，有效数据的id组
 * @param {Array} 	 option.excludes 用于过滤源数据的数据，无效数据的id组
 * @param {Boolean}  option.pinyin   启用拼音搜索，需要pinyinEngine组件	
 * @return {jQuery} 
 */
$.fn.ibosSelect = (function(){
	var _process = function(datum, collection, filter){
		var group, attr;
		datum = datum[0];
		if (datum.children) {
			group = {};
			for (attr in datum) {
				if (datum.hasOwnProperty(attr)) group[attr] = datum[attr];
			}
			group.children = [];
			$(datum.children).each2(function(i, childDatum) {
				_process(childDatum, group.children, filter);
			});
			if (group.children.length) {
				collection.push(group);
			}
		} else {
			if(filter && !filter(datum)) {
				return false;
			}
			collection.push(datum);				
		}
	}
	// 使用带有filter过滤源数据的query函数，其实质就是在query函数执行之前，用filter函数先过滤一次数据
	var _queryWithFilter = function(query, filter){
		var t = query.term, filtered = { results: [] }, data = [];

		$(this.data).each2(function(i, datum) {
			_process(datum, data, filter);
		});

		if (t === "") {
			query.callback({ results: data });
			return;
		}

		$(data).each2(function(i, datum) {
			_process(datum, filtered.results, function(d){
				return query.matcher(t, d.text + "");
			})
		});

		query.callback(filtered);
	}
	// 根据ID从data数组中获取对应的文本， 主要用于val设置
	var _getTextById = function(id, data){
		// debugger;
		var ret;
		for(var i = 0; i < data.length; i++){
			if(data[i].children){
				ret = _getTextById(id, data[i].children);
				if(typeof ret !== "undefined"){
					break;
				}
			} else {
				if(data[i].id + "" === id) {
					ret = data[i].text;
					break;
				}
			}
		}
		return ret;
	}

	var defaults = {
		multiple: true,
		pinyin: true,
		formatResultCssClass: function(data){
			return data.cls;
		},
		formatNoMatches: function(){ return U.lang("S2.NO_MATCHES"); },
		formatSelectionTooBig: function (limit) { return U.lang("S2.SELECTION_TO_BIG", { count: limit}); },
        formatSearching: function () { return U.lang("S2.SEARCHING"); },
        formatInputTooShort: function (input, min) { return U.lang("S2.INPUT_TO_SHORT", { count: min - input.length}); },
        formatLoadMore: function (pageNumber) { return U.lang("S2.LOADING_MORE"); },

		initSelection: function(elem, callback){
			var ins = elem.data("select2"),
				data = ins.opts.data,
				results;

			if(ins.opts.multiple) {
				results = [];
				$.each(elem.val().split(','), function(index, val){
		            results.push({id: val, text: _getTextById(val, data)});
				})
			} else {
				results = {
					id: elem.val(),
					text: _getTextById(elem.val(), data)
				}
			}

	        callback(results);
		}
	}
	var select2 = function(option){
		if(typeof option !== "string") {
			option = $.extend({}, defaults, option);

			// 注意: filter | query | includes | excludes 四个属性是互斥的
			// filter基于query, 而includes、excludes基于filter
			// 优先度 includes > excludes > filter > query
			
			// includes是一个数组，指定源数据中有效数据的ID值，将过滤ID不在此数组中的数据
			if(option.includes && $.isArray(option.includes)){

				option.filter = function(datum){
					return $.inArray(datum.id, option.includes) !== -1;
				}

			// includes是一个数组，指定源数据中无效数据的ID值，将过滤ID在此数组中的数据
			} else if(option.excludes && $.isArray(option.excludes)) {

				option.filter = function(datum){
					return $.inArray(datum.id, option.excludes) === -1;
				}

			}

			// 当有filter属性时，将使用自定义的query方法替代原来的query方法，filter用于从源数据层面上过滤不需要出现的数据
			if(option.filter){
				option.query = function(query) {
					_queryWithFilter(query, option.filter);
				}
			}
			// 使用pinyin搜索引擎
			if(option.pinyin) {
				var _customMatcher = option.matcher;
				option.matcher = function(term){
					if(term === ""){
						return true;
					}
					return Ibos.matchSpell.apply(this, arguments) && 
					(_customMatcher ? _customMatcher.apply(this, arguments) : true);
				}
			}
			
			// 使用 select 元素时，要去掉一部分默认项
			if($(this).is("select")) {
				delete option.multiple;
				delete option.initSelection;
			}
			return $.fn.select2.call(this, option)
		}

		return $.fn.select2.apply(this, arguments)
	}

	return select2;
})();
/**
 * 滑动条，在JqueryUi的滑动条的基础上，添加了可配置的tip提示及简易标尺
 * 具体使用可参考JqUi
 * 需要JqueryUi的slider及Bootstrap的tooltip;
 * 为嘛不使用jqueryUi的tooltip....　
 * @method ibosSlider
 * @todo 由于jqueryUi的插件支持重初始化，此处需考虑重初始化的情况
 *       
 * @param {Object|String} [option] 配置|调用方法，调用方法时第二个参数开始为该方法的参数
 *     @param {Boolean}       [option.tip]  启用提示
 *     @param {Boolean}       [option.scale]  启用标尺
 *     @param {Jquery|Eelement|Selector}        [option.target] 用于放置值的input
 * @param {Function}      [option.tipFormat]  tip文本的格式化函数，传入当前值，要求返回字符串，默认添加"%"
 * @return {Jquery}       Jq对象
 */
$.fn.ibosSlider = function(option){
	// 获取格式化后的tip
	var _getTip = function(value){
		if(!option.tipFormat || typeof option.tipFormat !== "function") {
			return value;
		} else {
			return option.tipFormat.call(null, value);
		}
	}
	var $target,
		defaultValues;

	if(typeof option === "object"){

		if(option.target) {
			$target = option.target === "next" ? this.next() : $(option.target);
			defaultValues = $target.val();
	
			if(!option.value && !option.values && defaultValues) {
				if(option.range === true) {
					option.values = defaultValues.split(",")
				} else {
					option.value = defaultValues;
				}
			}
			if($target && $target.length) {
				this.on("slidechange", function(evt, data){
					$target.val(option.range === true ? data.values.join(",") : data.value);
				})
			}
		}

		// 判断是否存在tooltip方法
		if(option.tip && $.fn.tooltip) {
			// 默认的tipFormat
			option.tipFormat = option.tipFormat || function(value){
				return value + "%";
			}
			// 创建滑动条时，初始化tooltip
			$(this).on("slidecreate", function(){
				var instance = $.data(this, "uiSlider"),
					opt = $(this).slider("option");

				if(option.range === true) {
					instance.handles.each(function(index, h){
						$(h).tooltip({ title: _getTip(opt.values[index]), animation: false });
					})
				} else {
					instance.handle.tooltip({ title: _getTip(opt.value), animation: false })
				}
			// 滑动时，改变tooltip的title值
			}).on("slide", function(evt, data){
				$.attr(data.handle, "data-original-title", _getTip(data.value));
				$(data.handle).tooltip("show");
			})
			.on("slidechange", function(evt, data){
				$.attr(data.handle, "data-original-title", _getTip(data.value));
			})
		}

		if(option.scale) {
			option.scale = +option.scale;
			$(this).on("slidecreate", function(){
				var $elem = $(this),
					option = $elem.slider("option");

				var $wrap = $('<div class="ui-slider-scale"></div>');
				var scaleStep = (option.max - option.min)/ option.scale;
				
				for(var i = 0; i < option.scale + 1; i++) {
					$wrap.append('<span class="ui-slider-scale-step" style="left: ' + 100/option.scale * i + '%">' + (i * scaleStep + option.min) + '</span>');
				}

				$elem.append($wrap).addClass("ui-slider-hasscale");
			})
		}
	}

	return this.slider.apply(this, arguments);
};
/**
 * jGrowl 1.1.1
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Written by Stan Lemon <stanlemon@mac.com>
 * Last updated: 2008.08.17
 *
 * jGrowl is a jQuery plugin implementing unobtrusive userland notifications.  These 
 * notifications function similarly to the Growl Framework available for
 * Mac OS X (http://growl.info).
 *
 * To Do:
 * - Move library settings to containers and allow them to be changed per container
 *
 * Changes in 1.1.1
 * - Fixed CSS styling bug for ie6 caused by a mispelling
 * - Changes height restriction on default notifications to min-height
 * - Added skinned examples using a variety of images
 * - Added the ability to customize the content of the [close all] box
 * - Added jTweet, an example of using jGrowl + Twitter
 *
 * Changes in 1.1.0
 * - Multiple container and instances.
 * - Standard $.jGrowl() now wraps $.fn.jGrowl() by first establishing a generic jGrowl container.
 * - Instance methods of a jGrowl container can be called by $.fn.jGrowl(methodName)
 * - Added glue preferenced, which allows notifications to be inserted before or after nodes in the container
 * - Added new log callback which is called before anything is done for the notification
 * - Corner's attribute are now applied on an individual notification basis.
 *
 * Changes in 1.0.4
 * - Various CSS fixes so that jGrowl renders correctly in IE6.
 *
 * Changes in 1.0.3
 * - Fixed bug with options persisting across notifications
 * - Fixed theme application bug
 * - Simplified some selectors and manipulations.
 * - Added beforeOpen and beforeClose callbacks
 * - Reorganized some lines of code to be more readable
 * - Removed unnecessary this.defaults context
 * - If corners plugin is present, it's now customizable.
 * - Customizable open animation.
 * - Customizable close animation.
 * - Customizable animation easing.
 * - Added customizable positioning (top-left, top-right, bottom-left, bottom-right, center)
 *
 * Changes in 1.0.2
 * - All CSS styling is now external.
 * - Added a theme parameter which specifies a secondary class for styling, such
 *   that notifications can be customized in appearance on a per message basis.
 * - Notification life span is now customizable on a per message basis.
 * - Added the ability to disable the global closer, enabled by default.
 * - Added callbacks for when a notification is opened or closed.
 * - Added callback for the global closer.
 * - Customizable animation speed.
 * - jGrowl now set itself up and tears itself down.
 *
 * Changes in 1.0.1:
 * - Removed dependency on metadata plugin in favor of .data()
 * - Namespaced all events
 */
(function($) {

  /** jGrowl Wrapper - Establish a base jGrowl Container for compatibility with older releases. **/
  $.jGrowl = function( m , o ) {
    // To maintain compatibility with older version that only supported one instance we'll create the base container.
    if ( $('#jGrowl').size() == 0 ) $('<div id="jGrowl"></div>').addClass((o && o.position) ? o.position : $.jGrowl.defaults.position).appendTo('body');
    // Create a notification on the container.
    $('#jGrowl').jGrowl(m,o);
  };


  /** Raise jGrowl Notification on a jGrowl Container **/
  $.fn.jGrowl = function( m , o ) {
    if ( $.isFunction(this.each) ) {
      var args = arguments;

      return this.each(function() {
        var self = this;

        /** Create a jGrowl Instance on the Container if it does not exist **/
        if ( $(this).data('jGrowl.instance') == undefined ) {
          $(this).data('jGrowl.instance', new $.fn.jGrowl());
          $(this).data('jGrowl.instance').startup( this );
        }

        /** Optionally call jGrowl instance methods, or just raise a normal notification **/
        if ( $.isFunction($(this).data('jGrowl.instance')[m]) ) {
          $(this).data('jGrowl.instance')[m].apply( $(this).data('jGrowl.instance') , $.makeArray(args).slice(1) );
        } else {
          $(this).data('jGrowl.instance').notification( m , o );
        }
      });
    };
  };

  $.extend( $.fn.jGrowl.prototype , {

    /** Default JGrowl Settings **/
    defaults: {
      header:     '',
      single:         true,
      sticky:     false,
      position:     'center', // Is this still needed?
      glue:       'after',
      theme:      'default',
      corners:    '10px',
      check:      500,
      life:       3000,
      speed:      'normal',
      easing:     'swing',
      closer:     true,
      closerTemplate: '<div>[ 关闭全部 ]</div>',
      log:      function(e,m,o) {},
      beforeOpen:   function(e,m,o) {},
      open:       function(e,m,o) {},
      beforeClose:  function(e,m,o) {},
      close:      function(e,m,o) {},
      animateOpen:  {
        opacity:  'show'
      },
      animateClose:   {
        opacity:  'hide'
      }
    },
    
    /** jGrowl Container Node **/
    element:  null,
  
    /** Interval Function **/
    interval:   null,
    
    /** Create a Notification **/
    notification:   function( message , o ) {
      var self = this;
      var o = $.extend({}, this.defaults, o);

      o.log.apply( this.element , [this.element,message,o] );

      if (o.single){
        $('div.jGrowl-notification').children('div.close').trigger("click.jGrowl");
      }

      var notification = $('<div class="jGrowl-notification"><div class="close">&times;</div><div class="j-header">' + o.header + '</div><div class="message">' + message + '</div></div>')
        .data("jGrowl", o).addClass(o.theme).children('div.close').bind("click.jGrowl", function() {
          if(o.single){
            $(this).unbind('click.jGrowl').parent().trigger('jGrowl.beforeClose').trigger('jGrowl.close').remove();
          }else{
            $(this).unbind('click.jGrowl').parent().trigger('jGrowl.beforeClose').animate(o.animateClose, o.speed, o.easing, function() {
              $(this).trigger('jGrowl.close').remove();
            });
          }
        }).parent();
      
      ( o.glue == 'after' ) ? $('div.jGrowl-notification:last', this.element).after(notification) : $('div.jGrowl-notification:first', this.element).before(notification);

      /** Notification Actions **/
      $(notification).bind("mouseover.jGrowl", function() {
        $(this).data("jGrowl").pause = true;
      }).bind("mouseout.jGrowl", function() {
        $(this).data("jGrowl").pause = false;
      }).bind('jGrowl.beforeOpen', function() {
        o.beforeOpen.apply( self.element , [self.element,message,o] );
      }).bind('jGrowl.open', function() {
        o.open.apply( self.element , [self.element,message,o] );
      }).bind('jGrowl.beforeClose', function() {
        o.beforeClose.apply( self.element , [self.element,message,o] );
      }).bind('jGrowl.close', function() {
        o.close.apply( self.element , [self.element,message,o] );
      }).trigger('jGrowl.beforeOpen').animate(o.animateOpen, o.speed, o.easing, function() {
        $(this).data("jGrowl") && ($(this).data("jGrowl").created = new Date());
      }).trigger('jGrowl.open');
    
      /** Optional Corners Plugin **/
      if ( $.fn.corner != undefined ) $(notification).corner( o.corners );

      /** Add a Global Closer if more than one notification exists **/
      if ( !o.single && $('div.jGrowl-notification:parent', this.element).size() > 1 && $('div.jGrowl-closer', this.element).size() == 0 && this.defaults.closer != false ) {
        $(this.defaults.closerTemplate).addClass('jGrowl-closer').addClass(this.defaults.theme).appendTo(this.element).animate(this.defaults.animateOpen, this.defaults.speed, this.defaults.easing).bind("click.jGrowl", function() {
          $(this).siblings().children('div.close').trigger("click.jGrowl");

          if ( $.isFunction( self.defaults.closer ) ) self.defaults.closer.apply( $(this).parent()[0] , [$(this).parent()[0]] );
        });
      };
    },

    /** Update the jGrowl Container, removing old jGrowl notifications **/
    update:  function() {
      $(this.element).find('div.jGrowl-notification:parent').each( function() {
        if ( $(this).data("jGrowl") != undefined && $(this).data("jGrowl").created != undefined && ($(this).data("jGrowl").created.getTime() + $(this).data("jGrowl").life)  < (new Date()).getTime() && $(this).data("jGrowl").sticky != true && 
           ($(this).data("jGrowl").pause == undefined || $(this).data("jGrowl").pause != true) ) {
          $(this).children('div.close').trigger('click.jGrowl');
        }
      });

      if ( $(this.element).find('div.jGrowl-notification:parent').size() < 2 ) {
        $(this.element).find('div.jGrowl-closer').animate(this.defaults.animateClose, this.defaults.speed, this.defaults.easing, function() {
          $(this).remove();
        });
      };
    },

    /** Setup the jGrowl Notification Container **/
    startup:  function(e) {
      this.element = $(e).addClass('jGrowl').append('<div class="jGrowl-notification"></div>');
      this.interval = setInterval( function() { jQuery(e).data('jGrowl.instance').update(); }, this.defaults.check);
      
      if ($.browser.msie && parseInt($.browser.version) < 7) $(this.element).addClass('ie6');
    },

    /** Shutdown jGrowl, removing it and clearing the interval **/
    shutdown:   function() {
      $(this.element).removeClass('jGrowl').find('div.jGrowl-notification').remove();
      $(this).data('jGrowl.instance', null);
      clearInterval( this.interval );
    }
  });
  
  /** Reference the Defaults Object for compatibility with older versions of jGrowl **/
  $.jGrowl.defaults = $.fn.jGrowl.prototype.defaults;

})(jQuery);
/* checkbox radio初始化 */
(function(window, $) {
	/**
	 * checkbox和radio的美化
	 * @class  Label
	 * @param  {Jquery} $el 目标元素
	 * @return {Object}     Label实例
	 */
	var Label = function($el) {
		var type = $el.attr("type");
		if(!type || (type !== "radio" && type !== "checkbox")) {
			throw new Error('初始化类型必须为"checkbox"或"radio"');
		}
		this.$el = $el;
		this.type = type;
		this.name = $el.attr("name");
		Label.items.push(this);
		this._initLabel();
		this._bindEvent();
	}
	/**
	 * 已初始化项的集合
	 * @type {Array}
	 */
	Label.items = [];
	Label.get = function(filter){
		var ret = [];
		for(var i = 0; i < this.items.lenght; i++) {
			if(filter && filter.call(this, this.items[i])) {
				ret.push(this.items[i]);
			}
		}
		return ret;
	}

	Label.prototype = {
		constructor: Label,
		/**
		 * 初始化checkbox和radio的容器
		 * @method _initLabel
		 * @private 
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		_initLabel: function() {
			var type = this.type,
				//向上查找css类名和type相同的节点
				$label = this.$el.parents('label.' + type).first();
			//如果不存在目标或该目标元素类型不为'label', 则创建;
			if(!$label.length){
				$label = $('<label>').addClass(type);
				$label.append(this.$el);
			}
			//加入作为样式表现的html
			$label.prepend('<span class="icon"></span><span class="icon-to-fade"></span>');
			this.$label = $label;
			this.refresh();
			return this;
		},
		_refresh: function(){
			this.$el.is(':checked') ? this.$label.addClass('checked') : this.$label.removeClass('checked');
			this.$el.is(':disabled') ? this.$label.addClass('disabled') : this.$label.removeClass('disabled');
		},

		refresh: function(){
			if(this.type === "radio") {
				var items = this.constructor.items;
				for(var i = 0, len = items.length; i < len; i++) {
					if(items[i].name === this.name && items[i].type === this.type) {
						items[i]._refresh();
					}
				}
			} else {
				this._refresh();
			}
		},

		/**
		 * 事件绑定
		 * @method _bindEvent
		 * @private
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		_bindEvent: function(){
			var that = this;
			this.$el.on('change', function(){
				that.refresh();
			})
		},
		check: function(){
			this.$el.prop('checked', true);
			this.refresh()
		},
		uncheck: function(){
			this.$el.prop('checked', false);
			this.refresh()
		},
		disable: function(){
			this.$el.prop('disabled', true);
			this.$label.addClass('disabled');
		},
		enable: function(){
			this.$el.prop('disabled', false);
			this.$label.removeClass('disabled');
		},
		toggle: function(){
			if(this.$el.prop('checked')) {
				this.uncheck();
			} else {
				this.check();
			}
		},
		toggleDisabled: function(){
			if(this.$el.prop('disabled')) {
				this.enable();
			} else {
				this.disable();
			}
		}
	}

	$.fn.label = function(option){
		var data;
		return this.each(function(){
			data = $(this).data('label');
			if(!data){
				$(this).data('label', data = new Label($(this)));
			}
			if(typeof option === 'string'){
				data[option].call(data);
			}
		})
	}
	$.fn.label.Constructor = Label;

	$(function(){
		$('.checkbox input, .radio input').label();
	})
})(window, window.jQuery);
/* 拼音搜索引擎 */
(function(window){
	var pinyinEngine = window.pinyinEngine = {};
	/**
	 * 支持多音字的汉字转拼音算法
	 * @version	2011-07-22
	 * @see		https://github.com/hotoo/pinyin.js
	 * @author	闲耘, 唐斌
	 * @param	{String}		要转为拼音的目标字符串（汉字）
	 * @param	{Boolean}		是否仅保留匹配的第一个拼音
	 * @param	{String}		返回结果的分隔符，默认返回数组集合
	 * @return	{String, Array} 如果 sp 为 null，则返回 Array
	 *							否则，返回以 sp 分隔的字符串
	 */
	pinyinEngine.toPinyin = function () {
		
		// 笛卡尔乘积，返回两个数组的所有可能的组合
		function product (a, b, sp) {
			var r = [], val, str = [];
			for (var i = 0, l = a.length; i < l; i ++) {
				for (var j = 0, m = b.length; j < m; j ++) {
					val = r[r.length] = (a[i] instanceof Array) ? a[i].concat(b[j]) : [].concat(a[i],b[j]);
					str.push(val.join(""));
				}
			}
			return {
				array: r,
				string: str.join(sp || "")
			};
		}

		return function (keyword, single, sp) {
			var cache = pinyinEngine.cache();
			var len = keyword.length, pys, py, pyl, i, y;
			
			if (len === 0) {return single ? "" : []}
			if (len === 1) {
				y = cache[keyword];
				if (single) {return y && y[0] ? y[0] : keyword}
				return y || [keyword];
			} else {
				py = [];
				for (i = 0; i < len; i ++) {
					y = cache[keyword.charAt(i)];
					if (y) {
						py[py.length] = single ? y[0] : y;
					} else {
						py[py.length] = single ? keyword.charAt(i) : [keyword.charAt(i)];
					}
				}
				if (single) {return sp == null ? py : py.join(sp || "")}

				pys = py[0];
				pyl = py.length;
				var prt, str;
				for (i = 1; i < pyl; i++) {
					prt = product(pys, py[i], sp);
					pys = prt.array;
				}
				return sp == null ? pys : prt.string;
			};
		};
		
	}();

	/**
	 * 汉字拼音索引缓存
	 * @return	{Object}	名为汉字值拼音的对象
	 * @example	var pinyin = pinyinEngine.cache(); pinyin['乐']; // ["le", "yue"]
	 */
	pinyinEngine.cache = function () {
		var cache = {},
			isEmptyObject = true,
			data = pinyinEngine._data || {},
			txts, txt, i, j, m;
		
		for (i in data) {
			isEmptyObject = false;
			txts = data[i];
			j = 0;
			m = txts.length;
			for(; j < m; j ++) {
				txt = txts.charAt(j);
				if (!cache[txt]) {
					cache[txt] = [];
				}
				cache[txt].push(i);
			}
		}
		
		if (!isEmptyObject) {
			pinyinEngine.cache = function () {
				return cache;
			};
		}
		
		return cache;
	};

	// 拼音对照简体+繁体中文数据
	pinyinEngine._data = {a:"\u554a\u963f\u5475\u5416\u55c4\u814c\u9515\u9312",ai:"\u7231\u77ee\u6328\u54ce\u788d\u764c\u827e\u5509\u54c0\u853c\u9698\u57c3\u7691\u5446\u55cc\u5ad2\u7477\u66a7\u6371\u7839\u55f3\u953f\u972d\u4e42\u4e43\u4f0c\u50fe\u5117\u51d2\u5240\u5274\u53c6\u5443\u545d\u5540\u560a\u566b\u566f\u5828\u5867\u58d2\u5947\u5a2d\u5a3e\u5b21\u5d66\u611b\u61d3\u61dd\u6571\u6573\u6639\u66d6\u6b2c\u6b38\u6bd0\u6eb0\u6ebe\u6fed\u70e0\u7125\u74a6\u769a\u76a7\u77b9\u784b\u78d1\u7919\u7d60\u8586\u85f9\u8af0\u8b6a\u8b7a\u8cf9\u8eb7\u91b7\u9384\u9440\u95a1\u9602\u9628\u9638\u9691\u9744\u9749\u9932\u99a4\u9a03\u9be6\u9c6b\u9d31\u5d16",an:"\u6309\u5b89\u6697\u5cb8\u4ffa\u6848\u978d\u6c28\u80fa\u5382\u5e7f\u5eb5\u63de\u72b4\u94f5\u6849\u8c19\u9e4c\u57ef\u9eef\u4f92\u5111\u533c\u5388\u54b9\u5535\u557d\u57b5\u57be\u5813\u5a69\u5a95\u5c7d\u5cd6\u5e72\u667b\u6d1d\u73b5\u75f7\u76d2\u76e6\u76eb\u78aa\u7f6f\u8164\u834c\u83f4\u843b\u844a\u84ed\u88fa\u8a9d\u8af3\u8c7b\u8c8b\u9043\u9257\u92a8\u930c\u94b3\u95c7\u9670\u9682\u968c\u96f8\u978c\u97fd\u9807\u981e\u9878\u99a3\u9b9f\u9d33\u9d6a\u9d95",ang:"\u6602\u80ae\u76ce\u4ef0\u536c\u5c87\u663b\u678a\u9183\u91a0\u9aaf",ao:"\u8884\u51f9\u50b2\u5965\u71ac\u61ca\u6556\u7ff1\u6fb3\u56a3\u62d7\u5aaa\u5ed2\u9a9c\u55f7\u5773\u9068\u8071\u87af\u7352\u93ca\u9ccc\u93d6\u5c99\u53ab\u55f8\u5662\u56bb\u56c2\u5787\u58ba\u58bd\u5961\u5967\u5abc\u5aef\u5cb0\u5d85\u5db4\u6160\u6277\u629d\u646e\u64d9\u67ea\u688e\u68cd\u6cd1\u6d47\u6ef6\u6f86\u6f9a\u719d\u720a\u7353\u7488\u7711\u78dd\u78fd\u7909\u7ff6\u7ffa\u82ba\u851c\u8779\u8956\u8b37\u8b38\u8eea\u90e9\u93d5\u957a\u969e\u9a41\u9c32\u9d01\u9d22\u9dd4\u9f07",ba:"\u628a\u516b\u5427\u7238\u62d4\u7f62\u8dcb\u5df4\u82ad\u6252\u575d\u9738\u53ed\u9776\u7b06\u75a4\u8019\u634c\u7c91\u8307\u5c9c\u9c85\u94af\u9b43\u83dd\u705e\u4ec8\u4f2f\u53d0\u54f1\u54f5\u577a\u57bb\u58a2\u58e9\u593f\u59ad\u5cc7\u5f1d\u629c\u62aa\u636d\u6733\u6777\u67ed\u6b1b\u6e43\u70a6\u72ae\u7390\u7679\u7685\u77f2\u7b29\u7d26\u7f77\u7f93\u80c8\u8337\u8406\u8686\u8987\u8a59\u8c5d\u8dc1\u8ef7\u91db\u91df\u9200\u98b0\u9b5e\u9b81\u9b8a\u9c83\u9c8c\u9f25",bai:"\u767e\u767d\u6446\u8d25\u67cf\u62dc\u4f70\u4f2f\u7a17\u636d\u5457\u63b0\u5504\u5e8d\u6252\u62dd\u6300\u6392\u64fa\u6557\u6822\u6d3e\u7308\u7ae1\u7ca8\u7cba\u7d54\u859c\u85ad\u896c\u8d01\u9781\u97b4\u97db",ban:"\u534a\u529e\u73ed\u822c\u62cc\u642c\u7248\u6591\u677f\u4f34\u6273\u626e\u74e3\u9881\u7eca\u764d\u5742\u94a3\u8228\u962a\u7622\u4e26\u5206\u5762\u57ff\u59c5\u5c85\u5f6c\u6011\u642b\u653d\u6592\u6604\u670c\u67c8\u6e74\u74ea\u79da\u7c53\u7c84\u7d46\u80a6\u8742\u8781\u878c\u8929\u8982\u8c73\u8dd8\u8fa6\u8fa7\u8fa8\u8fa9\u8fac\u8faf\u9211\u9261\u95c6\u977d\u9812\u9b6c\u9cfb",bang:"\u5e2e\u68d2\u7ed1\u78c5\u9551\u90a6\u699c\u868c\u508d\u6886\u8180\u8c24\u6d5c\u84a1\u4e26\u55d9\u57b9\u57f2\u585d\u5ace\u5cc0\u5d17\u5e47\u5e5a\u5e6b\u5f6d\u5fac\u6337\u6360\u6412\u65c1\u68d3\u7253\u73a4\u7865\u7a16\u7d21\u7d81\u7e0d\u7eba\u8255\u8684\u86d6\u872f\u8783\u8b17\u90ab\u938a\u97a4\u9a2f\u9ac8",bao:"\u5305\u62b1\u62a5\u9971\u4fdd\u66b4\u8584\u5b9d\u7206\u5265\u8c79\u5228\u96f9\u8912\u5821\u82de\u80de\u9c8d\u70ae\u7011\u9f85\u5b62\u7172\u8913\u9e28\u8db5\u8446\u4f68\u5124\u525d\u52f9\u52fd\u5446\u5610\u5697\u5822\u5831\u5aac\u5ad1\u5bda\u5bf3\u5bf6\u5fc1\u6009\u66d3\u67b9\u73e4\u7832\u7a87\u7b23\u7c3f\u7de5\u83e2\u8554\u85f5\u8663\u86ab\u888c\u888d\u88d2\u88e6\u8943\u8cf2\u924b\u9464\u94c7\u95c1\u974c\u9764\u98f9\u98fd\u99c2\u9ab2\u9af1\u9b91\u9cf5\u9d07\u9f59\u5b80",be:"\u8421",bei:"\u88ab\u5317\u500d\u676f\u80cc\u60b2\u5907\u7891\u5351\u8d1d\u8f88\u94a1\u7119\u72c8\u60eb\u81c2\u8919\u6096\u84d3\u9e4e\u943e\u5457\u90b6\u97b4\u5b5b\u9642\u789a\u4ffb\u4ffe\u505d\u5079\u5099\u50c3\u54f1\u5504\u55ba\u57bb\u57e4\u602b\u6102\u618a\u63f9\u6601\u676e\u67f8\u686e\u6896\u68d1\u68d3\u6911\u6ce2\u726c\u7295\u72fd\u73fc\u7432\u75fa\u76c3\u7999\u7b83\u7cd2\u82dd\u8300\u83e9\u8406\u842f\u8461\u85e3\u86fd\u871a\u896c\u8a96\u8ac0\u8c9d\u8dcb\u8ef0\u8f29\u9101\u9273\u92c7\u930d\u9434\u9ab3\u9d6f",ben:"\u672c\u5954\u82ef\u7b28\u592f\u951b\u8d32\u755a\u574c\u4f53\u5034\u55af\u5932\u5959\u6379\u64aa\u6873\u694d\u6ccd\u6e00\u7083\u71cc\u7287\u7356\u7fc9\u87e6\u8cc1\u8f3d\u9029\u931b\u943c",beng:"\u8e66\u7ef7\u752d\u5d29\u8ff8\u868c\u6cf5\u750f\u5623\u4f3b\u4ff8\u508d\u50b0\u552a\u55d9\u57c4\u57f2\u580b\u5874\u595f\u5d6d\u5e73\u62a8\u6337\u6412\u65c1\u699c\u6f28\u71a2\u7423\u742b\u75ed\u794a\u7d63\u7db3\u7e43\u83f6\u8df0\u902c\u930b\u93f0\u955a\u958d\u979b",bi:"\u6bd4\u7b14\u95ed\u9f3b\u78a7\u5fc5\u907f\u903c\u6bd5\u81c2\u5f7c\u9119\u58c1\u84d6\u5e01\u5f0a\u8f9f\u853d\u6bd9\u5e87\u655d\u965b\u6bd6\u75f9\u79d8\u6ccc\u79d5\u859c\u8378\u8298\u8406\u5315\u88e8\u7540\u4ffe\u5b16\u72f4\u7b5a\u7b85\u7be6\u822d\u835c\u895e\u5eb3\u94cb\u8df8\u5421\u610e\u8d32\u6ed7\u6fde\u74a7\u54d4\u9ac0\u5f3c\u59a3\u5a62\u4ef3\u4f4a\u4f56\u4f5b\u506a\u5302\u5351\u5487\u555a\u55f6\u5752\u57e4\u581b\u590d\u5936\u5970\u59bc\u5a1d\u5ab2\u5b36\u5c44\u5d25\u5e45\u5e63\u5e64\u5e80\u5ee6\u5f3b\u5f43\u602d\u6036\u6082\u610a\u62c2\u636d\u6583\u65c7\u670d\u673c\u6787\u6788\u67c0\u67f2\u6890\u6911\u6945\u6a97\u6b8d\u6bf4\u6c98\u6ce2\u6e62\u6eed\u6f77\u714f\u719a\u7358\u7359\u73cc\u7541\u7550\u7562\u7595\u75aa\u75fa\u7680\u7695\u77a5\u7986\u7a2b\u7b13\u7b46\u7b83\u7b84\u7b86\u7bf3\u7c83\u7c8a\u7d15\u7d34\u7dbc\u7e2a\u7e74\u7eb0\u7f77\u7f7c\u7fcd\u805b\u80b6\u80b8\u80c7\u813e\u8157\u8177\u82fe\u841e\u84fd\u8617\u8651\u870c\u8795\u8890\u88ab\u8945\u8963\u89f1\u8a56\u8bd0\u8c4d\u8c8f\u8cb1\u8cbb\u8cc1\u8d14\u8d39\u8d51\u8ddb\u8e3e\u8e55\u8e83\u8e84\u90b2\u9128\u912a\u921a\u924d\u930d\u939e\u93ce\u9434\u943e\u9587\u9588\u9589\u959f\u95ec\u9642\u9674\u9781\u979e\u97b8\u97e0\u98f6\u9946\u999d\u99a5\u99dc\u9a46\u9af2\u9b53\u9b6e\u9b85\u9ba9\u9c0f\u9cbe\u9d13\u9d56\u9d9d\u9ddd\u9de9\u9e0a\u9f0a",bia:"\u9adf",bian:"\u8fb9\u53d8\u4fbf\u904d\u7f16\u8fa9\u6241\u8d2c\u97ad\u535e\u8fa8\u8fab\u5fed\u782d\u533e\u6c74\u78a5\u8759\u890a\u9cca\u7b3e\u82c4\u7a86\u5f01\u7f0f\u7178\u5909\u5c01\u5cc5\u5fa7\u60fc\u6283\u62da\u63d9\u662a\u6c73\u709e\u7251\u7335\u7371\u7502\u75ba\u7a28\u7a39\u7baf\u7c69\u7cc4\u7de8\u7df6\u81f1\u8251\u8439\u85ca\u898d\u89b5\u8b8a\u8c4d\u8cb6\u8fa1\u8fa6\u8fa7\u8fae\u8faf\u9089\u908a\u90b2\u91c6\u937d\u959e\u9795\u9828\u9bfe\u9bff\u9d18\u9da3\u9adf",biao:"\u8868\u6807\u5f6a\u8198\u6753\u5a4a\u98d1\u98d9\u9cd4\u762d\u98da\u9573\u88f1\u9aa0\u9556\u4ff5\u50c4\u5126\u527d\u5882\u5ad6\u5e56\u5fb1\u647d\u6a19\u6aa6\u6df2\u6eee\u6f02\u700c\u706c\u719b\u7202\u730b\u7a6e\u7bfb\u813f\u8194\u81d5\u82de\u8508\u85e8\u893e\u8ad8\u8b24\u8d06\u9336\u93d6\u93e2\u9463\u98ae\u98b7\u98c6\u98c7\u98c8\u98ca\u9a43\u9a6b\u9a89\u9c3e\u9e83\u9adf",bie:"\u522b\u618b\u9cd6\u762a\u8e69\u5225\u5487\u5f46\u5fb6\u6252\u62d4\u634c\u6486\u6487\u67ed\u67f2\u7330\u765f\u79d8\u7a6a\u82fe\u8382\u853d\u864c\u86c2\u87de\u8952\u9c49\u9f08\u9f9e",bin:"\u5bbe\u6fd2\u6448\u5f6c\u658c\u6ee8\u8c73\u8191\u6ba1\u7f24\u9acc\u50a7\u69df\u9b13\u9554\u73a2\u4efd\u5110\u64ef\u6915\u6baf\u6c1e\u6c43\u6d5c\u6ff1\u6ff5\u7015\u7478\u74b8\u780f\u7e7d\u81cf\u8668\u8819\u8a1c\u8c69\u8cd3\u8cd4\u8d07\u8d5f\u90a0\u944c\u9726\u983b\u986e\u9891\u9ad5\u9ae9\u9b02\u9b22",bing:"\u5e76\u75c5\u5175\u51b0\u4e19\u997c\u5c4f\u79c9\u67c4\u70b3\u6452\u69df\u7980\u90b4\u4e26\u4ecc\u4f75\u5002\u504b\u50a1\u51ab\u57aa\u5bce\u5e73\u5e77\u5eb0\u6032\u62a6\u62fc\u63a4\u661e\u663a\u678b\u681f\u6824\u68b9\u68c5\u6ab3\u6c37\u71f7\u71f9\u7415\u75ed\u765b\u765d\u772a\u7a1f\u7a89\u7add\u7d63\u7d86\u7ee0\u82ea\u86c3\u8a81\u8df0\u9235\u927c\u92f2\u9643\u9750\u9786\u979e\u97b8\u9905\u9920\u9ba9\u7592",bo:"\u62e8\u6ce2\u64ad\u6cca\u535a\u4f2f\u9a73\u73bb\u5265\u8584\u52c3\u83e0\u94b5\u640f\u8116\u5e1b\u822c\u67cf\u8236\u6e24\u94c2\u7b94\u818a\u9b44\u535c\u7934\u8ddb\u6a97\u4eb3\u9e41\u8e23\u5575\u8543\u7c38\u94b9\u997d\u64d8\u4ee2\u4f5b\u4fbc\u50e0\u50f0\u525d\u52df\u54f1\u5643\u5697\u58c6\u59ad\u5b5b\u5b79\u5d93\u5e17\u5f74\u6015\u613d\u61ea\u62cd\u62d4\u632c\u64a5\u64d7\u66b4\u670d\u67ed\u6872\u6991\u6a98\u6b02\u6b95\u6cfc\u6d61\u6dff\u6e50\u6f51\u6f58\u7011\u717f\u7206\u7254\u72a6\u72bb\u72db\u733c\u74dd\u74df\u756a\u7676\u767c\u767d\u767e\u76aa\u76cb\u7835\u7886\u78fb\u7921\u79e1\u7a5b\u7b29\u7ba5\u7c19\u7c3f\u7cea\u7d34\u7f3d\u8091\u80c9\u824a\u8274\u82e9\u8300\u8337\u83e9\u8467\u84b2\u8514\u8522\u859c\u8616\u8617\u86be\u889a\u88af\u88b9\u894e\u894f\u896e\u8a59\u8b52\u8c70\u8db5\u8dd1\u8e73\u90e3\u9238\u9251\u9262\u92cd\u939b\u946e\u9548\u9911\u993a\u998e\u999b\u999e\u99c1\u99ee\u9a4b\u9ac6\u9ac9\u9b81\u9b8a\u9c4d\u9c85\u9c8c\u9d53\u63b0",bu:"\u4e0d\u6b65\u8865\u5e03\u90e8\u6355\u535c\u7c3f\u54fa\u5821\u57e0\u6016\u57d4\u74ff\u900b\u6661\u94b8\u949a\u91ad\u535f\u4f48\u50d5\u52cf\u5425\u5498\u57d7\u5a44\u5c03\u5cec\u5eaf\u5ecd\u6091\u62aa\u62ca\u6357\u636c\u64b2\u64c8\u67e8\u6b68\u6b69\u6ea5\u735b\u79ff\u7b81\u7bf0\u8379\u8500\u8584\u88dc\u8aa7\u8e04\u8f39\u8f50\u90f6\u9208\u923d\u9644\u9660\u97b4\u9914\u9922\u9bc6\u9cea\u9d4f\u9e14",ca:"\u64e6\u62c6\u7924\u5693\u50aa\u56c3\u6503\u6a74\u78e3\u7938\u8521\u906a",cai:"\u624d\u83dc\u91c7\u6750\u8d22\u88c1\u731c\u8e29\u776c\u8521\u5f69\u5038\u5072\u554b\u57f0\u5a47\u5bc0\u621d\u6250\u63a1\u63cc\u68cc\u7db5\u7e29\u7e94\u8ca1\u8df4",can:"\u8695\u6b8b\u63ba\u53c2\u60e8\u60ed\u9910\u707f\u9a96\u74a8\u5b71\u9eea\u7cb2\u50aa\u510f\u53c3\u53c4\u53c5\u55b0\u5607\u5646\u56cb\u5b20\u5b31\u5d7e\u6158\u6159\u615a\u61af\u6214\u6472\u6701\u6b98\u6dfa\u6e4c\u6faf\u71e6\u7218\u7a47\u7bf8\u8592\u8745\u8836\u883a\u8b32\u8e54\u93d2\u98e1\u98f1\u9a42\u9bf5\u9c3a\u9cb9\u9ef2",cang:"\u85cf\u4ed3\u6ca7\u8231\u82cd\u4f27\u4efa\u5009\u5096\u51d4\u5328\u5d62\u6b0c\u6ec4\u6ff8\u734a\u7472\u7bec\u7f49\u81e7\u8259\u84bc\u8535\u87a5\u8cf6\u9476\u9dac\u9e27",cao:"\u8349\u64cd\u66f9\u69fd\u7cd9\u5608\u825a\u87ac\u6f15\u50ae\u5c6e\u5d86\u613a\u6145\u6152\u61c6\u64a1\u66fa\u6fa1\u808f\u8278\u8279\u84f8\u893f\u8959\u9020\u9135\u93ea\u9430\u9a32\u9f1c",ce:"\u518c\u4fa7\u7b56\u6d4b\u5395\u607b\u5074\u518a\u53a0\u5884\u5ae7\u5e3b\u5e58\u5ec1\u60fb\u61a1\u62fa\u6547\u67f5\u6805\u6e2c\u755f\u7b27\u7b5e\u7b74\u7ba3\u7c0e\u7ca3\u835d\u8417\u8434\u84db\u8d66\u9f70\u5202",cen:"\u53c2\u5c91\u6d94\u53c3\u53c4\u53c5\u5d7e\u68a3\u6c75\u7876\u7a47\u7b12\u7bf8\u81a5",ceng:"\u66fe\u5c42\u8e6d\u564c\u50e7\u589e\u5c64\u5d92\u6a67\u7af2\u7e52\u7f2f\u9a53",ceok:"\u785b\u7873",ceom:"\u5cbe",ceon:"\u7320",ceor:"\u4e7d",cha:"\u67e5\u63d2\u53c9\u8336\u5dee\u5c94\u643d\u5bdf\u832c\u78b4\u5239\u8be7\u6942\u69ce\u9572\u8869\u6c4a\u9987\u6aab\u59f9\u6748\u9538\u5693\u4edb\u4f98\u505b\u524e\u55cf\u571f\u579e\u597c\u5c8e\u5d56\u6260\u6271\u633f\u6348\u6377\u63a5\u63f7\u6456\u659c\u67fb\u688c\u7339\u7580\u79c5\u7d01\u809e\u81ff\u8256\u8286\u82f4\u8356\u837c\u8928\u8a0d\u8a67\u8a6b\u8e45\u91f5\u929f\u9364\u9388\u9454\u9497\u976b\u9937\u55b3",chai:"\u67f4\u62c6\u5dee\u8c7a\u9497\u7625\u867f\u4faa\u5115\u52d1\u53c9\u558d\u56c6\u6260\u6413\u67e5\u72b2\u7961\u8308\u831d\u8515\u8806\u8883\u8a0d\u91f5\u9f5c\u9f87",chan:"\u4ea7\u7f20\u63ba\u6400\u9610\u98a4\u94f2\u8c17\u8749\u5355\u998b\u89c7\u5a75\u8487\u8c04\u5181\u5edb\u5b71\u87fe\u7fbc\u9561\u5fcf\u6f7a\u7985\u9aa3\u8e94\u6fb6\u4e33\u4eb6\u4f54\u50dd\u50e4\u5103\u5133\u514e\u5154\u522c\u5257\u5277\u5296\u5358\u5398\u5574\u55ae\u563d\u56b5\u56c5\u5718\u58a0\u58e5\u5b0b\u5b17\u5d2d\u5d7c\u5d83\u5d84\u5dc9\u5e5d\u5e68\u619a\u61f4\u61fa\u63b8\u644c\u6472\u647b\u64a3\u6519\u65ba\u65f5\u68b4\u68ce\u6990\u6b03\u6bda\u6cbe\u6d50\u6e10\u6e79\u6efb\u6f38\u6f79\u700d\u703a\u705b\u7158\u71c0\u7351\u7522\u7523\u785f\u78db\u79aa\u7c05\u7dc2\u7dfe\u7e5f\u7e75\u7e8f\u7e92\u80c0\u8120\u826c\u82eb\u8546\u87b9\u87ec\u87fa\u88a9\u88e3\u88e7\u894c\u895c\u895d\u8998\u8a97\u8ac2\u8b42\u8b87\u8b92\u8b96\u8c36\u8e4d\u8fbf\u913d\u9141\u91a6\u9246\u92cb\u92d3\u93df\u9471\u9575\u95b3\u95e1\u97c2\u986b\u995e",chang:"\u957f\u5531\u5e38\u573a\u5382\u5c1d\u80a0\u7545\u660c\u655e\u5021\u507f\u7316\u88f3\u9cb3\u6c05\u83d6\u60dd\u5ae6\u5f9c\u9b2f\u960a\u6005\u4f25\u6636\u82cc\u5a3c\u4ee7\u5000\u5018\u50d8\u511f\u513b\u514f\u53b0\u5617\u5690\u5834\u5872\u5c19\u5c1a\u5ee0\u60b5\u667f\u66a2\u68d6\u6919\u6dcc\u6dd0\u713b\u739a\u7429\u7452\u747a\u74fa\u751e\u757c\u8139\u8178\u8193\u8407\u87d0\u88ee\u8aaf\u92f9\u92ff\u9329\u93db\u9520\u9577\u9578\u95b6\u95db\u97d4\u9be7\u9c68\u9cbf\u9f1a",chao:"\u671d\u6284\u8d85\u5435\u6f6e\u5de2\u7092\u5632\u527f\u7ef0\u949e\u600a\u712f\u8016\u6641\u4ee6\u4eef\u528b\u52e6\u5520\u562e\u5dd0\u5de3\u5f28\u6477\u69f1\u6a14\u6b29\u6d9b\u6f05\u6fe4\u7123\u717c\u724a\u7727\u7ab2\u7c86\u7d39\u7da4\u7dbd\u7e10\u7e5b\u7ec9\u7ecd\u7f7a\u89d8\u8a2c\u8b05\u8b3f\u8bcc\u8da0\u8dab\u8f48\u911b\u9214\u9ea8\u9f02\u9f0c",che:"\u8f66\u64a4\u626f\u63a3\u5f7b\u5c3a\u6f88\u577c\u7817\u4f21\u4fe5\u5056\u52f6\u546b\u5513\u55a2\u591a\u591b\u5972\u5b85\u5c6e\u5fb9\u63ca\u6470\u64a6\u65a5\u6c60\u70e2\u70f2\u710e\u7221\u77ae\u7868\u7869\u8045\u8397\u86fc\u8a40\u8b35\u8eca\u8fe0\u9819",chen:"\u8d81\u79f0\u8fb0\u81e3\u5c18\u6668\u6c89\u9648\u886c\u6a59\u5ff1\u90f4\u6987\u62bb\u8c0c\u789c\u8c36\u5bb8\u9f80\u55d4\u4f27\u741b\u4fb2\u5096\u512d\u56ab\u582a\u5861\u586b\u5875\u588b\u5926\u5e18\u6116\u6375\u63e8\u6550\u66df\u6795\u686d\u68e7\u68fd\u6a04\u6aec\u6c88\u6e5b\u700b\u70e5\u7141\u75a2\u75b9\u760e\u7628\u7708\u778b\u7876\u78e3\u7a31\u7d9d\u7e1d\u7f1c\u809c\u80c2\u831e\u8380\u8390\u852f\u85bc\u87b4\u896f\u8a26\u8ac3\u8af6\u8b13\u8b32\u8b96\u8cdd\u8d02\u8d82\u8dbb\u8dc8\u8e38\u8ed9\u8fe7\u91a6\u9202\u9356\u95d6\u95ef\u9673\u9703\u9dd0\u9e8e\u9f53\u9f54\u79e4",cheng:"\u6210\u4e58\u76db\u6491\u79f0\u57ce\u7a0b\u5448\u8bda\u60e9\u901e\u9a8b\u6f84\u6a59\u627f\u584d\u67fd\u57d5\u94d6\u564c\u94db\u9172\u665f\u88ce\u67a8\u86cf\u4e1e\u77a0\u4e57\u4f25\u4fb1\u5000\u5041\u50dc\u51c0\u545b\u55c6\u57e9\u5818\u5856\u5a0d\u5bac\u5cf8\u5d4a\u5eb1\u5f8e\u5fb4\u5fb5\u609c\u6186\u6195\u61f2\u62a2\u6330\u6381\u6436\u645a\u6464\u6490\u649c\u655e\u673e\u68d6\u68e6\u6909\u69cd\u6a18\u6a55\u6a56\u6a89\u6a99\u6c36\u6cdf\u6d06\u6d48\u6d67\u6d7e\u6de8\u6e97\u6f82\u7013\u701e\u722f\u725a\u73f5\u73f9\u7424\u7472\u757b\u76ef\u7748\u77c3\u7880\u7a31\u7a6a\u7a9a\u7ac0\u7b6c\u7d7e\u7dfd\u8100\u812d\u837f\u8670\u87f6\u89d5\u8aa0\u8d6a\u8d6c\u8d9f\u8e1c\u8e66\u90d5\u90e2\u9192\u92ee\u9397\u93f3\u93ff\u943a\u9637\u9757\u9833\u9953\u9a01\u9a2c\u9bce\u9ee8\u79e4",chi:"\u5403\u5c3a\u8fdf\u6c60\u7fc5\u75f4\u8d64\u9f7f\u803b\u6301\u65a5\u4f88\u5f1b\u9a70\u70bd\u5319\u8e1f\u577b\u830c\u5880\u996c\u5ab8\u8c49\u892b\u6555\u54e7\u761b\u86a9\u557b\u9e31\u7735\u87ad\u7bea\u9b51\u53f1\u5f73\u7b1e\u55e4\u50ba\u4f41\u4f99\u4fff\u525f\u52c5\u5359\u5376\u53fa\u544e\u546c\u546e\u5479\u54c6\u5578\u559c\u55ab\u5628\u562f\u5644\u566d\u5758\u5791\u5953\u5979\u599b\u5c5f\u5cbb\u5f68\u5f72\u5fb2\u605c\u6065\u6157\u6178\u618f\u61d8\u6261\u62ac\u62b6\u62c6\u62d5\u62d6\u62f8\u6347\u63d0\u640b\u645b\u6474\u6521\u6758\u67c5\u67e2\u6a06\u6b3c\u6b57\u6b6d\u6b6f\u6c56\u6cb1\u6cb6\u6cbb\u6cdc\u6dd4\u6e41\u6ede\u6eef\u6f26\u707b\u70fe\u71be\u72cb\u74fb\u75d3\u75f8\u7608\u7661\u7719\u779d\u7947\u79bb\u79fb\u7afe\u7b42\u7b88\u7b8e\u7c9a\u7ce6\u7d7a\u7fc4\u7fe4\u7fe8\u801b\u8094\u80dd\u80e3\u80f5\u812a\u815f\u82aa\u832c\u834e\u8389\u83ed\u8687\u86b3\u86c7\u876d\u88b2\u88b3\u88ed\u8a35\u8a80\u8a83\u8aba\u8b18\u8b3b\u8cbe\u8d7f\u8d8d\u8d90\u8da9\u8dc5\u8de2\u8dee\u8e05\u8e36\u8ee7\u8fe1\u8fe3\u9045\u905f\u906b\u9072\u908c\u9253\u9279\u9290\u9349\u96e2\u96f4\u98ed\u98fe\u991d\u994e\u9970\u99b3\u9a3a\u9a6a\u9a8a\u9cf7\u9d1f\u9d44\u9d63\u9d92\u9d97\u9d99\u9dd8\u9eb6\u9ed0\u9f52\u9f5d\u90d7",chong:"\u51b2\u91cd\u866b\u5145\u5ba0\u5d07\u6d8c\u79cd\u825f\u5fe1\u8202\u94f3\u61a7\u833a\u5045\u50ad\u50ee\u55a0\u5603\u57eb\u5bf5\u5d08\u5fb8\u6183\u63f0\u644f\u6a01\u6c96\u6d7a\u6f34\u6f7c\u70db\u721e\u73eb\u75cb\u76c5\u794c\u7a2e\u7ddf\u7f7f\u7fc0\u8327\u8769\u87f2\u885d\u8908\u8e56\u8e71\u916e\u9283\u9680",chou:"\u62bd\u6101\u81ed\u4ec7\u4e11\u7a20\u7ef8\u916c\u7b79\u8e0c\u7574\u7785\u60c6\u4fe6\u5e31\u7633\u96e0\u4e12\u4fb4\u5062\u5114\u541c\u568b\u5733\u59af\u5a64\u5abf\u5b26\u5e6c\u601e\u61e4\u626d\u63ab\u63c4\u640a\u64e3\u677b\u677d\u6826\u6906\u6aae\u6ba0\u6eb4\u71fd\u7270\u72a8\u72ab\u7564\u7587\u7697\u76e9\u7723\u77c1\u7bd8\u7c4c\u7d2c\u7d52\u7da2\u81f0\u83d7\u85b5\u88ef\u8a76\u8b05\u8b78\u8b8e\u8b90\u8bcc\u8bea\u8dfe\u8e8a\u905a\u9167\u9194\u919c\u91bb\u9215\u94ae\u96d4\u9b57\u9b98\u9bc8\u9c8b",chu:"\u51fa\u5904\u521d\u9504\u9664\u89e6\u6a71\u695a\u7840\u50a8\u755c\u6ec1\u77d7\u6410\u8e87\u53a8\u96cf\u696e\u6775\u520d\u6035\u7ecc\u4e8d\u61b7\u8e70\u9edc\u870d\u6a17\u4ff6\u5097\u510a\u5132\u51e6\u52a9\u563c\u57f1\u5ab0\u5c80\u5e6e\u5eda\u6149\u61e8\u62c0\u6462\u6474\u654a\u65b6\u67e0\u6918\u698b\u69d2\u6a7b\u6a9a\u6ac9\u6ad6\u6ae5\u6b2a\u6b5c\u6d82\u6dd1\u6ec0\u6fcb\u70aa\u7293\u73ff\u7421\u74b4\u786b\u790e\u795d\u7987\u7acc\u7ad0\u7be8\u7d40\u7d6e\u801d\u8021\u81c5\u82bb\u83c6\u8457\u84a2\u84ad\u84eb\u854f\u85f8\u8655\u87f5\u8829\u891a\u89d5\u89f8\u8a58\u8ad4\u8af8\u8bce\u8bf8\u8c56\u8c60\u8c99\u8d8e\u8de6\u8e00\u8e30\u8e95\u9110\u924f\u92e4\u95a6\u96db\u9db5\u9e00\u9f63\u9f6d\u9f7c\u5c6e",chua:"\u64ae\u6b3b\u6b58",chuai:"\u63e3\u81aa\u555c\u562c\u640b\u8e39\u6b3c\u8144\u8197",chuan:"\u7a7f\u8239\u4f20\u4e32\u5ddd\u5598\u693d\u6c1a\u9044\u948f\u8221\u821b\u5ddb\u50b3\u50e2\u5276\u570c\u583e\u60f4\u63be\u66b7\u6b42\u6c4c\u732d\u7394\u744f\u750e\u7bc5\u819e\u8229\u8348\u8cd7\u8e33\u8e39\u8f32\u91e7\u9569\u9da8",chuang:"\u7a97\u5e8a\u95ef\u521b\u75ae\u5e62\u6006\u4ed3\u4efa\u5009\u50b8\u5205\u5231\u524f\u5259\u5275\u5647\u56ea\u56f1\u6134\u6227\u6450\u6723\u6a66\u6f34\u6f3a\u7240\u724e\u7255\u7621\u78e2\u7a93\u7abb\u81a7\u8202\u8471\u8525\u95d6",chui:"\u5439\u5782\u708a\u9524\u6376\u690e\u69cc\u68f0\u9672\u5015\u570c\u57c0\u60d9\u6425\u6858\u7ba0\u8144\u83d9\u90f5\u9318\u939a\u9840\u9b0c\u9b4b\u9fa1",chun:"\u6625\u5507\u7eaf\u8822\u9187\u6df3\u693f\u877d\u83bc\u9e51\u5046\u50e2\u583e\u5a8b\u60f7\u65fe\u6699\u6710\u6776\u696f\u69c6\u6a41\u6ac4\u6c8c\u6d71\u6e7b\u6ee3\u6f18\u7289\u7443\u7776\u7bba\u7d14\u80ab\u80ca\u8123\u819e\u829a\u8405\u8436\u8493\u84f4\u8cf0\u8e33\u8f07\u8f34\u8f81\u9195\u931e\u9659\u9bd9\u9c06\u9d89\u9d9e",chuo:"\u6233\u7ef0\u8e14\u555c\u9f8a\u8f8d\u4fc3\u5437\u56bd\u5a15\u5a16\u5a65\u5a7c\u5b4e\u60d9\u62fa\u64c9\u65ab\u6b60\u6db0\u6dd6\u712f\u78ed\u7bb9\u7c07\u7db4\u7dbd\u7e5b\u7f00\u814f\u8343\u851f\u8da0\u8db5\u8dff\u8e31\u8e87\u8f1f\u8fb5\u8fb6\u9034\u916b\u919b\u92dc\u9323\u93c3\u9461\u955e\u9f6a\u9f71",ci:"\u6b21\u6b64\u8bcd\u74f7\u6148\u96cc\u78c1\u8f9e\u523a\u8328\u4f3a\u75b5\u8d50\u5dee\u5179\u5472\u9e5a\u7960\u7ccd\u4f4c\u4f7d\u5068\u523e\u5395\u53a0\u53f8\u5470\u5559\u5790\u5832\u59d5\u5b28\u5d6f\u5d73\u5e9b\u5ec1\u63aa\u673f\u67b1\u67cc\u67f4\u681c\u6828\u6cda\u6ecb\u6fac\u6fe8\u73bc\u73c1\u7506\u7689\u7920\u7ca2\u7d58\u7e12\u80d4\u8308\u8326\u8332\u8360\u83bf\u8415\u858b\u85ba\u869d\u86d3\u8785\u8786\u8800\u8a5e\u8cdc\u8d7c\u8d80\u8d91\u8dd0\u8f9d\u8fa4\u8fad\u9236\u98fa\u9908\u9ab4\u9aca\u9b86\u9d1c\u9dbf\u9dc0\u9f79",cis:"\u55ed",cong:"\u4ece\u4e1b\u8471\u5306\u806a\u56f1\u742e\u679e\u6dd9\u7481\u9aa2\u82c1\u506c\u53e2\u56ea\u5a43\u5b6e\u5f93\u5f96\u5f9e\u5fe9\u6031\u60a4\u60b0\u6152\u6181\u66b0\u68c7\u6964\u6a05\u6a2c\u6a37\u6b09\u6f0e\u6f17\u6f40\u6f48\u6f68\u7047\u7127\u719c\u71ea\u721c\u747d\u779b\u7882\u7a97\u7bf5\u7dcf\u7deb\u7e26\u7e31\u7e3d\u7e71\u7eb5\u8061\u8066\u8070\u8310\u83c6\u84ef\u8525\u85c2\u87cc\u8ab4\u8b25\u8ce8\u8ce9\u93e6\u9a18\u9a44",cou:"\u51d1\u6971\u8f8f\u8160\u594f\u63cd\u65cf\u6e4a\u73bc\u7c07\u851f\u85ae\u85ea\u8d8b\u8da3\u8da8\u8f33",cu:"\u7c97\u918b\u7c07\u4fc3\u5352\u5f82\u731d\u851f\u8e59\u9162\u6b82\u8e74\u4e14\u5346\u5648\u5a15\u5a16\u5aa8\u601a\u61b1\u621a\u637d\u7604\u762f\u76bb\u7e10\u7e2c\u7ec9\u8128\u850d\u8516\u89d5\u8a8e\u8d8b\u8d97\u8da3\u8da5\u8da8\u8e00\u8e13\u8e24\u8e27\u8e75\u932f\u9519\u9863\u9e81\u9e84\u9e86\u9ea4\u9f00",cuan:"\u7a9c\u8e7f\u7be1\u6512\u6c46\u7228\u9569\u64ba\u50d4\u5dd1\u6505\u651b\u6522\u6615\u6ad5\u6b11\u6ba9\u6ffd\u7052\u71b6\u7a73\u7abe\u7ac4\u7bf9\u7c12\u83c6\u8978\u8ea5\u92d1\u9479",cui:"\u50ac\u8106\u6467\u7fe0\u5d14\u6dec\u8870\u7601\u7cb9\u7480\u5550\u60b4\u8403\u6bf3\u69b1\u4e7c\u4f1c\u4f53\u5005\u51d7\u555b\u5894\u5bdf\u5d12\u5d2a\u5d89\u5ff0\u615b\u690a\u69ef\u6f3c\u6fe2\u7120\u71a3\u7355\u7417\u75a9\u76a0\u78ea\u7ac1\u7c8b\u7d23\u7db7\u7e17\u7e40\u7f1e\u7fc6\u8103\u813a\u81ac\u81b5\u81ce\u894a\u8da1\u8e24\u93d9\u96b9\u9847",cun:"\u6751\u5bf8\u5b58\u8e72\u5fd6\u76b4\u4f9f\u520c\u540b\u58ab\u62f5\u6d0a\u6d5a\u6f8a\u7af4\u7c7f\u8e06\u90a8",cuo:"\u9519\u64ae\u6413\u632b\u63aa\u78cb\u5d6f\u539d\u9e7e\u811e\u75e4\u8e49\u7625\u9509\u77ec\u5249\u5252\u590e\u5d73\u5eb4\u6467\u6614\u6700\u68e4\u6fa8\u71df\u7473\u7749\u7e12\u839d\u83a1\u84ab\u84cc\u8516\u8658\u894a\u8ace\u8e9c\u8ea6\u902a\u9073\u9142\u9147\u919d\u92bc\u932f\u9aca\u9e7a\u9f79",da:"\u5927\u7b54\u8fbe\u6253\u642d\u7629\u5854\u7b2a\u8037\u54d2\u8921\u75b8\u601b\u977c\u59b2\u6c93\u55d2\u9791\u4ea3\u5273\u5312\u547e\u5491\u5660\u57af\u584c\u58b6\u619a\u6428\u6498\u6a7d\u6bfc\u6c4f\u6e9a\u709f\u71f5\u7557\u7563\u7714\u77fa\u7b1a\u7e68\u7f8d\u80c6\u8345\u8359\u8598\u87fd\u89f0\u8a5a\u8df6\u8e82\u8fcf\u8fd6\u8fed\u9039\u9054\u9389\u939d\u943d\u97c3\u9f96\u9f98",dai:"\u5e26\u4ee3\u5446\u6234\u5f85\u888b\u902e\u6b79\u8d37\u6020\u50a3\u5927\u6b86\u5454\u73b3\u8fe8\u5cb1\u7519\u9edb\u9a80\u7ed0\u57ed\u4fa2\u53c7\u561a\u5788\u5e12\u5e2f\u5e36\u5ed7\u61db\u66c3\u67cb\u68e3\u6bd2\u6c4f\u703b\u7343\u7447\u7b89\u7c24\u7d3f\u7dff\u825c\u8515\u86ae\u8773\u87ae\u8976\u8a52\u8bd2\u8cb8\u8de2\u8e5b\u8ed1\u8eda\u8ee9\u8f6a\u902f\u905e\u9070\u96b6\u9734\u9746\u99b1\u99c4\u99d8\u9a6e\u9b98\u9d0f\u9ef1",dan:"\u4f46\u5355\u86cb\u62c5\u5f39\u63b8\u80c6\u6de1\u4e39\u803d\u65e6\u6c2e\u8bde\u90f8\u60ee\u77f3\u75b8\u6fb9\u7605\u840f\u6b9a\u7708\u8043\u7baa\u8d55\u510b\u5556\u4e3c\u4eb6\u4f14\u5013\u50e4\u5103\u5184\u5189\u5210\u52ef\u5330\u5358\u547e\u550c\u5557\u557f\u55ae\u563e\u5649\u5661\u56aa\u575b\u58c7\u5989\u5a0a\u5a85\u5e0e\u5f3e\u5f48\u5ff1\u601b\u60d4\u6116\u619a\u61ba\u61be\u628c\u64a2\u64a3\u64d4\u67e6\u6a90\u6b3f\u6bab\u6c8a\u6cf9\u6e5b\u6f6d\u6fb6\u6fb8\u71c0\u72da\u73ac\u74ed\u7514\u758d\u7649\u765a\u76bd\u7803\u79ab\u7a9e\u7c1e\u7d1e\u7e75\u803c\u8078\u8145\u81bb\u81bd\u8711\u8712\u87fa\u8874\u891d\u894c\u895c\u8998\u89c7\u89db\u8a11\u8a79\u8a95\u8b42\u8d09\u8d0d\u8d61\u8e5b\u8ead\u9132\u9156\u9188\u972e\u9815\u9924\u994f\u99be\u99f3\u9ae7\u9d20\u9ed5\u9eee\u9ef5\u5369\u4ebb",dang:"\u5f53\u515a\u6321\u6863\u8361\u8c20\u94db\u5b95\u83ea\u51fc\u88c6\u7800\u5052\u5105\u5679\u5735\u573a\u57b1\u5834\u58cb\u5a78\u5d35\u5d63\u6113\u64cb\u6529\u6a94\u6b13\u6c39\u6f52\u6fa2\u7059\u70eb\u71d9\u73f0\u7452\u7497\u74ab\u74fd\u7576\u760d\u76ea\u778a\u78ad\u7911\u7b5c\u7c1c\u7c39\u8261\u8569\u862f\u87f7\u8960\u8b61\u8b9c\u8da4\u903f\u943a\u95e3\u96fc\u9ee8",dao:"\u5230\u9053\u5012\u5200\u5c9b\u76d7\u7a3b\u6363\u60bc\u5bfc\u8e48\u7977\u5e31\u7e9b\u5fc9\u7118\u6c18\u53e8\u4fe6\u5114\u53d7\u5541\u5604\u5675\u58d4\u5bb2\u5c0e\u5c76\u5cf6\u5d8b\u5d8c\u5db9\u5e6c\u5fd1\u60c6\u636f\u6417\u64e3\u6737\u6921\u69dd\u6aa4\u6aae\u6d2e\u6d9b\u6fe4\u71fe\u74d9\u76dc\u7982\u79b1\u7a32\u7b8c\u7d69\u7fe2\u7fff\u8220\u83ff\u85b5\u866d\u885c\u885f\u88ef\u8ec7\u91bb\u91d6\u9666\u9676\u969d\u96af\u9b5b\u9c7d\u9ce5\u9e1f\u5202",de:"\u7684\u5730\u5f97\u5fb7\u5e95\u951d\u561a\u5fb3\u6074\u60b3\u60ea\u68cf\u6dc2\u767b\u9340\u965f",dei:"\u5f97\u54cb",dem:"\u63fc",den:"\u6265\u627d",deng:"\u7b49\u706f\u9093\u767b\u6f84\u77aa\u51f3\u8e6c\u78f4\u956b\u5654\u5d9d\u6225\u7c26\u50dc\u58b1\u5b01\u6195\u6a59\u6ac8\u71c8\u7492\u7af3\u8260\u89b4\u8c4b\u9127\u9419\u96a5",di:"\u5730\u7b2c\u5e95\u4f4e\u654c\u62b5\u6ef4\u5e1d\u9012\u5ae1\u5f1f\u7f14\u5824\u7684\u6da4\u63d0\u7b1b\u8fea\u72c4\u7fdf\u8482\u89cc\u90b8\u8c1b\u8bcb\u5600\u67e2\u9ab6\u7f9d\u6c10\u68e3\u7747\u5a23\u837b\u78b2\u955d\u577b\u7c74\u7825\u4efe\u4fe4\u5059\u50c0\u5125\u52fa\u538e\u5467\u5519\u5547\u5572\u557b\u5681\u5754\u5758\u57c5\u57ca\u57de\u5886\u5891\u58ac\u5943\u5a82\u5d7d\u5db3\u5ef8\u5f14\u5f1a\u5f24\u5f7d\u601f\u6178\u625a\u62de\u638b\u63e5\u6455\u6575\u65f3\u6753\u6755\u67a4\u688a\u6891\u6974\u6a00\u6d5f\u6e27\u6ecc\u710d\u7274\u7393\u73f6\u750b\u7590\u7731\u78ae\u78fe\u7976\u7998\u7bf4\u7cf4\u7d04\u7de0\u7ea6\u805c\u8091\u80dd\u8163\u828d\u82d0\u82d6\u839c\u83c2\u83e7\u84e7\u850b\u8510\u8515\u85cb\u85e1\u86b3\u8743\u87ae\u889b\u89bf\u89dd\u8a46\u8adf\u8ae6\u8c74\u8d7f\u8d86\u8e27\u8e36\u8e44\u8e4f\u8e62\u8ee7\u9010\u9013\u902e\u905e\u9069\u9070\u91f1\u926a\u9349\u93d1\u963a\u9684\u96b6\u976e\u97ae\u9814\u984c\u9898\u99b0\u9ae2\u9b04\u9b61\u9bf3\u9e10",dia:"\u55f2",dian:"\u70b9\u7535\u5e97\u6bbf\u6dc0\u6382\u98a0\u57ab\u7898\u60e6\u5960\u5178\u4f43\u975b\u6ec7\u7538\u8e2e\u94bf\u576b\u963d\u766b\u7c1f\u73b7\u5dc5\u765c\u4f54\u508e\u53a7\u5538\u57dd\u588a\u58c2\u594c\u5a5d\u5a70\u5d6e\u5dd3\u5dd4\u6242\u62c8\u6527\u6541\u655f\u6923\u69c7\u69d9\u6a42\u6a5d\u6cbe\u6d8e\u6e7a\u6fb1\u7414\u75f6\u7628\u7672\u78f9\u814d\u84a7\u8547\u8713\u8714\u8a40\u8e4e\u923f\u96fb\u9815\u985a\u985b\u9a54\u9ede\u9f7b\u4e36",diao:"\u6389\u9493\u53fc\u540a\u96d5\u8c03\u5201\u7889\u51cb\u9e1f\u94de\u94eb\u9cb7\u8c82\u4f04\u4f7b\u501c\u5200\u521f\u595d\u5b25\u5c4c\u5f14\u5f34\u5f6b\u625a\u6311\u6906\u6ba6\u6c48\u6dcd\u7431\u7639\u7797\u77f5\u7a20\u7a8e\u7ab5\u7ae8\u7c13\u7c9c\u7cf6\u7d69\u7da2\u7ef8\u839c\u84e7\u85cb\u866d\u86c1\u8729\u8a0b\u8a82\u8abf\u8d75\u8d99\u8df3\u8e14\u8efa\u8f7a\u91e3\u921f\u92b1\u92fd\u932d\u9443\u96ff\u98a9\u9aa0\u9b61\u9b89\u9bdb\u9ce5\u9ced\u9d43\u9d70\u9e3c\u9f26",die:"\u7239\u8dcc\u53e0\u789f\u8776\u8fed\u8c0d\u7252\u581e\u74de\u63f2\u8e40\u800b\u9cbd\u57a4\u558b\u4f5a\u54a5\u54cb\u5551\u5ccc\u5d3c\u5d7d\u5e49\u6022\u604e\u60f5\u621c\u6303\u6315\u6633\u66e1\u67e3\u696a\u69e2\u6b9c\u6c0e\u6cc6\u6d89\u6e09\u6e2b\u7243\u7573\u7582\u7589\u758a\u7723\u7730\u7a92\u7d70\u7ed6\u800a\u80c5\u81f3\u81f7\u8253\u82f5\u8728\u87b2\u890b\u8936\u893a\u8a44\u8adc\u8d83\u8dd5\u8dee\u8e22\u8e5b\u8efc\u8f76\u9421\u9435\u957b\u97a2\u9b99\u9c08\u9c28\u9cce\u8e2e",dim:"\u56b8",ding:"\u9876\u5b9a\u76ef\u8ba2\u53ee\u4e01\u9489\u9f0e\u952d\u753a\u738e\u94e4\u815a\u7887\u7594\u4ec3\u8035\u914a\u5576\u5960\u5975\u5d7f\u5e04\u5fca\u639f\u6917\u6c40\u6fce\u706f\u753c\u77f4\u78a0\u78f8\u8062\u827c\u8423\u8476\u85a1\u8670\u8a02\u91d8\u92cc\u9320\u9424\u976a\u9802\u9841\u98e3\u9964",diu:"\u4e22\u94e5\u4e1f\u92a9\u98a9",dong:"\u52a8\u4e1c\u61c2\u6d1e\u51bb\u51ac\u8463\u680b\u4f97\u606b\u5cd2\u9e2b\u578c\u80e8\u80f4\u7850\u6c21\u5cbd\u549a\u5032\u50cd\u51cd\u52d5\u52ed\u57ec\u58a5\u59db\u5a3b\u5b1e\u5cdd\u5d20\u5d2c\u6219\u630f\u63f0\u6638\u6771\u6850\u68df\u6c2d\u6db7\u6e69\u70d4\u71d1\u72eb\u752c\u7b17\u7b52\u7b69\u7bbd\u7d67\u8156\u82f3\u83c4\u856b\u8740\u8855\u8a77\u8acc\u8ff5\u916e\u9718\u99e7\u9a06\u9b97\u9bdf\u9d87\u9dab\u9f15\u5902",dou:"\u90fd\u6597\u8c46\u9017\u9661\u6296\u75d8\u515c\u8bfb\u86aa\u7aa6\u7bfc\u8538\u4e67\u4fb8\u5160\u51df\u5245\u543a\u5517\u6295\u65a3\u6793\u68aa\u6a77\u6bed\u6c00\u6d62\u6e0e\u7006\u7797\u7aac\u7ac7\u8130\u8254\u8373\u8b80\u903e\u90d6\u9158\u9161\u9204\u92c0\u94ad\u9597\u95d8\u9627\u9916\u997e\u9b25\u9b26\u9b2a\u9b2c\u9b2d",du:"\u8bfb\u5ea6\u6bd2\u6e21\u5835\u72ec\u809a\u9540\u8d4c\u7779\u675c\u7763\u90fd\u728a\u5992\u987f\u8839\u7b03\u561f\u6e0e\u691f\u724d\u9ee9\u9ad1\u828f\u5125\u51df\u5262\u526b\u5335\u53be\u5663\u571f\u5857\u59ac\u5b3b\u5b85\u5e3e\u6581\u6675\u668f\u6a1a\u6a1e\u6a50\u6add\u6bac\u6bb0\u6d9c\u7006\u7258\u72a2\u7368\u743d\u74c4\u76be\u776a\u79fa\u7ac7\u7afa\u7b01\u7be4\u7e9b\u8370\u8773\u8799\u8827\u88fb\u8961\u8969\u89a9\u8a6b\u8aad\u8b80\u8b9f\u8be7\u8c44\u8ced\u8d15\u918f\u9316\u934d\u937a\u945f\u9517\u95cd\u9607\u967c\u976f\u97c7\u97e3\u97e5\u9813\u9a33\u9ef7",duan:"\u6bb5\u77ed\u65ad\u7aef\u953b\u7f0e\u6934\u7145\u7c16\u5073\u526c\u5845\u5a8f\u5f56\u65b7\u6bc8\u7456\u78ab\u7bc5\u7c6a\u7dde\u8011\u8176\u846e\u890d\u8e39\u8e96\u935b\u9374",dui:"\u5bf9\u961f\u5806\u5151\u6566\u9566\u7893\u603c\u619d\u514a\u514c\u5796\u57fb\u5860\u593a\u596a\u5bfe\u5c0d\u5d5f\u619e\u61df\u6425\u6778\u6fe7\u6ffb\u7022\u7029\u75fd\u78d3\u794b\u7d90\u81ad\u85b1\u8b09\u8b48\u8b75\u8ffd\u9217\u92b3\u92ed\u931e\u939a\u9413\u941c\u9510\u966e\u968a\u9827\u9d2d",dul:"\u4e67",dun:"\u5428\u987f\u8e72\u58a9\u6566\u949d\u76fe\u56e4\u9041\u4e0d\u8db8\u6c8c\u76f9\u9566\u7905\u7096\u7818\u4f05\u4fca\u5678\u58aa\u58ff\u5e89\u5ff3\u60c7\u619e\u6489\u64b4\u696f\u6a54\u6f61\u71c9\u729c\u7364\u78b7\u815e\u816f\u8733\u8c5a\u8e32\u8e7e\u8e89\u9007\u906f\u920d\u9413\u941c\u9813\u9a50",duo:"\u591a\u6735\u593a\u8235\u5241\u579b\u8dfa\u60f0\u5815\u6387\u54c6\u9a6e\u5ea6\u8eb2\u8e31\u6cb2\u5484\u94ce\u88f0\u54da\u7f0d\u4eb8\u4edb\u514a\u514c\u5151\u51d9\u5234\u525f\u526b\u540b\u55a5\u5689\u56b2\u579c\u57f5\u58ae\u58af\u591b\u596a\u5972\u5aa0\u5af7\u5c2e\u5d1c\u5d9e\u619c\u6305\u6306\u6376\u63e3\u6553\u655a\u6560\u656a\u6736\u6742\u6755\u67a4\u67c1\u67c2\u67ee\u6857\u68f0\u692f\u6a62\u6bf2\u6cb0\u6cb1\u6fa4\u75e5\u787e\u7d9e\u8324\u88b3\u8a51\u8a83\u8c80\u8d93\u8de2\u8de5\u8dff\u8eb1\u8ec3\u90f8\u9132\u922c\u931e\u937a\u9438\u9517\u9640\u964a\u964f\u968b\u9693\u98ff\u9973\u99b1\u99c4\u9b0c\u9bb5\u9d7d\u9ede",e:"\u997f\u54e6\u989d\u9e45\u86fe\u627c\u4fc4\u8bb9\u963f\u904f\u5ce8\u5a25\u6076\u5384\u9102\u9507\u8c14\u57a9\u9537\u960f\u843c\u82ca\u8f6d\u5a40\u83aa\u9cc4\u989a\u816d\u6115\u5443\u5669\u9e57\u5c59\u4e9a\u4e9c\u4e9e\u4f2a\u4f6e\u4f89\u5054\u507d\u50de\u50eb\u530e\u533c\u537e\u542a\u545d\u54a2\u54b9\u54d1\u5516\u5548\u554a\u5550\u555e\u5641\u56d0\u56ee\u57ad\u57e1\u580a\u5828\u582e\u59b8\u59bf\u59f6\u5a3e\u5a3f\u5a95\u5c75\u5c8b\u5cc9\u5ce9\u5d3f\u5eb5\u5ec5\u60aa\u60e1\u6239\u6415\u6424\u6439\u64dc\u66f7\u6799\u690f\u6aee\u6b38\u6b5e\u6b79\u6b7a\u6d1d\u6d90\u6e42\u7380\u73f4\u7427\u75f7\u7692\u774b\u7808\u7810\u7828\u7835\u7846\u786a\u78c0\u7918\u80fa\u848d\u855a\u8601\u8685\u8741\u89a8\u8a1b\u8a7b\u8a90\u8ae4\u8b4c\u8b8d\u8c5f\u8edb\u8ef6\u8f35\u8fd7\u904c\u907b\u9091\u920b\u92e8\u9354\u9469\u959c\u95bc\u9628\u9638\u9698\u981e\u981f\u984d\u984e\u9913\u9929\u9a00\u9b32\u9b64\u9b65\u9c10\u9c2a\u9c77\u9d33\u9d48\u9d5d\u9d5e\u9d9a\u9f43\u9f76\u9f7e",en:"\u6069\u6441\u84bd\u55ef\u5940\u5cce\u717e\u9950\u5514",eng:"\u97a5",eo:"\u4ed2",eol:"\u4e7b",eom:"\u6b15",eos:"\u65d5",er:"\u800c\u4e8c\u8033\u513f\u9975\u5c14\u8d30\u6d31\u73e5\u9c95\u9e38\u4f74\u8fe9\u94d2\u4f95\u5150\u5152\u5235\u54a1\u5532\u5b2d\u5c12\u5c13\u5ccf\u5f0d\u5f10\u6752\u682d\u682e\u6a32\u6be6\u6d0f\u6e2a\u6fe1\u723e\u7cab\u800f\u804f\u80f9\u81d1\u834b\u85be\u8848\u88bb\u8a80\u8cae\u8cb3\u8db0\u8f00\u8f2d\u8f5c\u9087\u927a\u9651\u967e\u96ad\u990c\u99ec\u9af5\u9af6\u9b9e\u9d2f",fa:"\u53d1\u6cd5\u7f5a\u4f10\u4e4f\u7b4f\u9600\u73d0\u57a1\u781d\u4f71\u50a0\u59c2\u5ee2\u5f42\u62d4\u62e8\u64a5\u6830\u6a43\u6c4e\u6cb7\u6cdb\u704b\u743a\u75ba\u767a\u767c\u7782\u7b29\u7f70\u7f78\u8337\u855f\u85c5\u8cb6\u8d2c\u9197\u91b1\u9345\u95a5\u9aea\u9aee",fan:"\u53cd\u996d\u7ffb\u756a\u72af\u51e1\u5e06\u8fd4\u6cdb\u7e41\u70e6\u8d29\u8303\u6a0a\u85e9\u77fe\u9492\u71d4\u8629\u7548\u8543\u8e6f\u68b5\u5e61\u4eee\u4f0b\u51e2\u51e3\u52eb\u5325\u5643\u58a6\u597f\u5a4f\u5b0e\u5b0f\u5b14\u5fdb\u61a3\u6255\u62da\u65d9\u65db\u674b\u67c9\u68e5\u6953\u6a4e\u6c3e\u6c4e\u6e22\u6efc\u702a\u703f\u7169\u72bf\u74a0\u7568\u76d5\u792c\u7b32\u7b35\u7bc4\u7c53\u7c75\u7dd0\u7e59\u7fb3\u81b0\u8224\u8227\u8229\u85a0\u87e0\u881c\u88a2\u894e\u8a09\u8ca9\u8ed3\u8eec\u8f53\u8fba\u91e9\u9407\u98bf\u98dc\u98ef\u98f0\u9c55\u9ded\u6535\u72ad",fang:"\u653e\u623f\u9632\u7eba\u82b3\u65b9\u8bbf\u4eff\u574a\u59a8\u80aa\u94ab\u5f77\u90a1\u678b\u822b\u9c82\u5023\u531a\u57c5\u580f\u65ca\u6609\u6618\u661e\u6c78\u6dd3\u7265\u74ec\u7706\u772a\u794a\u7d21\u8684\u8a2a\u8dbd\u9201\u933a\u96f1\u9ae3\u9b74\u9c1f\u9cd1\u9d0b\u9dad",fei:"\u975e\u98de\u80a5\u8d39\u80ba\u5e9f\u532a\u5420\u6cb8\u83f2\u8bfd\u5561\u7bda\u871a\u8153\u6249\u5983\u6590\u72d2\u82be\u60b1\u9544\u970f\u7fe1\u69a7\u6ddd\u9cb1\u7eef\u75f1\u4ff7\u5255\u539e\u58a2\u595c\u5a53\u5a54\u5c5d\u5ec3\u5ee2\u602b\u62c2\u6632\u6683\u66ca\u670f\u676e\u67f9\u68d0\u6a43\u6a68\u6ae0\u6e04\u6ff7\u72bb\u7306\u7432\u75bf\u7648\u7829\u7953\u7b30\u7d3c\u7dcb\u7ecb\u80c7\u80cf\u80d0\u8300\u8307\u8409\u855c\u855f\u8561\u8730\u87e6\u88f4\u88f5\u88f6\u894f\u8ab9\u8cbb\u9428\u966b\u9745\u975f\u98db\u98dd\u9925\u99a1\u9a11\u9a1b\u9af4\u9be1\u9f23\u9f25",fen:"\u5206\u4efd\u82ac\u7c89\u575f\u594b\u6124\u7eb7\u5fff\u7caa\u915a\u711a\u5429\u6c1b\u6c7e\u68fc\u7035\u9cbc\u73a2\u507e\u9f22\u50e8\u532a\u55b7\u5674\u5746\u574b\u58b3\u5954\u596e\u59a2\u5c8e\u5e09\u5e69\u5f05\u610d\u61a4\u626e\u62da\u6543\u6610\u6706\u670c\u678c\u68a4\u68fb\u6a68\u6b55\u6fc6\u7083\u71cc\u71d3\u71d4\u7356\u76fc\u7793\u780f\u79ce\u7ad5\u7cde\u7d1b\u7f92\u7fb5\u7fc2\u80a6\u81b9\u8450\u84b6\u8561\u86a0\u86a1\u886f\u8a1c\u8c6e\u8c76\u8cc1\u8d32\u8eae\u8f52\u9216\u9300\u943c\u96ab\u96f0\u9812\u9881\u9934\u9959\u999a\u99a9\u9b75\u9c5d\u9cfb\u9ec2\u9efa\u9f16",feng:"\u98ce\u5c01\u9022\u7f1d\u8702\u4e30\u67ab\u75af\u51af\u5949\u8bbd\u51e4\u5cf0\u950b\u70fd\u781c\u4ff8\u9146\u8451\u6ca3\u552a\u4ef9\u5051\u50fc\u51e8\u51ec\u51ee\u57c4\u5838\u5906\u59a6\u5bf7\u5cef\u5d36\u6340\u6367\u6453\u687b\u6953\u6a92\u6ca8\u6cdb\u6d72\u6e22\u6e57\u6e84\u6f28\u7043\u7090\u7128\u7148\u71a2\u728e\u7326\u7412\u752e\u760b\u76fd\u78b8\u7bc8\u7d98\u7e2b\u80a8\u823d\u8242\u8391\u8615\u8634\u868c\u8982\u8af7\u8c4a\u8c50\u8cf5\u8d57\u9004\u9137\u92d2\u93bd\u93e0\u974a\u98a8\u98cc\u99ae\u9cef\u9cf3\u9d0c\u9d6c\u9e4f\u9eb7\u8985",fo:"\u4f5b\u4ecf\u4ef8\u5772\u68bb",fou:"\u5426\u7f36\u4e0d\u57ba\u599a\u70b0\u7d11\u7f39\u7f3b\u82a3\u8843\u96ec\u9d00",fu:"\u526f\u5e45\u6276\u6d6e\u5bcc\u798f\u8d1f\u4f0f\u4ed8\u590d\u670d\u9644\u4fef\u65a7\u8d74\u7f1a\u62c2\u592b\u7236\u7b26\u5b75\u6577\u8d4b\u8f85\u5e9c\u8150\u8179\u5987\u629a\u8986\u8f90\u80a4\u6c1f\u4f5b\u4fd8\u5085\u8ba3\u5f17\u6daa\u88b1\u5e02\u752b\u91dc\u812f\u8151\u961c\u5490\u9efc\u7829\u82fb\u8dba\u8dd7\u86a8\u82be\u9c8b\u5e5e\u832f\u6ecf\u8709\u62ca\u83d4\u8760\u9cc6\u876e\u7ec2\u7ecb\u8d59\u7f58\u7a03\u5310\u9eb8\u51eb\u6874\u83a9\u5b5a\u99a5\u9a78\u602b\u7953\u544b\u90db\u8299\u8274\u9efb\u4e0d\u4e40\u4ec5\u4f15\u4fcc\u4fdb\u5069\u506a\u51a8\u51b9\u521c\u5305\u5452\u5488\u54f9\u54fa\u5638\u577f\u5798\u57ba\u5831\u598b\u59c7\u5a10\u5a4f\u5a66\u5a8d\u5b0e\u5b14\u5b93\u5c03\u5caa\u5cca\u5dff\u5e17\u5f23\u5f73\u5f7f\u5fa9\u6000\u6024\u61ef\u6299\u634a\u636c\u638a\u64ab\u65c9\u678e\u67b9\u67ce\u67eb\u67ed\u683f\u68f4\u6928\u6931\u6991\u6c71\u6c95\u6cb8\u6ced\u6d11\u6ea5\u6f93\u70a5\u70f0\u7124\u739e\u73b8\u7408\u74b7\u7536\u7549\u7550\u7557\u7641\u76d9\u7806\u7954\u79a3\u79ff\u7a2a\u7ace\u7b30\u7b5f\u7b81\u7b99\u7c20\u7cb0\u7cd0\u7d28\u7d31\u7d3c\u7d65\u7d8d\u7d92\u7dee\u7e1b\u7e80\u7f66\u7fc7\u80d5\u819a\u8240\u82a3\u8300\u8342\u8374\u8386\u8409\u842f\u844d\u84f2\u8567\u8659\u86a5\u86b9\u86d7\u8705\u875c\u886d\u889a\u889d\u8907\u8914\u8946\u8965\u8984\u8a03\u8a42\u8ae8\u8c67\u8ca0\u8cbb\u8ce6\u8cfb\u8d39\u8e3e\u8ef5\u8f14\u8f39\u8f3b\u8fd8\u909a\u909e\u90cd\u90d9\u911c\u915c\u917b\u91e1\u9207\u9258\u925c\u9307\u9351\u9362\u952b\u961d\u965a\u97b4\u97cd\u97db\u97e8\u982b\u98ab\u98b0\u99d9\u9af4\u9b34\u9b84\u9b92\u9bb2\u9c12\u9ce7\u9cec\u9cfa\u9d14\u9d69\u9d9d\u9ea9\u9eac\u9eb1",ga:"\u5676\u80f3\u5939\u560e\u5496\u8f67\u9486\u4f3d\u65ee\u5c2c\u5c15\u5c1c\u5477\u5620\u738d\u8ecb\u91d3\u9337\u9b40",gad:"\u7534",gai:"\u8be5\u6539\u76d6\u6982\u9499\u82a5\u6e89\u6224\u5793\u4e10\u9654\u8d45\u4e62\u4f85\u5303\u5304\u54b3\u59df\u5cd0\u5fcb\u6461\u6650\u675a\u6838\u69e9\u69ea\u6c7d\u6f11\u74c2\u7561\u78d1\u7974\u7d60\u7d6f\u80f2\u8344\u8462\u84cb\u8a72\u8c65\u8cc5\u8ccc\u90c2\u9223\u9385\u95a1\u9602\u9623\u9691\u9ab8",gan:"\u8d76\u5e72\u611f\u6562\u7aff\u7518\u809d\u67d1\u6746\u8d63\u79c6\u65f0\u9150\u77f8\u75b3\u6cd4\u82f7\u64c0\u7ec0\u6a44\u6f89\u6de6\u5c34\u5769\u4e2a\u4e79\u4e7e\u4e81\u4ee0\u4f44\u501d\u51ce\u51f2\u5481\u5978\u5c32\u5c36\u5c37\u5e79\u5fd3\u625e\u634d\u653c\u687f\u69a6\u6a8a\u6c57\u6c75\u6d5b\u6f27\u7068\u7395\u73b5\u76af\u76f0\u7a08\u7b34\u7b78\u7be2\u7c33\u7c93\u7d3a\u8289\u8677\u8866\u8a4c\u8af4\u8c43\u8d11\u8d1b\u8d95\u8fc0\u91ec\u930e\u98e6\u9aad\u9b50\u9c14\u9c64\u9ce1\u9cf1",gang:"\u521a\u94a2\u7eb2\u6e2f\u7f38\u5c97\u6760\u5188\u809b\u625b\u7b7b\u7f61\u6206\u4ea2\u4f09\u51ae\u525b\u5808\u583d\u5ca1\u5d17\u6205\u6207\u6297\u6386\u68e1\u69d3\u6e9d\u7135\u7268\u7285\u72ba\u7598\u77fc\u7899\u7db1\u7f41\u7f53\u80ae\u91ed\u92fc\u93a0\u962c\u980f\u9883",gao:"\u9ad8\u641e\u544a\u7a3f\u818f\u7bd9\u7f94\u7cd5\u9550\u768b\u90dc\u8bf0\u6772\u7f1f\u777e\u69d4\u9506\u69c1\u85c1\u52c2\u543f\u548e\u5930\u5cfc\u66a0\u69c0\u69f9\u6a70\u6aba\u6adc\u6d69\u6edc\u6f94\u734b\u7354\u7690\u776a\u796e\u7970\u799e\u7a01\u7a3e\u7b76\u7e1e\u7f99\u81ef\u83d2\u84bf\u85f3\u8aa5\u92ef\u93ac\u97df\u993b\u9ad9\u9dce\u9df1\u9f1b",ge:"\u4e2a\u5404\u6b4c\u5272\u54e5\u6401\u683c\u9601\u9694\u9769\u54af\u80f3\u845b\u86e4\u6208\u9e3d\u7599\u76d6\u5c79\u5408\u94ec\u784c\u9abc\u988c\u88bc\u5865\u867c\u572a\u9549\u4ee1\u8238\u9b32\u55dd\u8188\u643f\u7ea5\u54ff\u4ecb\u4f6b\u4f6e\u500b\u530c\u53ef\u5424\u5444\u5605\u5622\u5676\u5f41\u6105\u6213\u6228\u6262\u630c\u64f1\u654b\u675a\u69c5\u6aca\u6d69\u6ec6\u6ed2\u6f94\u726b\u7271\u72b5\u7332\u7366\u781d\u79f4\u7b87\u7d07\u8090\u81c8\u81f5\u8316\u83cf\u84cb\u86d2\u88d3\u89e1\u8a65\u8afd\u8b0c\u8f35\u8f55\u9240\u927b\u927f\u9391\u9398\u93b6\u94be\u94ea\u9598\u95a3\u95a4\u95f8\u9788\u97b7\u97d0\u97da\u981c\u9a14\u9ac2\u9b7a\u9ba5\u9baf\u9c2a\u9c84\u9d10\u9d1a\u9d3f\u9d45",gei:"\u7ed9",gen:"\u8ddf\u6839\u54cf\u831b\u4e98\u826e\u63ef\u6404",geng:"\u66f4\u8015\u9888\u6897\u803f\u5e9a\u7fb9\u57c2\u8d53\u9ca0\u54fd\u7ee0\u4e99\u4ea2\u522f\u5829\u5cfa\u6046\u632d\u63b6\u6685\u6929\u6d6d\u713f\u754a\u786c\u7d59\u7d5a\u7d86\u7dea\u7e06\u7fae\u8384\u83ee\u8ce1\u90a2\u90c9\u90e0\u9838\u9abe\u9bc1\u9d8a\u9e52",gib:"\u55bc",go:"\u55f0",gong:"\u5de5\u516c\u529f\u5171\u5f13\u653b\u5bab\u4f9b\u606d\u62f1\u8d21\u8eac\u5de9\u6c5e\u9f9a\u7ea2\u80b1\u89e5\u73d9\u86a3\u5311\u5314\u53b7\u54a3\u551d\u55ca\u5868\u5bae\u5e4a\u5efe\u6129\u6150\u62f2\u675b\u6760\u6831\u6e31\u7195\u78bd\u7be2\u7cfc\u7d05\u7fbe\u8679\u86e9\u89f5\u8ca2\u8d11\u8d1b\u8d63\u8eb3\u8f01\u92be\u978f\u9af8\u9b5f\u9f8f\u9f94",gou:"\u591f\u6c9f\u72d7\u94a9\u52fe\u8d2d\u6784\u82df\u57a2\u53e5\u5ca3\u5f40\u67b8\u97b2\u89cf\u7f11\u7b31\u8bdf\u9058\u5abe\u7bdd\u4f5d\u508b\u5193\u533a\u5340\u5474\u5778\u5920\u59e4\u6285\u62d8\u6406\u6480\u69cb\u6cc3\u6e9d\u7179\u73bd\u7c3c\u7df1\u8007\u8008\u8009\u8329\u86bc\u88a7\u8920\u89af\u8a3d\u8a6c\u8c70\u8c7f\u8cfc\u8ee5\u920e\u9264\u96ca\u97dd\u9b88\u9d1d\u9e1c\u9e32",gu:"\u53e4\u80a1\u9f13\u8c37\u6545\u5b64\u7b8d\u59d1\u987e\u56fa\u96c7\u4f30\u5495\u9aa8\u8f9c\u6cbd\u86ca\u8d3e\u83c7\u688f\u9e2a\u6c69\u8f71\u5d2e\u83f0\u9e44\u9e58\u94b4\u81cc\u9164\u5471\u9cb4\u8bc2\u726f\u77bd\u6bc2\u9522\u727f\u75fc\u89da\u86c4\u7f5f\u560f\u50a6\u50f1\u51c5\u52b7\u544a\u54cc\u5502\u5503\u5552\u55c0\u55d7\u580c\u5903\u5af4\u5c33\u5ce0\u5d13\u6018\u6132\u6262\u6287\u67af\u67e7\u68dd\u6996\u69be\u6a6d\u6ace\u6cd2\u6dc8\u6ed1\u6ff2\u7014\u7138\u74e0\u768b\u76b7\u76ec\u7872\u78c6\u797b\u7a12\u7a40\u7b1f\u7b9b\u7bd0\u7cd3\u7e0e\u7f5b\u7f96\u80cd\u8135\u81ef\u82e6\u82fd\u84c7\u85a3\u86cc\u8831\u89d2\u8a41\u8cc8\u8ef1\u8ef2\u8f42\u9027\u9232\u9237\u932e\u980b\u9867\u9936\u9989\u9ab0\u9b95\u9bdd\u9d23\u9d60\u9dbb\u9f14",gua:"\u6302\u522e\u74dc\u5be1\u5250\u8902\u5366\u5471\u80cd\u9e39\u681d\u8bd6\u518e\u526e\u5280\u53e7\u54b6\u54bc\u5569\u576c\u60f4\u639b\u6b44\u713b\u7171\u7d53\u7dfa\u7f63\u7f6b\u820c\u82fd\u8a7f\u8ae3\u8d8f\u8e3b\u929b\u92bd\u94e6\u98aa\u98b3\u9a27\u9d30\u62ec",guai:"\u602a\u62d0\u4e56\u63b4\u53cf\u54d9\u5672\u592c\u6060\u67b4\u67fa\u7b89\u7f6b",guan:"\u5173\u7ba1\u5b98\u89c2\u9986\u60ef\u7f50\u704c\u51a0\u8d2f\u68fa\u7eb6\u76e5\u77dc\u839e\u63bc\u6dab\u9ccf\u9e73\u500c\u4e31\u4e32\u535d\u5a60\u60b9\u60ba\u6163\u61fd\u645c\u65a1\u679c\u6844\u6a0c\u6aec\u6b0a\u6bcc\u6ca6\u6cf4\u6dc9\u6dea\u6f45\u721f\u742f\u74d8\u75ef\u761d\u764f\u77d4\u7936\u797c\u7aa4\u7b66\u7db8\u7f46\u8218\u83c5\u8416\u8484\u898c\u89b3\u89c0\u8cab\u8e80\u8f28\u9066\u9327\u93c6\u9475\u959e\u95a2\u95d7\u95dc\u96da\u9928\u9c25\u9c5e\u9c79\u9ce4\u9d4d\u9e1b",guang:"\u5149\u5e7f\u901b\u6844\u72b7\u54a3\u80f1\u4f8a\u4fc7\u50d9\u5799\u59ef\u5e83\u5ee3\u604d\u6269\u6304\u6497\u64f4\u6a2a\u6ace\u6b1f\u6d38\u6f62\u706e\u7097\u709a\u709b\u70e1\u7377\u73d6\u7844\u81e6\u81e9\u832a\u8daa\u8f04\u8fcb\u92a7\u9ec6",gui:"\u5f52\u8d35\u9b3c\u8dea\u8f68\u89c4\u7845\u6842\u67dc\u9f9f\u8be1\u95fa\u7470\u572d\u523d\u5080\u7678\u7094\u5e8b\u5b84\u6867\u523f\u9cdc\u9c91\u7688\u5326\u59ab\u6677\u7c0b\u7085\u4e80\u4f2a\u4f79\u507d\u50de\u528a\u528c\u532d\u532e\u5331\u53ac\u54c7\u579d\u59fd\u5a03\u5aaf\u5ae2\u5b00\u5da1\u5db2\u5dc2\u5e30\u5eaa\u5ec6\u6051\u646b\u648c\u6530\u6531\u660b\u6739\u6845\u691d\u6922\u6982\u69e3\u69f6\u69fb\u69fc\u6a9c\u6ac3\u6af0\u6af7\u6b78\u6c3f\u6ca9\u6d3c\u6e40\u6e8e\u6f59\u73ea\u749d\u74cc\u7650\u7786\u77a1\u77b6\u784a\u7948\u796a\u79ac\u7a90\u7b40\u7c02\u7d75\u7e6a\u7ed8\u80ff\u81ad\u8325\u84d5\u862c\u86eb\u879d\u87e1\u88bf\u8958\u898f\u89d6\u89e4\u8a6d\u8b09\u8cb4\u8d7d\u8db9\u8e76\u8ecc\u90bd\u90cc\u95a8\u9652\u9697\u96df\u97bc\u9a29\u9b36\u9b39\u9bad\u9c56\u9c65\u9cfa\u9d02\u9d03\u9f9c",gun:"\u6eda\u68cd\u8f8a\u9ca7\u886e\u78d9\u7ef2\u4e28\u60c3\u68de\u6d51\u6df7\u6e3e\u6efe\u742f\u74ad\u7754\u7774\u7dc4\u7df7\u84d8\u8509\u889e\u88f7\u8b34\u8f25\u9315\u951f\u9b8c\u9bc0\u9c25\u9ccf",guo:"\u8fc7\u56fd\u679c\u88f9\u9505\u90ed\u6da1\u57da\u6901\u8052\u9998\u7313\u5d1e\u63b4\u5e3c\u5459\u8662\u873e\u8748\u5212\u54b6\u54bc\u552c\u556f\u5613\u56d7\u56ef\u56f6\u56fb\u5700\u570b\u57fb\u581d\u588e\u5e57\u5f49\u5f4d\u60c8\u6156\u6413\u6451\u654b\u67b8\u6947\u69e8\u6ace\u6d3b\u6dc9\u6e26\u6f0d\u6fc4\u7611\u77cc\u7c02\u7cbf\u7db6\u805d\u8142\u8158\u8195\u83d3\u852e\u872e\u8778\u87c8\u8803\u8901\u8f20\u904e\u921b\u9301\u934b\u9439\u951e\u991c\u9983",ha:"\u54c8\u86e4\u867e\u94ea\u4e37\u5413\u5475\u5964\u598e\u70ba\u736c\u8766\u927f",hai:"\u8fd8\u6d77\u5bb3\u54b3\u6c26\u5b69\u9a87\u9ab8\u4ea5\u55e8\u91a2\u80f2\u4f85\u548d\u54b4\u55d0\u56a1\u5870\u62f8\u6b2c\u70f8\u7332\u7d6f\u9084\u90c2\u917c\u95a1\u9602\u9826\u988f\u9900\u995a\u99ed\u99f4\u563f",hal:"\u4e64",han:"\u558a\u542b\u6c57\u5bd2\u6c49\u65f1\u9163\u97e9\u710a\u6db5\u51fd\u61a8\u7ff0\u7f55\u64bc\u634d\u61be\u608d\u90af\u9097\u83e1\u6496\u701a\u961a\u9878\u86b6\u7113\u9894\u6657\u9f3e\u4ee0\u4f44\u50bc\u516f\u51fe\u5382\u5388\u5481\u54fb\u5505\u5682\u5705\u57be\u5a22\u5ae8\u5c7d\u5d21\u5d45\u5d4c\u5fd3\u611f\u625e\u653c\u65f0\u6658\u6665\u66b5\u687f\u6892\u6937\u69a6\u6b26\u6b5b\u6c75\u6cd4\u6d5b\u6d6b\u6d86\u6dca\u6de6\u6ee9\u6f22\u6f89\u6f8f\u6fa3\u7058\u71af\u7233\u7302\u7400\u7518\u751d\u7694\u7745\u77f8\u7b12\u7b68\u7cee\u80a3\u839f\u850a\u862b\u8677\u86ff\u872c\u872d\u8792\u8b40\u8c3d\u8c43\u8ed2\u8f69\u91ec\u9210\u92b2\u92ce\u92e1\u94a4\u9588\u95de\u95ec\u96d7\u976c\u97d3\u9807\u981c\u9837\u9844\u9869\u99a0\u99af\u99fb\u9b2b\u9b7d\u9cf1\u9dbe",hang:"\u884c\u5df7\u822a\u592f\u676d\u542d\u9883\u6c86\u7ed7\u73e9\u57b3\u5994\u5ffc\u65bb\u6841\u7095\u72fc\u7b10\u7b55\u7d4e\u80ae\u82c0\u86a2\u8ca5\u8fd2\u909f\u9150\u980f\u9b67",hao:"\u597d\u53f7\u6d69\u568e\u58d5\u90dd\u6beb\u8c6a\u8017\u8c89\u9550\u660a\u98a2\u704f\u5686\u869d\u55e5\u7693\u84bf\u6fe0\u8585\u5090\u512b\u547a\u54e0\u552c\u5637\u5651\u599e\u604f\u608e\u6626\u6667\u66a0\u66a4\u66ad\u66cd\u6903\u6dcf\u6ec8\u6edc\u6f94\u705d\u7346\u734b\u768b\u769c\u769e\u76a1\u76a5\u777e\u79cf\u7ad3\u7c47\u7fef\u8055\u81a0\u81ef\u8320\u8583\u85a7\u85c3\u865f\u8660\u8814\u8ad5\u8b79\u9117\u9392\u93ac\u941e\u9865\u9c1d",he:"\u548c\u559d\u5408\u6cb3\u79be\u6838\u4f55\u5475\u8377\u8d3a\u8d6b\u8910\u76d2\u9e64\u83cf\u8c89\u9602\u6db8\u5413\u55ec\u52be\u76cd\u7fee\u9616\u988c\u58d1\u8bc3\u7ea5\u66f7\u4f6b\u5459\u547c\u548a\u54bc\u54c8\u54ec\u555d\u559b\u55c3\u55d1\u5648\u5687\u578e\u59c0\u5bb3\u5bc9\u5cc6\u60d2\u6112\u62b2\u630c\u63ed\u6546\u67c7\u683c\u6941\u6b31\u6bfc\u6d3d\u6e07\u6e2e\u6e34\u6e7c\u6f95\u7103\u7142\u7186\u7187\u71fa\u7200\u72b5\u72e2\u764b\u76ac\u76c7\u76c9\u7845\u788b\u7909\u79f4\u7bd5\u7c7a\u7cad\u7d07\u7e73\u7f34\u7fef\u82db\u8402\u85c3\u85ff\u86b5\u874e\u879b\u881a\u8894\u8988\u8a36\u8a38\u8a65\u8b1e\u8c88\u8cc0\u8f05\u8f44\u8f82\u8f96\u90c3\u924c\u9449\u95a1\u95d4\u960b\u96ba\u970d\u974d\u974e\u974f\u97a8\u981c\u9904\u9932\u9978\u9b29\u9b7a\u9c84\u9d60\u9da1\u9dae\u9db4\u9e16\u9e44\u9e56\u9ea7\u9f43\u9f55\u9f81\u9fa2",hei:"\u9ed1\u55e8\u5b12\u6f76\u9ed2\u563f",hen:"\u5f88\u72e0\u6068\u75d5\u4f77\u54cf\u5677\u62eb\u6380\u826e\u8a6a\u978e",heng:"\u6a2a\u6052\u54fc\u8861\u4ea8\u884c\u6841\u73e9\u8605\u4f77\u5548\u583c\u59ee\u6046\u6099\u6a6b\u6da5\u70c6\u72df\u80fb\u811d\u8a07\u9445\u9d34\u9d46\u9e3b",ho:"\u4e4a",hol:"\u4e65",hong:"\u7ea2\u8f70\u54c4\u8679\u6d2a\u5b8f\u70d8\u9e3f\u5f18\u8ba7\u8a07\u857b\u95f3\u85a8\u9ec9\u836d\u6cd3\u4edc\u53b7\u53ff\u5430\u543d\u54c5\u551d\u55ca\u569d\u57ac\u5985\u5a02\u5b96\u5c78\u5dc6\u5f4b\u6129\u63c8\u6494\u664e\u6c6a\u6c6f\u6d64\u6d72\u6e2f\u6e31\u6e39\u6f42\u6f8b\u6f92\u7074\u7122\u7392\u739c\u74e8\u7854\u7861\u7ad1\u7ae4\u7bca\u7ca0\u7d05\u7d18\u7d2d\u7d8b\u7eae\u7fbe\u7fc3\u7fdd\u803e\u823c\u82f0\u8452\u8453\u8a0c\u8b0d\u8c39\u8c3c\u8c3e\u8ee3\u8f37\u8f5f\u921c\u9277\u92be\u92d0\u9367\u958e\u95a7\u95c0\u95c2\u9710\u971f\u9783\u9b28\u9b5f\u9d3b\u9ecc",hou:"\u540e\u539a\u543c\u5589\u4faf\u5019\u7334\u9c8e\u7bcc\u5820\u5f8c\u9005\u7cc7\u9aba\u760a\u543d\u5474\u5795\u5e3f\u6d09\u72bc\u777a\u77e6\u7fed\u7ff5\u8144\u8454\u8a6c\u8bdf\u8c5e\u90c8\u9107\u9297\u936d\u9931\u9b9c\u9bf8\u9c5f\u9c98\u9f41",hu:"\u6e56\u6237\u547c\u864e\u58f6\u4e92\u80e1\u62a4\u7cca\u5f27\u5ffd\u72d0\u8774\u846b\u6caa\u4e4e\u620f\u6838\u548c\u745a\u552c\u9e55\u51b1\u6019\u9e71\u7b0f\u623d\u6248\u9e58\u6d52\u795c\u9190\u7425\u56eb\u70c0\u8f77\u74e0\u7173\u659b\u9e44\u7322\u60da\u5cb5\u6ef9\u89f3\u553f\u69f2\u4e55\u4fff\u51b4\u5322\u532b\u5596\u55c0\u55c3\u5611\u561d\u569b\u5780\u58f7\u58fa\u59f1\u5a5f\u5aa9\u5aed\u5aee\u5be3\u5e0d\u5e60\u5f16\u6018\u6057\u622f\u6231\u6232\u6236\u6238\u6287\u6430\u6462\u64ed\u6608\u6612\u66f6\u6791\u695b\u695c\u69f4\u6b51\u6bbb\u6c69\u6c7b\u6c8d\u6cd8\u6d3f\u6dc8\u6df2\u6df4\u6eec\u6ef8\u6fe9\u702b\u7100\u71a9\u74e1\u74f3\u7910\u7a6b\u7b8e\u7bb6\u7c04\u7c90\u7d57\u7d94\u7e0e\u7e0f\u7e20\u7fbd\u80cd\u81b4\u8217\u8290\u8294\u82a6\u82b4\u82e6\u82f8\u8400\u851b\u8530\u864d\u8656\u865d\u879c\u885a\u89f7\u8a31\u8b3c\u8b77\u8bb8\u8c70\u8ee4\u9120\u9237\u92d8\u933f\u9359\u9378\u94b4\u96ba\u96c7\u96d0\u96fd\u97c4\u9800\u9836\u992c\u9b0d\u9b71\u9bf1\u9c17\u9c6f\u9ce0\u9cf8\u9d29\u9d60\u9d98\u9da6\u9dae\u9dbb\u9e0c",hua:"\u8bdd\u82b1\u5316\u753b\u534e\u5212\u6ed1\u54d7\u733e\u8c41\u94e7\u6866\u9a85\u7809\u4f89\u5283\u5290\u542a\u54c7\u5629\u57d6\u59e1\u5a72\u5a73\u5aff\u5b05\u5b66\u5b78\u5d0b\u627e\u6433\u6466\u64b6\u654c\u6779\u691b\u69ec\u6a3a\u6ab4\u6d4d\u6f85\u6fae\u736a\u748d\u756b\u7575\u7874\u78c6\u7a1e\u7cbf\u7cc0\u7e63\u8142\u8219\u82b2\u83ef\u848d\u8550\u8624\u8633\u8796\u89df\u8a71\u8aae\u8ad9\u8ae3\u8b41\u8b6e\u8f20\u91ea\u91eb\u92d8\u9335\u93f5\u9a4a\u9b64\u9bad\u9c91\u9de8\u9eca",huai:"\u574f\u6000\u6dee\u69d0\u5f8a\u5212\u8e1d\u4f6a\u54b6\u559f\u5633\u5733\u576f\u58ca\u58de\u61d0\u61f7\u6af0\u7024\u8032\u8639\u863e\u8922\u8931",huan:"\u6362\u8fd8\u5524\u73af\u60a3\u7f13\u6b22\u5e7b\u5ba6\u6da3\u7115\u8c62\u6853\u75ea\u6f36\u737e\u64d0\u902d\u9ca9\u90c7\u9b1f\u5bf0\u5942\u953e\u571c\u6d39\u8411\u7f33\u6d63\u559a\u559b\u56be\u5702\u57b8\u581a\u5950\u5b49\u5bcf\u5cd8\u5d48\u5ddc\u610c\u61c1\u61fd\u63db\u63f4\u650c\u6899\u69f5\u6b25\u6b53\u6b61\u6c4d\u6e19\u6f45\u6fa3\u6fb4\u704c\u70c9\u7165\u72bf\u72df\u744d\u7457\u74b0\u74db\u7613\u7696\u7729\u7746\u7754\u778f\u77a3\u7ceb\u7d59\u7d84\u7de9\u7e6f\u7fa6\u8092\u8118\u8341\u8408\u849d\u85e7\u878c\u8838\u8b99\u8c69\u8c72\u8c86\u8c9b\u8f10\u8f58\u9084\u9144\u926e\u9370\u9436\u956e\u95e4\u961b\u96c8\u96da\u9a69\u9bc7\u9bf6\u9c00\u9d05\u9d4d\u9e1b\u9e6e\u9e73",huang:"\u9ec4\u614c\u6643\u8352\u7c27\u51f0\u7687\u8c0e\u60f6\u8757\u78fa\u604d\u714c\u5e4c\u968d\u8093\u6f62\u7bc1\u5fa8\u9cc7\u9051\u7640\u6e5f\u87e5\u749c\u505f\u5164\u55a4\u582d\u5843\u58b4\u595b\u5a93\u5bba\u5d32\u5ddf\u6033\u6130\u63d8\u6644\u66c2\u671a\u697b\u69a5\u6ace\u6c7b\u6d38\u6ec9\u70be\u7180\u71bf\u720c\u735a\u745d\u769d\u76a9\u7a54\u7e28\u824e\u8292\u832b\u845f\u8841\u8a64\u8afb\u8b0a\u8daa\u9360\u93a4\u9404\u953d\u97f9\u992d\u9a1c\u9c09\u9c51\u9dec\u9ec3",hui:"\u56de\u4f1a\u7070\u7ed8\u6325\u6c47\u8f89\u6bc1\u6094\u60e0\u6666\u5fbd\u6062\u79fd\u6167\u8d3f\u86d4\u8bb3\u5f8a\u5349\u70e9\u8bf2\u5f57\u6d4d\u73f2\u8559\u5599\u605a\u54d5\u6656\u96b3\u9ebe\u8bd9\u87ea\u8334\u6d04\u54b4\u867a\u835f\u7f0b\u4f6a\u50e1\u5136\u532f\u53c0\u5612\u5645\u5655\u5666\u5696\u56d8\u56ec\u571a\u5815\u58ae\u58de\u5a4e\u5a88\u5b48\u5bed\u5c77\u5e51\u5ec6\u5efb\u5efd\u5f59\u5f5a\u5fbb\u605b\u6075\u6193\u61f3\u62fb\u63ee\u649d\u6689\u66b3\u6703\u6867\u6932\u694e\u69e5\u6a5e\u6a85\u6a93\u6a9c\u6ad8\u6bc0\u6bc7\u6cac\u6ccb\u6d03\u6da3\u6e4f\u6ed9\u6f53\u6fae\u6fca\u7008\u7073\u70dc\u70e0\u70e3\u7147\u7152\u71ec\u71f4\u7369\u743f\u74a4\u74af\u75d0\u7623\u7693\u772d\u7762\u7773\u77ba\u7988\u7a62\u7bf2\u7d75\u7e62\u7e6a\u7fd9\u7fda\u7fec\u7ffd\u8294\u8490\u8527\u8588\u8589\u85f1\u862c\u8633\u866b\u8698\u86d5\u8716\u879d\u8886\u8918\u8958\u8a6f\u8a7c\u8aa8\u8af1\u8b53\u8b6d\u8b6e\u8b7f\u8c57\u8cc4\u8f1d\u8f20\u8fdd\u8ff4\u9025\u9055\u928a\u93f8\u942c\u95e0\u9613\u9693\u9767\u97bc\u97cb\u97e2\u97e6\u982e\u986a\u992f\u9bb0\u9c34\u9f3f\u9f40\u6e83",hun:"\u6df7\u660f\u8364\u6d51\u5a5a\u9b42\u960d\u73f2\u9984\u6eb7\u8be8\u4fd2\u5031\u5702\u5a6b\u5ff6\u60db\u60fd\u6141\u6325\u6346\u638d\u63ee\u6606\u662c\u68a1\u68b1\u68cd\u68d4\u6b99\u6dbd\u6e3e\u6e63\u6e77\u7104\u711d\u743f\u7703\u7767\u776f\u7dc4\u7dcd\u7de1\u7e49\u7ef2\u7f17\u8477\u8512\u89e8\u8ae2\u8f4b\u95bd\u9850\u991b\u992b\u9f32",huo:"\u6216\u6d3b\u706b\u4f19\u8d27\u548c\u83b7\u7978\u8c41\u970d\u60d1\u56af\u956c\u8020\u5290\u85ff\u6509\u952a\u8816\u94ac\u5925\u4f78\u4ff0\u5268\u5316\u5419\u548a\u549f\u55c0\u5684\u56bf\u596f\u59e1\u626e\u6347\u639d\u6409\u64ed\u65e4\u66e4\u6947\u6ab4\u6c8e\u6e71\u6f37\u6fca\u6fe9\u7016\u706c\u7103\u7372\u74e0\u7668\u7713\u77c6\u77d0\u790a\u798d\u79ee\u79f3\u7a6b\u7be7\u802f\u8158\u8195\u81db\u8267\u843f\u84a6\u8ad5\u8b0b\u8c70\u8ca8\u8d8a\u8d8f\u904e\u90a9\u9225\u9343\u944a\u9584\u96bb\u96d8\u9743\u9a1e\u9b4a",hwa:"\u593b",i:"\u4e41",ji:"\u51e0\u53ca\u6025\u65e2\u5373\u673a\u9e21\u79ef\u8bb0\u7ea7\u6781\u8ba1\u6324\u5df1\u5b63\u5bc4\u7eaa\u7cfb\u57fa\u6fc0\u5409\u810a\u9645\u6c72\u808c\u5ac9\u59ec\u7ee9\u7f09\u9965\u8ff9\u68d8\u84df\u6280\u5180\u8f91\u4f0e\u796d\u5242\u60b8\u6d4e\u7c4d\u5bc2\u671f\u5176\u5947\u5fcc\u9f50\u5993\u7ee7\u96c6\u7ed9\u9769\u51fb\u573e\u7b95\u8ba5\u7578\u7a3d\u75be\u58bc\u6d0e\u9c9a\u5c50\u9f51\u621f\u9cab\u5d47\u77f6\u7a37\u6222\u866e\u8bd8\u7b08\u66a8\u7b04\u525e\u53fd\u84ba\u8dfb\u5d74\u638e\u8dfd\u9701\u5527\u757f\u8360\u7620\u7391\u7f81\u4e0c\u5048\u82a8\u4f76\u8d4d\u696b\u9afb\u54ad\u857a\u89ca\u9e82\u9aa5\u6b9b\u5c8c\u4e9f\u7284\u4e69\u82b0\u54dc\u4e2e\u4e41\u4ebc\u4f0b\u501a\u506e\u50df\u517e\u5209\u520f\u5264\u5291\u52e3\u5359\u535f\u537d\u539d\u53dd\u5407\u5470\u559e\u55d8\u5630\u568c\u5756\u578d\u5832\u5849\u588d\u5980\u59de\u59fc\u5c10\u5c45\u5c70\u5c8b\u5cdc\u5d46\u5daf\u5e3a\u5e7e\u5eb4\u5eed\u5f50\u5f51\u5f76\u5f9b\u5fe3\u60ce\u6131\u61bf\u61e0\u61fb\u63d6\u63e4\u6483\u64a0\u64bd\u64ca\u64e0\u6532\u6567\u65e1\u65e3\u66a9\u66c1\u6785\u689e\u68cb\u6956\u6975\u69c9\u69e3\u6a2d\u6a5f\u6a76\u6a95\u6a9d\u6ab5\u6ac5\u6aed\u6bc4\u6c65\u6cf2\u6d01\u6dc1\u6e08\u6e52\u6f03\u6f08\u6f57\u6fc8\u6fdf\u7031\u710f\u72b1\u72e4\u7317\u7482\u74a3\u74be\u755f\u75b5\u75f5\u7635\u7660\u766a\u7680\u768d\u777d\u7789\u77bf\u78ef\u799d\u79a8\u79f8\u7a18\u7a29\u7a44\u7a4a\u7a4d\u7a56\u7a67\u7b53\u7bbf\u7c0a\u7c0e\u7ca2\u7ced\u7d00\u7d12\u7d1a\u7d50\u7d66\u7d99\u7ddd\u7e18\u7e3e\u7e4b\u7e6b\u7e7c\u7ed3\u7f7d\u7f87\u7f88\u8024\u802d\u80d4\u8114\u8128\u818c\u81ee\u8265\u827b\u82b6\u82d9\u830d\u8324\u838b\u8401\u8415\u846a\u84a9\u8507\u8540\u8572\u858a\u85ba\u85c9\u8604\u860e\u862e\u863b\u8640\u8721\u874d\u878f\u87e3\u87fb\u87ff\u8800\u88da\u8900\u8940\u894b\u8989\u898a\u8998\u89ac\u89bf\u89c7\u89cc\u89d9\u89ed\u8a08\u8a10\u8a18\u8a8b\u8ac5\u8ad4\u8b4f\u8b64\u8ba6\u8c3b\u8c3f\u8ceb\u8cf7\u8d8c\u8d9e\u8dc2\u8de1\u8e11\u8e16\u8e26\u8e50\u8e5f\u8e8b\u8ea4\u8eb8\u8f2f\u8f5a\u90c5\u90c6\u913f\u9288\u92a1\u9324\u9353\u93f6\u9416\u9447\u9459\u9694\u969b\u96ae\u96de\u96e6\u96e7\u9735\u973d\u978a\u97bf\u97f2\u98b3\u98e2\u9951\u9a0e\u9a65\u9a91\u9b3e\u9b5d\u9b62\u9b65\u9b86\u9bda\u9bef\u9bfd\u9c36\u9c3f\u9c40\u9c6d\u9c7e\u9cee\u9d4b\u9d8f\u9dba\u9dc4\u9dd1\u9e04\u9e61\u9f4a\u9f4c\u9f4d\u9f4e\u9f4f",jia:"\u5bb6\u52a0\u5047\u4ef7\u67b6\u7532\u4f73\u5939\u5609\u9a7e\u5ac1\u67b7\u835a\u988a\u94be\u7a3c\u8304\u8d3e\u94d7\u846d\u8fe6\u621b\u6d43\u9553\u75c2\u605d\u5cac\u8dcf\u560f\u4f3d\u80db\u7b33\u73c8\u7615\u90cf\u8888\u86f1\u50a2\u50f9\u53da\u5477\u5496\u550a\u573f\u57c9\u590f\u5913\u593e\u5a7d\u5b8a\u5e4f\u5fa6\u5fe6\u621e\u6274\u62b8\u62bc\u62c1\u62ee\u6308\u631f\u633e\u63e9\u63f3\u64d6\u659a\u659d\u6687\u689c\u6935\u698e\u69a2\u69da\u6a9f\u6be0\u6cc7\u6d79\u728c\u7330\u7333\u73be\u7b74\u7cd8\u801e\u8125\u8175\u83a2\u86fa\u8766\u88b7\u88cc\u8c6d\u8c91\u8cc8\u8df2\u90df\u9240\u926b\u927f\u92cf\u93b5\u94ea\u9821\u982c\u9830\u9889\u9904\u9978\u99d5\u99f1\u9a86\u9ab1\u9d36\u9d4a\u9e9a",jian:"\u89c1\u4ef6\u51cf\u5c16\u95f4\u952e\u8d31\u80a9\u517c\u5efa\u68c0\u7bad\u714e\u7b80\u526a\u6b7c\u76d1\u575a\u5978\u5065\u8270\u8350\u5251\u6e10\u6e85\u6da7\u9274\u6d45\u8df5\u6361\u67ec\u7b3a\u4fed\u78b1\u7877\u62e3\u8230\u69db\u7f04\u8327\u996f\u7fe6\u97af\u620b\u8c0f\u726e\u67a7\u8171\u8dbc\u7f23\u641b\u622c\u6bfd\u83c5\u9ca3\u7b15\u8c2b\u6957\u56dd\u8e47\u88e5\u8e3a\u7751\u8b07\u9e63\u84b9\u50ed\u950f\u6e54\u4f9f\u4ff4\u5039\u5042\u5094\u50e3\u5109\u51bf\u524d\u5263\u5271\u528d\u528e\u5292\u5294\u558a\u56cf\u5805\u5811\u583f\u5879\u58b9\u59e6\u59e7\u5b71\u5bcb\u5e34\u5e75\u5f3f\u5f45\u5fa4\u60e4\u6214\u6229\u6338\u63c0\u63c3\u63f5\u64bf\u64f6\u6515\u65d4\u6695\u6701\u67d9\u682b\u6898\u691c\u6937\u693e\u6997\u6a2b\u6a4c\u6a4f\u6a7a\u6aa2\u6abb\u6afc\u6bb1\u6bb2\u6d0a\u6d80\u6dfa\u6e1b\u6e55\u6ee5\u6f38\u6f97\u6feb\u6ffa\u7010\u7033\u7038\u703d\u719e\u71b8\u724b\u728d\u730f\u73aa\u73d4\u744a\u7450\u76e3\u7777\u77af\u77b7\u77bc\u788a\u78f5\u7900\u7906\u791b\u7a34\u7b67\u7b8b\u7bb4\u7bef\u7c21\u7c48\u7c5b\u7ccb\u7d78\u7dd8\u7e11\u7e5d\u7e6d\u7e8e\u7e96\u7ea4\u807b\u81f6\u8266\u8271\u831b\u83fa\u844c\u844f\u8465\u852a\u8551\u8573\u85a6\u85c6\u8643\u87b9\u8812\u88b8\u8947\u8949\u897a\u898b\u89b5\u89b8\u8a43\u8ad3\u8aeb\u8b2d\u8b56\u8b7c\u8b7e\u8c2e\u8c5c\u8c63\u8cce\u8ce4\u8d9d\u8dc8\u8e10\u8f5e\u918e\u91b6\u91f0\u91fc\u9203\u9292\u92ad\u92c4\u92d1\u92fb\u9322\u932c\u933d\u934a\u9373\u9375\u93ab\u93e9\u9417\u9427\u9431\u9451\u9452\u946c\u946f\u9473\u9498\u94b1\u9592\u9593\u9669\u96aa\u976c\u97ac\u97c0\u97c9\u991e\u9930\u99a2\u9a2b\u9a9e\u9b0b\u9c0e\u9c14\u9c1c\u9c39\u9cd2\u9cfd\u9d73\u9dbc\u9e78\u9e79\u9e7b\u9e7c\u9e89\u9eda\u9eec\u5ef4",jiang:"\u5c06\u8bb2\u6c5f\u5956\u964d\u6d46\u50f5\u59dc\u9171\u848b\u7586\u5320\u5f3a\u6868\u8679\u8c47\u7913\u7f30\u729f\u8029\u7edb\u8333\u7ce8\u6d1a\u508b\u52e5\u531e\u5842\u58c3\u5905\u5968\u596c\u5c07\u5d79\u5f1c\u5f36\u5f37\u5f4a\u646a\u647e\u6762\u69f3\u6a7f\u6ae4\u6bad\u6ef0\u6f3f\u734e\u7555\u757a\u7585\u7ce1\u7d05\u7d73\u7e6e\u7ea2\u7fde\u8199\u8441\u8503\u8523\u8591\u8780\u87bf\u88b6\u8b1b\u8b3d\u91a4\u91ac\u97c1\u985c\u9c42\u9cc9",jiao:"\u53eb\u811a\u4ea4\u89d2\u6559\u8f83\u7f34\u89c9\u7126\u80f6\u5a07\u7ede\u6821\u6405\u9a84\u72e1\u6d47\u77eb\u90ca\u56bc\u8549\u8f7f\u7a96\u6912\u7901\u997a\u94f0\u9175\u4fa5\u527f\u5fbc\u827d\u50ec\u86df\u656b\u5ce4\u8de4\u59e3\u768e\u832d\u9e6a\u564d\u91ae\u4f7c\u6e6b\u9c9b\u6322\u4e54\u4fa8\u50d1\u50e5\u510c\u528b\u52e6\u52ea\u5374\u537b\u544c\u54ac\u55ac\u5602\u5604\u5610\u5626\u566d\u5996\u5af6\u5b0c\u5b13\u5b42\u5b66\u5b78\u5ce7\u5d7a\u5d95\u5da0\u5da3\u6054\u608e\u618d\u61a2\u61bf\u630d\u6341\u6477\u649f\u64b9\u652a\u654e\u6565\u657d\u657f\u65a0\u6648\u669e\u66d2\u6a14\u6a4b\u6af5\u6e6c\u6ed8\u6f16\u6f50\u6f86\u6fc0\u7042\u705a\u70c4\u7133\u714d\u71cb\u7365\u73d3\u74ac\u76a6\u76ad\u77ef\u7a3e\u7a5a\u7a8c\u7b05\u7b4a\u7c25\u7cfe\u7d5e\u7e73\u7e90\u7ea0\u8173\u81a0\u81b2\u81eb\u8281\u832e\u83fd\u8429\u854e\u85e0\u8660\u87dc\u87ed\u8990\u899a\u89ba\u8a06\u8b51\u8b65\u8ccb\u8dab\u8dad\u8e0b\u8e7b\u8f03\u8f47\u8f4e\u9117\u91c2\u91e5\u9278\u940e\u9903\u9a55\u9ab9\u9bab\u9c4e\u9d41\u9d64\u9de6\u9dee\u7e9f",jie:"\u63a5\u8282\u8857\u501f\u7686\u622a\u89e3\u754c\u7ed3\u5c4a\u59d0\u63ed\u6212\u4ecb\u9636\u52ab\u82a5\u7aed\u6d01\u75a5\u85c9\u4ef7\u6977\u79f8\u6854\u6770\u6377\u8beb\u776b\u5bb6\u5048\u6840\u5588\u62ee\u9ab1\u7faf\u86a7\u55df\u9889\u9c92\u5a55\u78a3\u8ba6\u5b51\u7596\u8bd8\u4e2f\u4ea5\u5022\u5047\u507c\u5091\u50f9\u5226\u5227\u523c\u52bc\u536a\u5424\u5527\u5536\u5551\u568c\u573e\u5826\u583a\u5951\u5979\u598e\u5a8e\u5a98\u5aab\u5ac5\u5c10\u5c46\u5c8a\u5c95\u5d28\u5d51\u5d65\u5db0\u5dbb\u5dc0\u5e6f\u5e8e\u5fa3\u5fe6\u6088\u6262\u62c5\u62fe\u63b2\u6429\u64d1\u64ee\u64f3\u65ba\u6605\u66a8\u66c1\u685d\u6904\u6950\u696c\u6976\u6982\u69a4\u69cb\u6a9e\u6aed\u6bd1\u6d2f\u6e07\u6e34\u6e5d\u6ed0\u6f54\u716f\u7297\u72e4\u736c\u73a0\u743e\u754d\u758c\u75ce\u7664\u780e\u781d\u790d\u7956\u7a2d\u7bc0\u7c4d\u7d07\u7d12\u7d50\u7d5c\u7e72\u7ea5\u8024\u813b\u8250\u83ad\u83e8\u84f5\u86e3\u86f6\u8710\u874d\u8754\u8818\u881e\u883d\u8871\u8878\u8893\u88b7\u88ba\u88d3\u892f\u89e7\u8a10\u8a70\u8aa1\u8ab1\u8b2f\u8d8c\u8df2\u8e15\u8ffc\u9263\u9347\u937b\u9534\u968e\u96c3\u9782\u978a\u9821\u98f7\u9aeb\u9b5d\u9b6a\u9b9a\u9d9b\u5369",jin:"\u8fdb\u8fd1\u4eca\u4ec5\u7d27\u91d1\u65a4\u5c3d\u52b2\u7981\u6d78\u9526\u664b\u7b4b\u6d25\u8c28\u5dfe\u895f\u70ec\u9773\u5ed1\u747e\u9991\u69ff\u887f\u5807\u8369\u77dc\u5664\u7f19\u537a\u5997\u8d46\u89d0\u4f12\u4fad\u50c5\u50f8\u5118\u5153\u51da\u52a4\u52c1\u53aa\u541f\u552b\u568d\u57d0\u583b\u5890\u58d7\u5a5c\u5ae4\u5b10\u5b27\u5bd6\u5d9c\u5df9\u60cd\u616c\u6422\u65b3\u6649\u6783\u6997\u6b4f\u6ba3\u6d55\u6e8d\u6f0c\u6fc5\u6fdc\u7161\u71fc\u73d2\u740e\u743b\u7468\u74a1\u74b6\u76e1\u781b\u7972\u7afb\u7b12\u7d1f\u7d3e\u7dca\u7e09\u808b\u81f8\u8355\u83eb\u83f3\u84f3\u85ce\u89b2\u89d4\u8a21\u8b39\u8cee\u8d10\u9032\u91d2\u91ff\u92df\u9326\u9485\u9513\u9949\u99b8\u9e76\u9ec5\u9f7d",jing:"\u7adf\u9759\u4e95\u60ca\u7ecf\u955c\u4eac\u51c0\u656c\u7cbe\u666f\u8b66\u7ade\u5883\u5f84\u8346\u6676\u9cb8\u7cb3\u9888\u5162\u830e\u775b\u52b2\u75c9\u9756\u80bc\u734d\u9631\u8148\u5f2a\u522d\u61ac\u5a67\u80eb\u83c1\u5106\u65cc\u8ff3\u9753\u6cfe\u4e3c\u4eb0\u4ef1\u4fd3\u501e\u50b9\u512c\u51c8\u5244\u52a4\u52c1\u5753\u5755\u5759\u598c\u5a59\u5a5b\u5b91\u5de0\u5e5c\u5f33\u5f91\u61bc\u64cf\u65cd\u665f\u66bb\u66d4\u6871\u68b7\u6a78\u6aa0\u6b91\u6c0f\u6c6b\u6c6c\u6d44\u6d87\u6de8\u6fea\u701e\u70c3\u70f4\u71dd\u7304\u7377\u7484\u749f\u74a5\u75d9\u79d4\u7a09\u7a7d\u7ae7\u7aeb\u7af6\u7af8\u7b90\u7c87\u7d4c\u7d93\u8059\u811b\u834a\u8396\u845d\u873b\u87fc\u8aa9\u8e01\u9015\u9192\u92de\u93e1\u9649\u9658\u9751\u9752\u9758\u975a\u975c\u981a\u9834\u9838\u9895\u9a5a\u9be8\u9d5b\u9d81\u9d84\u9e96\u9ea0\u9f31",jiong:"\u7a98\u70af\u6243\u8fe5\u4fb0\u50d2\u5182\u518b\u518f\u56e7\u5770\u57a7\u57db\u5bad\u6244\u660b\u6cc2\u6d7b\u6f83\u7005\u7085\u70f1\u715a\u715b\u7192\u71b2\u71d1\u71db\u7d45\u7d97\u81e6\u81e9\u860f\u8614\u8927\u9008\u9284\u93a3\u9848\u988e\u99c9\u99eb",jiu:"\u5c31\u4e5d\u9152\u65e7\u4e45\u63ea\u6551\u7ea0\u8205\u7a76\u97ed\u53a9\u81fc\u7396\u7078\u548e\u759a\u8d73\u9e6b\u8e74\u50e6\u67e9\u6855\u9b0f\u9e20\u9604\u557e\u4e29\u4e46\u4e63\u5003\u5279\u52fc\u5313\u531b\u5336\u564d\u597a\u5ec4\u5ecf\u5ed0\u6101\u6166\u6344\u63c2\u63eb\u644e\u673b\u6766\u67fe\u6a1b\u6a5a\u6ba7\u6c3f\u6c63\u6e6b\u6e6c\u725e\u7542\u7a35\u7a4b\u7a8c\u7cfa\u7cfe\u7d24\u7e46\u7f2a\u820a\u820f\u841b\u8764\u9579\u97ee\u9b2e\u9be6\u9ce9\u9df2\u9e94\u9f68",jou:"\u6b0d",ju:"\u53e5\u4e3e\u5de8\u5c40\u5177\u8ddd\u952f\u5267\u5c45\u805a\u62d8\u83ca\u77e9\u6cae\u62d2\u60e7\u97a0\u72d9\u9a79\u4e14\u636e\u67dc\u6854\u4ff1\u8f66\u5480\u75bd\u8e1e\u70ac\u5028\u91b5\u88fe\u5c66\u728b\u82f4\u7aad\u98d3\u9514\u6910\u82e3\u741a\u63ac\u6998\u9f83\u8d84\u8392\u96ce\u907d\u6a58\u8e3d\u6989\u97ab\u949c\u8bb5\u67b8\u4ec7\u4f21\u4f5d\u4fb7\u4fe5\u5036\u50ea\u51a3\u51e5\u5287\u52ee\u530a\u544a\u5727\u5765\u57e7\u57fe\u58c9\u59d0\u59d6\u5a35\u5a36\u5a45\u5a6e\u5be0\u5c68\u5ca0\u5ca8\u5d0c\u5dc8\u5f06\u5fc2\u6007\u6010\u601a\u6133\u61c5\u61fc\u6285\u62e0\u62f1\u6319\u6336\u6344\u63c8\u63df\u64da\u64e7\u661b\u68ae\u6907\u6908\u6a8b\u6af8\u6b05\u6b6b\u6be9\u6bf1\u6cc3\u6ce6\u6d30\u6dba\u6dd7\u6e20\u6e68\u6fbd\u7117\u7123\u7220\u7291\u72ca\u73c7\u75c0\u7717\u77bf\u7820\u79df\u79ec\u7ab6\u7b65\u7bd3\u7c0d\u7c34\u7c67\u7c94\u7cb7\u7f5d\u801f\u8065\u8152\u81c4\u8209\u824d\u83f9\u842d\u8445\u848c\u849f\u84a9\u84fb\u851e\u861c\u8627\u8655\u8661\u86b7\u86c6\u871b\u87b6\u8893\u8977\u8a4e\u8aca\u8c66\u8c97\u8d89\u8d9c\u8da1\u8db3\u8dd4\u8dd9\u8dfc\u8e18\u8e6b\u8e7b\u8e86\u8eb9\u8ee5\u8f02\u90ad\u90b9\u90e5\u90f0\u90f9\u9112\u9139\u9245\u924f\u92e4\u92e6\u92f8\u943b\u9504\u95b0\u9671\u96cf\u96db\u98b6\u99cf\u99d2\u99f6\u9a55\u9a67\u9a84\u9b3b\u9b88\u9b8d\u9b94\u9c8f\u9d21\u9d59\u9d74\u9d8b\u9daa\u9f30\u9f33\u9f5f",juan:"\u5377\u5708\u5026\u9e43\u6350\u5a1f\u7737\u7ee2\u9104\u9529\u8832\u954c\u72f7\u684a\u6d93\u96bd\u52b5\u52cc\u52ec\u545f\u570f\u57cd\u57e2\u5946\u59e2\u5db2\u5dc2\u5e23\u5f2e\u6081\u60d3\u617b\u6372\u64d0\u6718\u688b\u68ec\u6ceb\u6dc3\u7106\u7367\u74f9\u7504\u7729\u7743\u774a\u7760\u7d6d\u7d79\u7e33\u7f65\u7f82\u8127\u8143\u81c7\u83e4\u8412\u8528\u854a\u854b\u8737\u88d0\u8948\u8b82\u8e21\u8eab\u92d1\u92d7\u9308\u93b8\u942b\u95c2\u96cb\u96df\u9799\u97cf\u98ec\u990b\u9d4d\u9d51",jue:"\u51b3\u7edd\u89c9\u89d2\u7235\u6398\u8bc0\u6485\u5014\u6289\u652b\u56bc\u811a\u6877\u5671\u6a5b\u55df\u89d6\u5282\u721d\u77cd\u9562\u7357\u73cf\u5d1b\u8568\u5658\u8c32\u8e76\u5b53\u53a5\u4e59\u4e85\u5095\u5214\u52ea\u5337\u53cf\u5437\u5573\u57c6\u58c6\u592c\u599c\u5b52\u5c48\u5c69\u5c6b\u5d2b\u5da1\u5da5\u5f21\u5f4f\u61a0\u61b0\u6204\u6317\u6354\u64a7\u658d\u67fd\u6a5c\u6b14\u6b2e\u6b8c\u6c12\u6c7a\u6cec\u6f4f\u704d\u7106\u7133\u71a6\u71cb\u7211\u7234\u72c2\u7383\u73a6\u73a8\u7474\u749a\u75a6\u761a\u77de\u77e1\u7804\u7a71\u7a74\u7d55\u7d76\u7e51\u7e58\u8173\u81c4\u82b5\u855d\u855e\u8673\u8697\u86d9\u87e8\u87e9\u883c\u88a6\u8990\u899a\u89ba\u89fc\u8a23\u8ab3\u8b4e\u8c9c\u8d7d\u8d89\u8db9\u8e77\u8e7b\u8ea9\u8f03\u8f83\u902b\u920c\u940d\u941d\u9481\u957c\u95cb\u95d5\u9615\u9619\u9792\u97bd\u99c3\u9a24\u9a99\u9ac9\u9c56\u9cdc\u9d02\u9d03\u9d8c\u9de2\u9fa3",jun:"\u519b\u541b\u5747\u83cc\u4fca\u5cfb\u9f9f\u7ae3\u9a8f\u94a7\u6d5a\u90e1\u7b60\u9e87\u76b2\u6343\u5101\u52fb\u5300\u5441\u57c8\u59f0\u5bef\u61cf\u6508\u65ec\u6659\u687e\u6c6e\u6fec\u710c\u711e\u71c7\u72fb\u73fa\u756f\u76b8\u76b9\u7885\u7b98\u7b9f\u8399\u8470\u8528\u8690\u8720\u8880\u89a0\u8a07\u8ecd\u921e\u9281\u929e\u92c6\u9355\u9656\u96bd\u96cb\u9915\u9982\u99ff\u9bb6\u9caa\u9d54\u9d55\u9d58\u9e8f\u9e95\u9f9c",ka:"\u5361\u5580\u54af\u5496\u80e9\u5494\u4f67\u547f\u57b0\u73c8\u8849\u88c3\u9272",kai:"\u5f00\u63e9\u51ef\u6168\u6977\u57b2\u5240\u950e\u94e0\u9534\u5ffe\u607a\u8488\u51f1\u5274\u52be\u52d3\u559d\u55ab\u5605\u5644\u584f\u5952\u5d66\u5e46\u6112\u6137\u613e\u669f\u6838\u6b2c\u6b2f\u6e07\u6e34\u6e98\u6fed\u708c\u708f\u70d7\u8849\u8c48\u8f06\u9347\u938e\u93a7\u9426\u958b\u95d3\u95ff\u96c9\u98bd",kal:"\u4e6b",kan:"\u770b\u780d\u582a\u520a\u5d4c\u574e\u69db\u52d8\u9f9b\u6221\u4f83\u77b0\u83b0\u961a\u5058\u519a\u51f5\u558a\u57f3\u583f\u586a\u5888\u5d01\u5d41\u60c2\u627b\u681e\u6abb\u6b3f\u6b41\u76e3\u77d9\u78aa\u78e1\u7af7\u83b6\u859f\u884e\u8b7c\u8f21\u8f31\u8f41\u8f57\u95de\u976c\u9851\u9921\u9985\u9f95",kang:"\u6297\u7095\u625b\u7ce0\u5eb7\u6177\u4ea2\u94aa\u95f6\u4f09\u531f\u56e5\u5751\u594b\u5add\u5d7b\u5ffc\u6443\u676d\u69fa\u6c86\u6f2e\u72ba\u780a\u7a45\u7c87\u8352\u8ebf\u909f\u9227\u93ee\u958c\u962c\u9aaf\u9c47",kao:"\u9760\u8003\u70e4\u62f7\u6832\u7292\u5c3b\u94d0\u4e02\u5d6a\u5f40\u6322\u641e\u649f\u6537\u69c0\u69c1\u6d18\u7105\u7187\u71fa\u7a3e\u85a7\u85f3\u8a04\u92ac\u9adb\u9bb3\u9bcc\u9c93",ke:"\u54b3\u53ef\u514b\u68f5\u79d1\u9897\u523b\u8bfe\u5ba2\u58f3\u6e34\u82db\u67ef\u78d5\u5777\u5475\u606a\u5ca2\u874c\u7f02\u86b5\u8f72\u7aa0\u94b6\u6c2a\u988f\u778c\u951e\u7a1e\u73c2\u9ac1\u75b4\u55d1\u6e98\u9a92\u524b\u52c0\u52ca\u533c\u5580\u5801\u5a14\u5c05\u5cc7\u5d51\u5d59\u5db1\u6088\u6118\u6119\u63e2\u6415\u6564\u69bc\u6a16\u6b2c\u6b41\u6bbb\u6bfc\u6e07\u6fed\u70a3\u7241\u7290\u75fe\u76cd\u7822\u785e\u78a3\u78a6\u78c6\u790a\u791a\u7abc\u7c3b\u7dd9\u7fd7\u80e2\u8250\u842a\u8596\u8849\u8894\u8ab2\u8db7\u8efb\u9198\u9233\u927f\u9301\u9312\u94ea\u9515\u9826\u9846\u9a0d\u9f95",kei:"\u523b\u524b\u52c0\u52ca\u5c05",ken:"\u80af\u5543\u6073\u57a6\u88c9\u57a0\u58be\u61c7\u63af\u72e0\u73e2\u784d\u808e\u80bb\u8903\u8c64\u8c87\u9339\u980e\u9880\u9f66\u9f88",keng:"\u5751\u542d\u94ff\u52a5\u5748\u595f\u5994\u5fd0\u6333\u63c1\u647c\u6bb8\u727c\u7841\u784d\u784e\u785c\u787b\u80eb\u811b\u8a99\u8e01\u927a\u92b5\u935e\u93d7\u94d2\u962c",ki:"\u603e",kong:"\u7a7a\u5b54\u63a7\u6050\u5025\u5d06\u7b9c\u57ea\u5b86\u60be\u690c\u6db3\u77fc\u787f\u7a79\u7fab\u8154\u8ebb\u9313\u979a\u9d7c",kos:"\u5ee4",kou:"\u53e3\u6263\u62a0\u5bc7\u853b\u82a4\u770d\u7b58\u53e9\u4f5d\u51a6\u527e\u52b6\u59aa\u5ad7\u5bbc\u5f44\u6010\u630e\u6473\u6542\u6bc6\u6e9d\u6ef1\u7717\u7789\u7798\u7a9b\u7ad8\u7c06\u8320\u8532\u91e6\u93c2\u9dc7",ku:"\u54ed\u5e93\u82e6\u67af\u88e4\u7a9f\u9177\u5233\u9ab7\u55be\u5800\u7ed4\u4fc8\u53e4\u56b3\u5710\u5723\u5d2b\u5eab\u625d\u630e\u6341\u6398\u6430\u670f\u684d\u695b\u6ccf\u7105\u72dc\u7614\u77fb\u785e\u79d9\u7a8b\u7d5d\u80d0\u88b4\u8932\u8db6\u8dcd\u8de8\u90c0\u9bac\u9f41",kua:"\u8de8\u57ae\u630e\u5938\u80ef\u4f89\u54b5\u59f1\u6057\u6647\u6947\u7d53\u823f\u83ef\u8550\u8894\u8a87\u9299\u9301\u951e\u985d\u9abb\u9ac1",kuai:"\u5feb\u5757\u7b77\u4f1a\u4fa9\u54d9\u84af\u6d4d\u90d0\u72ef\u810d\u5080\u5108\u51f7\u5672\u5726\u584a\u58a4\u5ddc\u5ee5\u64d3\u65dd\u6703\u6fae\u736a\u74af\u7ce9\u81be\u8489\u8562\u9136\u99c3\u9b20\u9b41\u9c60\u9c99",kuan:"\u5bbd\u6b3e\u9acb\u5b8c\u5bdb\u5bec\u68a1\u68f5\u6b35\u6b40\u7abd\u7abe\u9467\u9846\u9897\u9ad6",kuang:"\u77ff\u7b50\u72c2\u6846\u51b5\u65f7\u5321\u7736\u8bf3\u909d\u7ea9\u593c\u8bd3\u5739\u8d36\u54d0\u4e31\u5123\u5144\u52bb\u5329\u535d\u58d9\u5cb2\u5ee3\u5ff9\u6047\u61ec\u61ed\u6282\u663f\u66e0\u6789\u6cc1\u6d2d\u6e5f\u720c\u72c5\u7716\u77cc\u783f\u7844\u78fa\u7926\u7a6c\u7b7a\u7d4b\u7d56\u7e8a\u8a86\u8a91\u8cba\u8ed6\u8ee0\u8ee6\u8eed\u8fcb\u901b\u90bc\u913a\u9271\u92db\u945b\u9d5f\u9ecb",kui:"\u4e8f\u6127\u594e\u7aa5\u8475\u9b41\u9988\u76d4\u5080\u5cbf\u532e\u6126\u63c6\u777d\u8dec\u8069\u7bd1\u55b9\u9035\u668c\u8489\u609d\u559f\u9997\u8770\u9697\u5914\u5232\u5331\u537c\u5633\u5abf\u5b07\u5c2f\u5dcb\u5dd9\u6192\u6223\u6646\u694f\u6951\u6a3b\u6ac6\u6b33\u6b78\u6ba8\u6f70\u7143\u77b6\u78c8\u7aba\u7c23\u7c44\u7f3a\u8067\u806d\u8075\u80ff\u8143\u81ad\u81fe\u848d\u8562\u85c8\u862c\u8637\u8641\u8667\u89d6\u8b09\u8e29\u8e5e\u8ea8\u9108\u9368\u9377\u9400\u944e\u95cb\u95da\u9615\u9803\u9804\u980d\u982f\u985d\u9877\u993d\u994b\u9a24\u9a99\u6e83",kun:"\u6346\u56f0\u6606\u5764\u9cb2\u951f\u9ae1\u7428\u918c\u9603\u6083\u5375\u5803\u5812\u58f8\u58fc\u5a6b\u5c21\u5d10\u5d11\u665c\u68b1\u6d83\u6df7\u6f49\u711c\u71b4\u7311\u747b\u774f\u7871\u7975\u7a07\u7a1b\u7d91\u7f64\u81d7\u83ce\u872b\u88c8\u88cd\u88e9\u890c\u8c64\u8c87\u9315\u95ab\u95b8\u9811\u987d\u991b\u9984\u9a09\u9ae0\u9ae8\u9be4\u9c25\u9ccf\u9d7e\u9da4\u9e4d\u9f66\u9f88",kuo:"\u9614\u6269\u5ed3\u9002\u86de\u681d\u4f1a\u5233\u54d9\u564b\u5672\u61d6\u62e1\u6304\u64f4\u6703\u6870\u6f37\u6ff6\u71ed\u7225\u79f3\u7b48\u843f\u8440\u909d\u913a\u95ca\u9729\u979f\u97b9\u97d5\u9822\u9afa\u9b20\u62ec",kweok:"\u7a52",kwi:"\u6af7",la:"\u62c9\u5566\u8fa3\u8721\u814a\u5587\u5783\u84dd\u843d\u760c\u908b\u782c\u524c\u65ef\u5120\u56b9\u63e6\u63e7\u641a\u647a\u64f8\u650b\u67c6\u694b\u6af4\u6e82\u7209\u74ce\u7669\u78d6\u7fcb\u81c8\u81d8\u83c8\u85de\u874b\u8772\u881f\u8fa2\u945e\u9574\u97a1\u9b0e\u9bfb\u9c72\u765e",lai:"\u6765\u8d56\u83b1\u6fd1\u8d49\u5d03\u6d9e\u94fc\u7c41\u5f95\u7750\u4f86\u4feb\u5008\u52d1\u53b2\u553b\u5a15\u5a61\u5d0d\u5eb2\u5fa0\u61f6\u650b\u68be\u68f6\u6af4\u6df6\u7028\u702c\u730d\u741c\u7669\u775e\u7b59\u7b82\u7c5f\u840a\u85fe\u8970\u8aba\u8cda\u8cf4\u9028\u90f2\u91d0\u9338\u983c\u9842\u9a0b\u9be0\u9d63\u9d86\u9eb3\u9ee7\u765e",lan:"\u84dd\u5170\u70c2\u62e6\u7bee\u61d2\u680f\u63fd\u7f06\u6ee5\u9611\u8c30\u5a6a\u6f9c\u89c8\u6984\u5c9a\u8934\u9567\u6593\u7f71\u6f24\u50cb\u5116\u53b1\u5549\u5682\u56d2\u5754\u58c8\u58cf\u5b3e\u5b44\u5b4f\u5d50\u5e71\u5ee9\u5eea\u60cf\u61d4\u61e2\u61f6\u64e5\u6514\u652c\u6595\u6695\u6b04\u6b16\u6b17\u6d68\u6d9f\u6e45\u6f23\u6feb\u703e\u7046\u7060\u7061\u70bc\u7149\u71d7\u71e3\u7201\u721b\u7224\u7226\u74bc\u74d3\u7937\u7c43\u7c63\u7cf7\u7e7f\u7e9c\u847b\u85cd\u862b\u862d\u8955\u8964\u8974\u897d\u89a7\u89bd\u8aeb\u8b4b\u8b95\u8c0f\u8e9d\u90f4\u9182\u946d\u9484\u95cc\u97ca\u9872",lang:"\u6d6a\u72fc\u5eca\u90ce\u6717\u6994\u7405\u7a02\u8782\u83a8\u5577\u9512\u9606\u8497\u4fcd\u52c6\u54f4\u5525\u57cc\u5871\u5acf\u5d00\u60a2\u6716\u6724\u6879\u6a03\u6a20\u6b34\u70fa\u746f\u7860\u7b64\u7fae\u7fb9\u813c\u8246\u84c8\u84e2\u870b\u8a8f\u8e09\u8eb4\u90d2\u90de\u92c3\u93af\u95ac\u99fa",lao:"\u8001\u635e\u7262\u52b3\u70d9\u6d9d\u843d\u59e5\u916a\u7edc\u4f6c\u6f66\u8022\u94f9\u91aa\u94d1\u5520\u6833\u5d02\u75e8\u50d7\u50da\u52b4\u52de\u54be\u54f0\u55e0\u5610\u562e\u5aea\u5d97\u6045\u61a5\u61a6\u6488\u64a9\u6725\u6a51\u6a6f\u6d76\u6f87\u72eb\u7360\u73ef\u7646\u7853\u78f1\u7a82\u7c29\u7ca9\u7d61\u802e\u8356\u84fc\u86ef\u87e7\u8ec2\u8f51\u92a0\u9412\u985f\u9add\u9bb1",le:"\u4e86\u4e50\u52d2\u808b\u9cd3\u4ec2\u53fb\u6cd0\u561e\u5fc7\u6250\u697d\u6a02\u6c3b\u725e\u738f\u7833\u7afb\u7c15\u827b\u961e\u97f7\u990e\u9979\u9c33",lei:"\u7c7b\u7d2f\u6cea\u96f7\u5792\u52d2\u64c2\u857e\u808b\u956d\u5121\u78ca\u7f27\u8bd4\u8012\u9179\u7fb8\u5ad8\u6a91\u561e\u50ab\u513d\u5362\u53bd\u54a7\u5841\u58d8\u58e8\u6502\u6a0f\u6ad0\u6ad1\u6b19\u6d21\u6d99\u6dda\u6f2f\u7045\u74c3\u757e\u7623\u7657\u76e7\u77cb\u78e5\u790c\u7927\u7928\u7971\u79b7\u7d6b\u7e32\u7e87\u7e8d\u7e9d\u7f4d\u8137\u8142\u8502\u854c\u85df\u8631\u8632\u863d\u8646\u881d\u8a84\u8b84\u8f60\u90f2\u9287\u9311\u9433\u9458\u9478\u9741\u981b\u982a\u985e\u98a3\u9c69\u9e13\u9f3a",li:"\u91cc\u79bb\u529b\u7acb\u674e\u4f8b\u54e9\u7406\u5229\u68a8\u5398\u793c\u5386\u4e3d\u540f\u783e\u6f13\u8389\u5088\u8354\u4fd0\u75e2\u72f8\u7c92\u6ca5\u96b6\u6817\u7483\u9ca4\u5389\u52b1\u7281\u9ece\u7bf1\u90e6\u9e42\u7b20\u575c\u82c8\u9ce2\u7f21\u8dde\u870a\u9502\u609d\u6fa7\u7c9d\u84e0\u67a5\u8821\u9b32\u5456\u783a\u5ae0\u7be5\u75a0\u75ac\u7301\u85dc\u6ea7\u9ca1\u623e\u680e\u5533\u91b4\u8f79\u8a48\u9a8a\u7f79\u9026\u4fea\u55b1\u96f3\u9ee7\u8385\u4fda\u86ce\u5a0c\u4ec2\u4f4d\u512e\u5137\u51d3\u5215\u5217\u5253\u527a\u5299\u52f5\u53a4\u53af\u53b2\u53d3\u53d5\u53fb\u550e\u569f\u56a6\u56c4\u56c7\u585b\u58e2\u5a33\u5a6f\u5b4b\u5b77\u5c74\u5ca6\u5cdb\u5cf2\u5dc1\u5ef2\u60a1\u60a7\u60b7\u6144\u6250\u625a\u6369\u642e\u64fd\u650a\u6526\u652d\u6584\u66a6\u66c6\u66de\u6738\u67c2\u6803\u681b\u6835\u68b8\u68c3\u68d9\u6a06\u6aaa\u6ad4\u6adf\u6aea\u6b10\u6b1a\u6b74\u6b77\u6c02\u6cb4\u6cb5\u6ce3\u6d6c\u6d96\u6dda\u6ffc\u6fff\u701d\u7051\u7055\u7204\u720f\u7282\u729b\u72a1\u73d5\u73de\u740d\u746e\u74c5\u74c8\u74d1\u74e5\u7658\u7667\u76aa\u76e0\u76ed\u775d\u77d6\u7805\u782c\u784c\u78ff\u792a\u792b\u7930\u79ae\u79b2\u79dd\u7a72\u7af0\u7b63\u7c6c\u7c9a\u7cb4\u7cce\u7cf2\u7d9f\u7e2d\u7e85\u7e9a\u7fee\u8137\u8243\u82d9\u8318\u8372\u83de\u849a\u849e\u853e\u85f6\u863a\u86b8\u86e0\u8727\u8755\u8777\u87cd\u87f8\u8807\u8823\u882b\u88cf\u88e1\u8935\u89fb\u8b27\u8b88\u8c4a\u8c8d\u8d72\u8e92\u8f62\u8f63\u908c\u9090\u9148\u91a8\u91c3\u91d0\u925d\u9290\u92eb\u92f0\u9305\u9311\u9398\u93eb\u9457\u9460\u94c4\u9549\u96b7\u96b8\u96e2\u973e\u9742\u974b\u98af\u98d2\u9a6a\u9b01\u9b34\u9bc9\u9bcf\u9bec\u9c67\u9c71\u9c73\u9c7a\u9ce8\u9d17\u9d79\u9dc5\u9e1d\u9e97\u9e9c",lia:"\u4fe9\u5006",lian:"\u8fde\u8054\u7ec3\u83b2\u604b\u8138\u70bc\u94fe\u655b\u601c\u5ec9\u5e18\u9570\u6d9f\u880a\u740f\u6b93\u8539\u9ca2\u5941\u6f4b\u81c1\u88e2\u6fc2\u88e3\u695d\u4eb7\u4ee4\u50c6\u5286\u5332\u5333\u55f9\u5652\u581c\u5969\u5a08\u5aa1\u5afe\u5b1a\u5b4c\u6169\u6190\u6200\u631b\u641b\u6459\u64bf\u6523\u6582\u68bf\u69cf\u69e4\u6ae3\u6b04\u6b5b\u6bae\u6d70\u6e45\u6e93\u6f23\u6fb0\u6fd3\u7032\u7149\u7191\u71eb\u7453\u7489\u77b5\u78cf\u7a34\u7c3e\u7c62\u7c68\u7df4\u7e3a\u7e9e\u7fb7\u7fb8\u7ff4\u8068\u806b\u806e\u806f\u81a6\u81c9\u82d3\u83b6\u8430\u84ee\u8595\u859f\u861d\u861e\u878a\u8933\u895d\u899d\u8b30\u8b67\u8e65\u9023\u913b\u91b6\u932c\u934a\u938c\u93c8\u942e\u9567\u96f6\u9b11\u9c0a\u9c31\u9c44",liang:"\u4e24\u4eae\u8f86\u51c9\u7cae\u6881\u91cf\u826f\u667e\u8c05\u4fe9\u7cb1\u589a\u9753\u8e09\u690b\u9b49\u83a8\u4e21\u4fcd\u5006\u501e\u5169\u54f4\u5521\u5562\u55a8\u60a2\u60ca\u639a\u6a11\u6dbc\u6e78\u7177\u7c17\u7ce7\u7da1\u7dc9\u813c\u870b\u873d\u88f2\u8ad2\u8e52\u8e63\u8f0c\u8f1b\u8f2c\u8f8c\u9344\u95ac\u9606\u975a\u99fa\u9b4e\u51ab",liao:"\u4e86\u6599\u64a9\u804a\u6482\u7597\u5ed6\u71ce\u8fbd\u50da\u5be5\u9563\u6f66\u948c\u84fc\u5c25\u5bee\u7f2d\u7360\u9e69\u5639\u4f6c\u50c7\u52b3\u52de\u5afd\u5c1e\u5c26\u5c6a\u5d7a\u5d9a\u5d9b\u5eeb\u6180\u61ad\u644e\u6579\u66b8\u6a1b\u6f3b\u7093\u720e\u7212\u7499\u7642\u77ad\u7ab7\u7ac2\u7c1d\u7e5a\u818b\u81ab\u87c9\u87df\u87e7\u8c42\u8cff\u8e58\u8e7d\u8f51\u907c\u911d\u91d5\u93d0\u9410\u9560\u957d\u98c2\u98c9\u9ace\u9def",lie:"\u5217\u88c2\u730e\u52a3\u70c8\u54a7\u57d2\u6369\u9b23\u8d94\u8e90\u51bd\u6d0c\u4f8b\u5008\u5120\u52a6\u52bd\u54f7\u57d3\u594a\u59f4\u5ce2\u5dc1\u5de4\u5fda\u6312\u6318\u64f8\u6817\u68d9\u6ad1\u6bdf\u6d56\u70ee\u716d\u71e4\u7204\u7209\u72a3\u731f\u7375\u7759\u7d9f\u8057\u811f\u818a\u81d8\u8322\u86da\u8ffe\u908b\u98b2\u9b1b\u9ba4\u9c72\u9d37",lin:"\u6797\u4e34\u6dcb\u90bb\u78f7\u9cde\u8d41\u541d\u62ce\u7433\u9716\u51db\u9074\u5d99\u853a\u7cbc\u9e9f\u8e8f\u8f9a\u5eea\u61d4\u77b5\u6aa9\u81a6\u5549\u4e83\u4efb\u4f08\u50ef\u51dc\u53b8\u58e3\u5d0a\u5ee9\u6061\u608b\u60cf\u61cd\u649b\u65b4\u667d\u66bd\u6a49\u6a81\u6d81\u6e17\u6ef2\u6f7e\u6f9f\u7036\u711b\u71d0\u735c\u73aa\u7498\u7510\u7584\u75f3\u765b\u765d\u7884\u7a1f\u7b96\u7ca6\u7e57\u7ff7\u81e8\u83fb\u85fa\u8cc3\u8e78\u8e99\u8eaa\u8f54\u8f65\u9130\u93fb\u95b5\u9634\u96a3\u9872\u9a4e\u9b7f\u9c57\u9e90",ling:"\u53e6\u4ee4\u9886\u96f6\u94c3\u73b2\u7075\u5cad\u9f84\u51cc\u9675\u83f1\u4f36\u7f9a\u68f1\u7fce\u86c9\u82d3\u7eeb\u74f4\u9143\u5464\u6ce0\u68c2\u67c3\u9cae\u8046\u56f9\u5030\u51b7\u5222\u577d\u590c\u59c8\u5a48\u5b41\u5cba\u5d1a\u5dba\u5f7e\u601c\u62ce\u6395\u6624\u670e\u6afa\u6b1e\u6de9\u6faa\u702e\u70a9\u71ef\u7227\u72d1\u740c\u768a\u7831\u78f7\u797e\u79e2\u7adb\u7b2d\u7d37\u7dbe\u8232\u84e4\u8506\u8576\u8626\u8851\u888a\u88ec\u8a45\u8dc9\u8ee8\u8f18\u91bd\u91d8\u9234\u9302\u9489\u959d\u963e\u970a\u9717\u971b\u971d\u9747\u9748\u9818\u99d6\u9b7f\u9bea\u9d12\u9e30\u9e77\u9ea2\u9f61\u9f62\u9f97",liu:"\u516d\u6d41\u7559\u5218\u67f3\u6e9c\u786b\u7624\u69b4\u7409\u998f\u788c\u9646\u7efa\u950d\u938f\u954f\u6d4f\u9a9d\u65d2\u9e68\u7198\u905b\u507b\u50c2\u5289\u56a0\u586f\u5ab9\u5b3c\u5d67\u5ec7\u61f0\u62a1\u65bf\u65c8\u6801\u685e\u687a\u6a4a\u6a6e\u6ca0\u6cd6\u6cf5\u6e38\u6f3b\u6f91\u700f\u71ae\u73cb\u7460\u746c\u74a2\u7542\u7544\u7571\u7581\u7645\u78c2\u78df\u7db9\u7f76\u7f80\u7fcf\u804a\u81a2\u848c\u84a5\u84c5\u84fc\u851e\u85f0\u87c9\u88d7\u8e53\u925a\u92f6\u93a6\u93d0\u9402\u94c6\u9560\u9678\u96e1\u9724\u98c0\u98c2\u98c5\u98d7\u993e\u99e0\u99f5\u9a2e\u9a51\u9b38\u9c21\u9db9\u9dda\u9e60\u9e8d",lo:"\u54af\u56d6",long:"\u9f99\u62e2\u7b3c\u804b\u9686\u5784\u5f04\u5499\u7abf\u9647\u5785\u80e7\u73d1\u830f\u6cf7\u680a\u7643\u783b\u5131\u5390\u54e2\u56a8\u58df\u58e0\u5ba0\u5bf5\u5c78\u5d90\u5dc3\u5dc4\u5e9e\u5fbf\u603b\u650f\u663d\u66e8\u6727\u6887\u69de\u6af3\u6e70\u6edd\u6f0b\u7027\u7216\u74cf\u772c\u77d3\u7866\u7931\u7932\u7ac9\u7adc\u7be2\u7bed\u7c60\u807e\u856f\u8622\u8755\u882a\u882c\u8856\u8971\u8c3e\u8c45\u8d1a\u8e98\u93e7\u9468\u96b4\u9733\u9747\u9a61\u9e17\u9f8d\u9f90\u9f92\u9f93",lou:"\u697c\u6402\u6f0f\u964b\u9732\u5a04\u7bd3\u507b\u877c\u9542\u848c\u8027\u9ac5\u55bd\u7618\u5d5d\u50c2\u560d\u587f\u5a41\u5be0\u5c5a\u5d81\u5ed4\u617a\u645f\u6a13\u6e87\u6f0a\u71a1\u7262\u750a\u763a\u763b\u779c\u7ab6\u7c0d\u802c\u81a2\u825b\u851e\u87bb\u8b31\u8ec1\u9071\u93e4\u97bb\u9acf",lu:"\u8def\u9732\u5f55\u9e7f\u9646\u7089\u5362\u9c81\u5364\u82a6\u9885\u5e90\u788c\u63b3\u7eff\u864f\u8d42\u622e\u6f5e\u7984\u9e93\u516d\u9c88\u680c\u6e0c\u84fc\u902f\u6cf8\u8f73\u6c07\u7c0f\u6a79\u8f82\u5786\u80ea\u565c\u9565\u8f98\u6f09\u64b8\u7490\u9e2c\u9e6d\u823b\u4f93\u50c7\u5279\u52ce\u52e0\u55e0\u5695\u56a7\u5725\u5774\u5876\u5877\u58da\u5a3d\u5ccd\u5ed8\u5eec\u5f54\u6314\u634b\u635b\u6445\u645d\u64c4\u64fc\u6504\u650e\u67a6\u6902\u6a10\u6a1a\u6ad3\u6ae8\u6c0c\u6dd5\u6de5\u6ee4\u6ef7\u6f0a\u6f9b\u6ffe\u7002\u7018\u719d\u7210\u7379\u7388\u742d\u74b7\u74d0\u752a\u7633\u76dd\u76e7\u7769\u77d1\u7849\u7875\u78e0\u797f\u7a11\u7a4b\u7b93\u7c2c\u7c35\u7c36\u7c59\u7c5a\u7cb6\u7dd1\u7e91\u7f4f\u7fcf\u80a4\u8194\u819a\u819f\u81da\u822e\u8263\u826a\u826b\u83c9\u84fe\u850d\u8557\u8606\u8642\u865c\u87b0\u8826\u89d2\u89ee\u89fb\u8c37\u8cc2\u8da2\u8e1b\u8e57\u8f05\u8f46\u8f64\u911c\u916a\u9181\u9229\u9304\u9332\u9334\u93c0\u93d5\u93f4\u942a\u9465\u946a\u9678\u9871\u9a04\u9a3c\u9ad7\u9b6f\u9b72\u9be5\u9c73\u9c78\u9d3c\u9d66\u9d71\u9dfa\u9e15\u9e75\u9ef8",luan:"\u4e71\u5375\u6ee6\u5ce6\u5b6a\u631b\u683e\u92ae\u8114\u5a08\u9e3e\u4e7f\u4e82\u571d\u571e\u5971\u5b4c\u5b7f\u5dd2\u6523\u66eb\u6b12\u7053\u7064\u7674\u7675\u7f89\u811f\u81e0\u81e1\u858d\u864a\u89b6\u91e0\u947e\u9d49\u9e1e",lue:"\u7565\u63a0\u950a\u5260\u5719\u5bfd\u64fd\u7387\u7567\u7a24\u836f\u85e5\u8a7b\u92dd\u92e2",lun:"\u8bba\u8f6e\u62a1\u4f26\u6ca6\u4ed1\u7eb6\u56f5\u4f96\u502b\u5707\u57e8\u5a68\u5d18\u5d19\u60c0\u6384\u68c6\u6dea\u6ea3\u7754\u7896\u78ee\u7a10\u7db8\u8023\u8140\u83d5\u8726\u8ad6\u8e1a\u8f2a\u9300\u966f\u9be9",luo:"\u843d\u7f57\u9523\u88f8\u9aa1\u70d9\u7ba9\u87ba\u841d\u6d1b\u9a86\u903b\u7edc\u54af\u8366\u6f2f\u8803\u96d2\u502e\u784c\u6924\u634b\u8136\u7630\u645e\u6cfa\u73de\u9559\u7321\u4e50\u5138\u513d\u5246\u5570\u56c9\u5cc8\u633c\u6370\u650e\u651e\u652d\u66ea\u679c\u683c\u6a02\u6a50\u6adf\u6b0f\u6b19\u6ffc\u70c1\u720d\u7296\u7313\u7380\u7673\u76aa\u7822\u7866\u788c\u792b\u7b3f\u7c6e\u7d61\u7e99\u7f85\u8161\u81dd\u8316\u84cf\u863f\u86d2\u873e\u8778\u8821\u88bc\u89b6\u89bc\u8a7b\u8dde\u8def\u8e92\u8eb6\u908f\u927b\u93af\u93cd\u947c\u94ec\u9831\u9960\u99f1\u9a3e\u9a58\u9ba5\u9c73\u9d45\u9e01",lv:"\u7eff\u7387\u94dd\u9a74\u65c5\u5c61\u6ee4\u5415\u5f8b\u6c2f\u7f15\u4fa3\u8651\u5c65\u507b\u8182\u6988\u95fe\u634b\u891b\u7a06\u4fb6\u5122\u52f4\u535b\u5362\u5442\u54f7\u578f\u58d8\u5a04\u5a41\u5be0\u5bfd\u5c62\u5d42\u5e90\u5eec\u616e\u617a\u66e5\u68a0\u6a13\u6ad6\u6ada\u6ae8\u6c00\u7112\u7208\u763b\u76e7\u779c\u7963\u7a5e\u7a6d\u7bbb\u7bd3\u7c0d\u7d2f\u7d7d\u7da0\u7dd1\u7e37\u7e42\u8190\u81a2\u844e\u848c\u851e\u85d8\u8938\u8b31\u8ec1\u90d8\u92c1\u9332\u93e4\u9462\u9542\u95ad\u99bf\u9a62\u9b6f\u9c81\u9ddc\u9e7f",m:"\u5452\u5463\u5638",ma:"\u5417\u5988\u9a6c\u561b\u9ebb\u9a82\u62b9\u7801\u739b\u8682\u6469\u551b\u87c6\u72b8\u5b37\u6769\u4e48\u4e87\u508c\u5450\u55ce\u561c\u5abd\u5af2\u5b24\u5b56\u5c1b\u69aa\u6ea4\u7298\u7341\u746a\u75f2\u7770\u78bc\u7923\u7943\u79a1\u7f75\u84e6\u8534\u879e\u87c7\u8c89\u8c8a\u9064\u93b7\u9581\u9761\u99ac\u99e1\u9a40\u9b15\u9c22\u9dcc\u9ebc\u9ebd",mai:"\u4e70\u5356\u8fc8\u57cb\u9ea6\u8109\u52a2\u973e\u836c\u4f45\u52f1\u54aa\u54e9\u562a\u58f2\u6d3e\u8108\u8552\u85b6\u8847\u8c8d\u8cb7\u8ce3\u9081\u9721\u9722\u9df6\u9ea5\u551b",man:"\u6ee1\u6162\u7792\u6f2b\u86ee\u8513\u66fc\u9992\u57cb\u8c29\u5e54\u9cd7\u5881\u87a8\u9558\u989f\u9794\u7f26\u71b3\u50c8\u59cf\u5ada\u5c58\u5e55\u6097\u6172\u6471\u69fe\u6a20\u6e80\u6eff\u6fab\u6fb7\u734c\u774c\u779e\u77d5\u7d7b\u7e35\u8504\u8630\u87c3\u87ce\u883b\u8954\u8b3e\u8e52\u8e63\u9124\u93cb\u93dd\u9862\u9945\u9b17\u9b18\u9c3b",mang:"\u5fd9\u8292\u76f2\u83bd\u832b\u6c13\u786d\u9099\u87d2\u6f2d\u5396\u5402\u54e4\u58fe\u5a0f\u5c28\u5eac\u607e\u671a\u6726\u6757\u6767\u6c52\u6d5d\u7264\u727b\u72f5\u753f\u75dd\u76f3\u77a2\u7865\u7b00\u833b\u83be\u8609\u86d6\u880e\u91ef\u92e9\u94d3\u99f9\u9e0f\u9e72\u9f8d\u9f92\u9f99",mao:"\u6bdb\u5192\u5e3d\u732b\u77db\u536f\u8c8c\u8302\u8d38\u94c6\u951a\u8305\u8004\u8306\u7441\u8765\u9ae6\u61cb\u6634\u7266\u7780\u5cc1\u88a4\u87ca\u65c4\u6cd6\u4f94\u5183\u5187\u5190\u52d6\u52d9\u5825\u5918\u5aa2\u5d4d\u6117\u623c\u63cf\u6693\u6786\u6959\u6be3\u6bf7\u6c02\u6e35\u725f\u729b\u734f\u7683\u770a\u79cf\u7b37\u7de2\u7f5e\u8017\u82bc\u843a\u84e9\u86d1\u8750\u8992\u8c87\u8c93\u8cbf\u8ede\u911a\u912e\u9155\u925a\u927e\u9328\u973f\u9af3\u9d9c",me:"\u4e48\u5692\u569c\u56b0\u5b6d\u5e85\u6ff9\u7666\u9ebc\u9ebd",mei:"\u6ca1\u6bcf\u7164\u9541\u7f8e\u9176\u59b9\u679a\u9709\u73ab\u7709\u6885\u5bd0\u6627\u5a92\u7cdc\u5a9a\u8c1c\u6cab\u5d4b\u7338\u8882\u6e44\u6d7c\u9e5b\u8393\u9b45\u9545\u6963\u51c2\u5445\u5473\u569c\u5746\u5776\u5833\u587a\u58a8\u5a84\u5aba\u5b0d\u5d44\u5fbe\u62ba\u6334\u6517\u651f\u67d0\u6802\u6973\u69d1\u6ad7\u6bce\u6c3c\u6c92\u6cac\u6e3c\u6e48\u6ea6\u715d\u71d8\u73fb\u7442\u75d7\u770a\u771b\u7742\u7778\u77c0\u7959\u7996\u7bc3\u7f99\u8104\u8122\u815c\u81b4\u82fa\u847f\u862a\u875e\u8dca\u8ebe\u90ff\u92c2\u9382\u9387\u97ce\u9b3d\u9da5\u9ee3\u9ef4",men:"\u95e8\u4eec\u95f7\u61d1\u626a\u9494\u7116\u4eb9\u5011\u600b\u6097\u60b6\u60db\u61e3\u636b\u66aa\u691a\u6b99\u6c76\u6e80\u6ee1\u6eff\u71dc\u739f\u73a3\u73a7\u748a\u779e\u7a48\u83db\u864b\u9346\u9580\u9585\u9794",meng:"\u731b\u68a6\u8499\u9530\u5b5f\u76df\u6aac\u840c\u6c13\u791e\u8722\u52d0\u61f5\u750d\u8813\u867b\u6726\u824b\u8268\u77a2\u511a\u51a1\u5922\u5923\u5ac7\u5c28\u5e6a\u5eac\u61dc\u61de\u63b9\u64dd\u660e\u66da\u6a57\u6c0b\u6e95\u6fdb\u7374\u74fe\u753f\u7791\u77c7\u77d2\u7f5e\u8394\u8420\u8544\u8771\u87ca\u87d2\u9133\u9138\u92c2\u9333\u96fa\u971a\u9725\u9727\u973f\u9740\u986d\u995b\u9af3\u9bcd\u9bed\u9c66\u9e0f\u9e72\u9efd\u9efe\u9f06",meo:"\u8e0e",mi:"\u7c73\u5bc6\u8ff7\u772f\u871c\u8c1c\u89c5\u79d8\u5f25\u5e42\u9761\u7cdc\u6ccc\u919a\u863c\u7e3b\u54aa\u6c68\u9e8b\u7962\u7315\u5f2d\u8c27\u8288\u8112\u5b93\u6549\u5627\u7cf8\u4f8e\u5196\u519e\u51aa\u5298\u54cb\u5853\u5b4a\u5bbb\u5c12\u5c13\u5c14\u5cda\u5e4e\u5e66\u5e7a\u5f4c\u6202\u6469\u6475\u64df\u64f5\u6520\u6993\u6a12\u6ab7\u6ac1\u6c95\u6cb5\u6d23\u6de7\u6e33\u6e9f\u6ef5\u6f1e\u6fd4\u6fd7\u7030\u7056\u7190\u7222\u723e\u736f\u737c\u74d5\u772b\u773d\u7787\u77b4\u7955\u79b0\u7a48\u7c1a\u7c4b\u7c8e\u7f59\u7f83\u7f8b\u82fe\u845e\u84be\u84c2\u851d\u8524\u85cc\u8746\u88ae\u8993\u8994\u899b\u8a78\u8b0e\u8b10\u8f9f\u91be\u91bf\u91c4\u92a4\u9456\u957e\u9e0d\u9e8a\u9e9b\u9f0f",mian:"\u9762\u68c9\u514d\u7ef5\u7720\u7f05\u52c9\u5195\u5a29\u817c\u6e4e\u7704\u6c94\u9efe\u6e11\u4e0f\u4fdb\u506d\u51a5\u52d4\u53b8\u5595\u5a42\u5a94\u5b35\u6110\u6ab0\u6acb\u6c45\u6cef\u6e63\u6fa0\u7251\u7791\u77c8\u77ca\u77cf\u7cc6\u7d7b\u7dbf\u7dcd\u7ddc\u7de1\u7dec\u7f17\u81f1\u8287\u83ac\u8442\u8752\u8820\u9763\u9766\u9bb8\u9eaa\u9eab\u9eb5\u9eba\u9efd\u5b80",miao:"\u79d2\u82d7\u5e99\u5999\u63cf\u7784\u85d0\u6e3a\u7707\u7f2a\u7f08\u6dfc\u55b5\u676a\u9e4b\u9088\u4eef\u5435\u5a8c\u5af9\u5ebf\u5edf\u5f6f\u732b\u7385\u7ad7\u7bce\u7d17\u7de2\u7df2\u7eb1\u8731\u8a2c\u9c59\u9d93",mie:"\u706d\u8511\u54a9\u7bfe\u881b\u4e5c\u5400\u54aa\u54f6\u5b6d\u5e6d\u61f1\u6423\u6ad7\u6ec5\u700e\u771c\u858e\u884a\u8995\u8c02\u9456\u9c74\u9d13",min:"\u6c11\u62bf\u654f\u95fd\u76bf\u60af\u73c9\u610d\u7f17\u95f5\u739f\u82e0\u6cef\u9efe\u9cd8\u5cb7\u50f6\u51a7\u51ba\u5221\u52c4\u5461\u578a\u59c4\u5d0f\u5fde\u600b\u615c\u61ab\u636a\u6543\u656f\u65fb\u65fc\u668b\u6c76\u6e02\u6e4f\u6e63\u6f63\u7418\u741d\u7449\u75fb\u76f7\u76ff\u7720\u7807\u7888\u7b22\u7b3d\u7c22\u7dcd\u7de1\u7e69\u7ef3\u7f60\u8820\u8cef\u9231\u9309\u9372\u9594\u95a9\u9c35\u9d16\u9efd",ming:"\u540d\u660e\u547d\u9e23\u94ed\u879f\u76df\u51a5\u7791\u669d\u8317\u6e9f\u9169\u4f72\u51d5\u59f3\u5ac7\u614f\u63b5\u6719\u69a0\u6d3a\u733d\u7700\u7733\u840c\u84c2\u89ad\u8a7a\u910d\u9298\u9cf4",miu:"\u8c2c\u7f2a\u7e46\u8b2c",mo:"\u6478\u78e8\u62b9\u672b\u819c\u58a8\u6ca1\u83ab\u9ed8\u9b54\u6a21\u6469\u6479\u6f20\u964c\u8611\u8109\u6cab\u4e07\u65e0\u5192\u5bde\u79e3\u763c\u6b81\u9546\u5aeb\u8c1f\u84e6\u8c8a\u8c98\u9ebd\u8309\u998d\u8031\u4e48\u4f2f\u4f70\u5298\u52b0\u52ff\u55fc\u56a4\u56a9\u573d\u587b\u59ba\u5afc\u5c1b\u5e13\u5e15\u5e1e\u603d\u61e1\u6202\u629a\u64ab\u64f5\u6520\u6627\u6629\u66af\u67ba\u6a45\u6b7e\u6b7f\u6c92\u700e\u7121\u7205\u72e2\u767e\u768c\u771c\u773d\u773f\u7790\u7799\u781e\u7933\u7c96\u7ce2\u7d48\u7d54\u7e38\u7e86\u8252\u8388\u85d0\u85e6\u86e8\u87c6\u87d4\u889c\u88b9\u8b28\u8b29\u8b55\u8c83\u8c88\u8c89\u8c8c\u9286\u93cc\u977a\u97a8\u9943\u995d\u9a40\u9acd\u9b69\u9b79\u9ebc\u9ebf\u9ed9\u563f\u5b37",mou:"\u67d0\u8c0b\u725f\u7738\u86d1\u936a\u4f94\u7f2a\u54de\u4ef6\u52ba\u53b6\u5463\u5825\u5a7a\u6048\u6544\u6859\u6bcb\u6d20\u77b4\u7e46\u87f1\u88a4\u8b00\u927e\u97aa\u9d3e\u9eb0\u8765",mu:"\u6728\u6bcd\u4ea9\u5e55\u76ee\u5893\u7267\u725f\u6a21\u7a46\u66ae\u7261\u62c7\u52df\u6155\u7766\u59c6\u59e5\u94bc\u6bea\u5776\u6c90\u4eeb\u82dc\u51e9\u58b2\u5a12\u5a7a\u5cd4\u5e59\u6154\u6737\u6958\u6a22\u6be3\u6c01\u7091\u7273\u72c7\u734f\u7546\u7552\u755d\u755e\u756e\u782a\u7e38\u7e46\u7f2a\u80df\u8252\u833b\u83af\u843a\u869e\u8e07\u9267\u926c\u96ee\u9702\u97aa\u5452\u563f",myeo:"\u65c0",myeon:"\u4e06",myeong:"\u6927",n:"\u55ef\u54b9\u54cf",na:"\u90a3\u62ff\u54ea\u7eb3\u94a0\u5a1c\u5450\u5357\u8872\u637a\u954e\u80ad\u4e78\u5167\u5185\u5436\u5476\u55f1\u59a0\u6290\u62cf\u6310\u6df0\u79c5\u7b1a\u7b1d\u7bac\u7bdb\u7d0d\u7d6e\u8498\u84b3\u88a6\u8a24\u8a49\u8abd\u8c7d\u8c80\u8e43\u8edc\u90cd\u9209\u93bf\u96eb\u9779\u9b76",nai:"\u4e43\u8010\u5976\u5948\u6c16\u54ea\u8418\u827f\u67f0\u9f10\u4f74\u5037\u59b3\u5b2d\u5b7b\u5efc\u639c\u6431\u6468\u6e3f\u718b\u7593\u800f\u80fd\u8149\u879a\u8926\u8ffa\u91e2\u933c",nan:"\u96be\u5357\u7537\u8d67\u56e1\u877b\u6960\u5583\u8169\u4fbd\u56dd\u59a0\u5a1a\u5a7b\u5ae8\u5f07\u6201\u62a9\u63c7\u644a\u6524\u6694\u678f\u67ac\u67df\u6e73\u6ee9\u7058\u7175\u7558\u83ae\u8433\u8af5\u9056\u96e3\u988c",nang:"\u56ca\u9995\u66e9\u56d4\u652e\u4e6a\u513e\u54dd\u5665\u56a2\u5d00\u61b9\u6411\u64c3\u6b1c\u6db3\u703c\u7062\u8618\u8830\u8b68\u9962\u9b1e\u9f49",nao:"\u95f9\u8111\u607c\u6320\u6dd6\u5b6c\u94d9\u7459\u57b4\u5476\u86f2\u7331\u7847\u5318\u5816\u5912\u5a65\u5ad0\u5cf1\u5da9\u5dce\u5dd9\u6013\u60a9\u60f1\u61b9\u6493\u6a48\u6a82\u6d47\u6f86\u7376\u737f\u7899\u78af\u8133\u815d\u8166\u81d1\u875a\u87ef\u8a49\u8b4a\u9403\u9599\u9b27",ne:"\u5462\u54ea\u90a3\u5450\u8bb7\u5436\u6290\u7594\u7732\u8a25\u7592",nei:"\u5185\u54ea\u9981\u90a3\u5167\u5a1e\u5a51\u6c1d\u6d7d\u812e\u8147\u9317\u9912\u9927\u9bbe\u9bd8",nem:"\u713e",nen:"\u5ae9\u6041\u5a86\u5af0\u6798\u815d\u81d1",neng:"\u80fd\u7adc\u800c\u8010\u879a",neus:"\u83bb",ng:"\u55ef",ngag:"\u922a",ngai:"\u92b0",ngam:"\u5571",ni:"\u4f60\u6ce5\u62df\u817b\u9006\u5462\u6eba\u502a\u5c3c\u533f\u59ae\u9713\u94cc\u6635\u576d\u7962\u730a\u4f32\u6029\u9cb5\u7768\u65ce\u4f31\u5117\u511e\u5150\u5152\u57ff\u5804\u59b3\u5a57\u5adf\u5b2d\u5b3a\u5b68\u5b74\u5c54\u5c70\u5db7\u5f4c\u60c4\u6135\u615d\u61dd\u6290\u62b3\u639c\u64ec\u6672\u66b1\u67c5\u68ff\u6ab7\u6c3c\u6de3\u6ee0\u6fd4\u6fd8\u7030\u7044\u72d4\u75c6\u7724\u79b0\u79dc\u7c7e\u7e0c\u807b\u80d2\u815d\u81a9\u81e1\u82e8\u85bf\u86ad\u86ea\u873a\u88ae\u89ec\u8abd\u8b7a\u8c8e\u8ddc\u8f17\u8fe1\u90f3\u922e\u9268\u9448\u957e\u96ac\u999c\u9be2\u9e91\u9f6f",nian:"\u5e74\u5ff5\u637b\u64b5\u62c8\u78be\u852b\u7c98\u5eff\u9ecf\u8f87\u9c87\u9cb6\u57dd\u5344\u54d6\u5538\u59e9\u6375\u649a\u6506\u6990\u6d8a\u6df0\u6e93\u75c6\u79ca\u79e5\u7c10\u824c\u8d81\u8d82\u8dc8\u8e4d\u8e68\u8e8e\u8f26\u8f3e\u8f97\u9b8e\u9bf0\u9d47",niao:"\u9e1f\u5c3f\u8885\u8311\u8132\u5b32\u5acb\u5b1d\u5c25\u5c26\u6a22\u6eba\u832e\u8526\u88ca\u892d\u9ce5",nie:"\u634f\u954d\u8042\u5b7d\u6d85\u954a\u556e\u9667\u8616\u55eb\u81ec\u8e51\u989e\u4e5c\u502a\u55a6\u565b\u5699\u56c1\u56d0\u56d3\u56e1\u573c\u57dd\u5b7c\u5cca\u5d52\u5d72\u5dad\u5dd5\u5e07\u5e78\u60d7\u637b\u639c\u63d1\u6442\u6444\u6470\u651d\u655c\u67bf\u68ff\u69f7\u6af1\u75c6\u7bde\u7c4b\u7cf1\u7cf5\u8076\u8080\u81f2\u82f6\u83cd\u8825\u8939\u8ad7\u8b98\u8e02\u8e17\u8e19\u8ea1\u9268\u9269\u92b8\u92f7\u931c\u93b3\u9448\u9477\u9480\u95d1\u9689\u9873\u9f67",nin:"\u60a8\u6041\u56dc\u62f0\u810c",ning:"\u62e7\u51dd\u5b81\u67e0\u72de\u6cde\u4f5e\u752f\u549b\u804d\u4fab\u511c\u51b0\u5680\u5b23\u5bcd\u5bd5\u5bd7\u5bdc\u5be7\u5e74\u64f0\u6518\u6a63\u6ab8\u6f9d\u6fd8\u7370\u7591\u77c3\u8079\u82e7\u85b4\u944f\u9b21\u9b24\u9e0b",niu:"\u725b\u626d\u7ebd\u94ae\u62d7\u599e\u72c3\u5ff8\u6013\u629d\u677b\u6c7c\u6c91\u7084\u725c\u7d10\u83a5\u86b4\u9215\u9775",nong:"\u5f04\u6d53\u519c\u8113\u54dd\u4fac\u5102\u5494\u5665\u61b9\u630a\u6335\u6b01\u6fc3\u7651\u79af\u79fe\u7a60\u7e77\u81bf\u8380\u857d\u895b\u8fb2\u8fb3\u91b2\u9f48\u5efe",nou:"\u8028\u5542\u5b2c\u6419\u64e9\u69c8\u6abd\u7373\u7fba\u8b68\u8b73\u9392\u941e",nu:"\u6012\u52aa\u5974\u5b65\u80ec\u9a7d\u5f29\u4ec5\u4f16\u4f2e\u5089\u5476\u5e11\u6419\u64e9\u782e\u7b2f\u8925\u8a49\u99d1",nuan:"\u6696\u597b\u6e1c\u6e6a\u6fe1\u7156\u7157\u992a",nue:"\u8650\u759f\u8c11\u7878",nun:"\u9ec1",nung:"\u71f6",nuo:"\u632a\u8bfa\u61e6\u7cef\u5a1c\u558f\u50a9\u9518\u6426\u513a\u5436\u5450\u54ea\u5827\u5aa0\u5af7\u611e\u61e7\u6389\u63bf\u6419\u643b\u689b\u6992\u6a60\u6bed\u6e2a\u7a2c\u7a64\u7cd1\u7ce5\u800e\u88b2\u88b3\u8afe\u8e43\u903d\u90a3\u90cd\u9369\u96be\u96e3\u9700",nv:"\u5973\u8844\u9495\u6067\u6712\u6c91\u72c3\u7c79\u7d6e\u804f\u80ad\u8842\u91f9",nve:"\u5a69\u759f\u7627\u8650",o:"\u54e6\u5594\u5662\u7b7d",oes:"\u591e",ol:"\u4e6f",on:"\u6637\u97b0",ou:"\u5076\u5455\u6b27\u85d5\u9e25\u533a\u6ca4\u6bb4\u6004\u74ef\u8bb4\u8026\u5340\u5418\u543d\u5614\u5878\u616a\u62a0\u63e1\u6473\u657a\u6ad9\u6b50\u6bc6\u6e25\u6f1a\u6fab\u71b0\u750c\u7d06\u7ea1\u8162\u8192\u84f2\u8545\u85f2\u8b33\u9047\u91a7\u93c2\u9d0e\u9dd7\u9f75",pa:"\u6015\u722c\u8db4\u556a\u8019\u6252\u5e15\u7436\u6d3e\u7b62\u6777\u8469\u53ed\u5427\u5991\u5e0a\u628a\u63b1\u6c43\u6f56\u7685\u8225\u82ad\u82e9\u8899\u8dc1\u9200\u94af",pai:"\u6d3e\u6392\u62cd\u724c\u8feb\u5f98\u6e43\u54cc\u4ff3\u848e\u5561\u68d1\u6911\u72a4\u7305\u7b84\u7c30\u813e\u8157\u8f2b\u9383",pak:"\u78d7",pan:"\u76d8\u76fc\u5224\u6500\u7554\u6f58\u53db\u78d0\u756a\u822c\u80d6\u897b\u87e0\u88a2\u6cee\u62da\u723f\u8e52\u4e51\u4f34\u51b8\u534a\u535e\u5762\u59cd\u59d7\u5abb\u5ba1\u5bb7\u5be9\u5e4b\u5f01\u5f66\u6273\u62cc\u642b\u67c8\u69c3\u6c9c\u6d00\u6e74\u6ebf\u700a\u700b\u708d\u7247\u7249\u7253\u7568\u76a4\u76e4\u76fb\u7705\u772b\u7886\u78fb\u7c53\u7e0f\u7e41\u81b0\u84b0\u878c\u8929\u8a4a\u8dd8\u8e2b\u8e63\u9131\u92ec\u939c\u947b\u95c6\u97b6\u9816\u9d65",pang:"\u65c1\u80d6\u802a\u5e9e\u4e53\u8180\u78c5\u6ec2\u5f77\u9004\u8783\u4eff\u508d\u5390\u55d9\u5906\u5ace\u5c28\u5f6d\u5fac\u623f\u65b9\u6c78\u6c97\u7090\u7be3\u80a8\u80ee\u8196\u823d\u84a1\u882d\u89ab\u8dbd\u9022\u938a\u9551\u96f1\u9736\u9ac8\u9c1f\u9cd1\u9f8e\u9f90",pao:"\u8dd1\u629b\u70ae\u6ce1\u5228\u888d\u5486\u72cd\u530f\u5e96\u75b1\u812c\u5305\u5697\u5789\u5945\u62b1\u62cb\u647d\u70b0\u722e\u72a5\u74df\u76b0\u7832\u791f\u792e\u7a6e\u7a8c\u80de\u811f\u82de\u8422\u85e8\u86ab\u888c\u891c\u8b08\u8ef3\u924b\u94c7\u9784\u98ae\u98d1\u9b91\u9c8d\u9e83\u9e85\u9ead",pei:"\u966a\u914d\u8d54\u5478\u80da\u4f69\u57f9\u6c9b\u88f4\u65c6\u952b\u5e14\u9185\u9708\u8f94\u4f02\u4fd6\u500d\u5561\u574f\u57ba\u5983\u599a\u59f5\u5a44\u5a90\u5d8f\u600c\u62b7\u638a\u6508\u65be\u6622\u67f8\u68d1\u6bf0\u6d7f\u6de0\u72bb\u73ee\u7423\u7432\u7b29\u80a7\u8274\u8307\u8337\u84dc\u871a\u8843\u88f5\u8ce0\u8f61\u9307\u962b\u966b\u99b7\u99cd",pen:"\u55b7\u76c6\u6e53\u5429\u5460\u55af\u5674\u672c\u6b55\u6c7e\u6fc6\u74eb\u7fc9\u7ff8\u8450\u886f",peng:"\u78b0\u6367\u68da\u7830\u84ec\u670b\u5f6d\u9e4f\u70f9\u787c\u81a8\u62a8\u6f8e\u7bf7\u6026\u580b\u87db\u562d\u4ea8\u5017\u508d\u50b0\u527b\u5309\u585c\u5873\u5e84\u5f38\u6072\u6189\u6337\u63bd\u6412\u6453\u65c1\u6888\u6916\u692a\u69f0\u6a25\u6cd9\u6dce\u6ddc\u6ec2\u6f28\u6f30\u71a2\u75ed\u768f\u7851\u78de\u7a1d\u7afc\u7be3\u7d63\u7e84\u80d3\u8283\u82f9\u8353\u8391\u87da\u8e2b\u8eef\u8eff\u8f23\u8f27\u8ff8\u9022\u902c\u930b\u945d\u959b\u97f8\u97fc\u99cd\u9a2f\u9afc\u9b05\u9b14\u9d6c",peol:"\u6d4c",phas:"\u5dfc",phdeng:"\u95cf",phoi:"\u4e76",phos:"\u55b8",pi:"\u6279\u76ae\u62ab\u5339\u5288\u8f9f\u576f\u5c41\u813e\u50fb\u75b2\u75de\u9739\u7435\u6bd7\u5564\u8b6c\u7812\u5426\u8c94\u4e15\u572e\u5ab2\u7656\u4ef3\u64d7\u90eb\u7513\u6787\u7765\u8731\u9f19\u90b3\u5421\u9642\u94cd\u5e80\u7f74\u57e4\u7eb0\u9674\u6de0\u567c\u868d\u88e8\u4f13\u4f3e\u4ffe\u526f\u5351\u567d\u568a\u56ad\u574f\u57f9\u58c0\u599a\u5ad3\u5caf\u5d25\u5d8f\u5e14\u5e87\u5eb3\u6036\u6082\u61b5\u6251\u62b7\u62c2\u63ca\u65c7\u6707\u6788\u6911\u698c\u6bd4\u6bd8\u6bde\u6e12\u6f4e\u6fbc\u6fde\u708b\u7137\u72c9\u72d3\u7308\u7588\u758b\u75e6\u75fa\u7764\u78c7\u7914\u7915\u79db\u79e0\u7a2b\u7b13\u7b86\u7be6\u7bfa\u7c32\u7c83\u7d15\u7f77\u7f86\u7fcd\u801a\u80b6\u8134\u8157\u818d\u8298\u82c9\u82e4\u8406\u8543\u868c\u86bd\u86be\u8795\u87b7\u882f\u88ab\u8ac0\u8c7c\u8c7e\u9131\u91fd\u9208\u921a\u9232\u9239\u925f\u9294\u92a2\u9303\u930d\u939e\u949a\u95e2\u9630\u96a6\u979e\u9817\u9856\u9887\u99d3\u9aec\u9b6e\u9b7e\u9b8d\u9c8f\u9d04\u9d67\u9dff\u9e0a",pian:"\u7247\u7bc7\u9a97\u504f\u4fbf\u6241\u7fe9\u7f0f\u728f\u9a88\u80fc\u8e41\u8c1d\u56e8\u5aa5\u5e73\u5fa7\u6944\u6969\u7335\u74b8\u7df6\u8141\u8439\u8759\u890a\u8991\u8ada\u8ade\u8cb5\u8cc6\u8df0\u8fa9\u8faf\u99e2\u9a08\u9a17\u9a19\u9abf\u9b78\u9da3",piao:"\u7968\u98d8\u6f02\u74e2\u6734\u87b5\u83a9\u5ad6\u779f\u6b8d\u7f25\u560c\u9aa0\u527d\u50c4\u52e1\u5f6f\u5fb1\u6153\u647d\u65da\u6f4e\u72a5\u76ab\u78e6\u7bfb\u7e39\u7ff2\u8198\u8508\u85b8\u8b24\u91a5\u95dd\u9860\u98c3\u98c4\u9a43\u9a6b\u9a89\u9b52\u9adf",pie:"\u77a5\u6487\u6c15\u82e4\u4e3f\u5af3\u6486\u66bc\u6f4e\u80ba\u853d\u8995\u9405",pin:"\u54c1\u8d2b\u8058\u62fc\u9891\u5ad4\u6980\u59d8\u725d\u98a6\u5315\u56ac\u5a09\u5b2a\u62da\u6729\u6c56\u6cf5\u73ad\u7415\u77c9\u780f\u7917\u7a66\u85b2\u860b\u8ca7\u983b\u9870\u99aa\u9a5e",ping:"\u5e73\u51ed\u74f6\u8bc4\u5c4f\u4e52\u840d\u82f9\u576a\u51af\u5a09\u9c86\u67b0\u4fdc\u5017\u51f4\u546f\u5840\u5a26\u5c5b\u5cbc\u5e21\u5e32\u5e48\u617f\u6191\u6a98\u6cd9\u6d34\u6d84\u6ddc\u7129\u73b6\u7501\u7539\u782f\u7830\u7851\u7aee\u7bb3\u7c08\u7f3e\u8060\u80d3\u8275\u8353\u84f1\u860b\u86b2\u86e2\u8a55\u8eff\u8f27\u90f1\u927c\u9829\u99ae\u9b83\u5196\u79e4",po:"\u7834\u5761\u9887\u5a46\u6cfc\u8feb\u6cca\u9b44\u6734\u7e41\u7c95\u7b38\u76a4\u948b\u9642\u9131\u6534\u53f5\u73c0\u94b7\u54f1\u5619\u5964\u5a1d\u5c00\u5c03\u5c70\u5ca5\u5cb6\u5dff\u5ef9\u642b\u6540\u6622\u6872\u693a\u6ac7\u6d26\u6dff\u6e50\u6e8c\u6ea5\u6f51\u6ffc\u70de\u733c\u769b\u7836\u7fcd\u818a\u84aa\u8522\u8b08\u8ddb\u9166\u91b1\u91d9\u9255\u93fa\u9738\u9817\u999e\u99ca\u9ac6\u6cfa",pou:"\u5256\u638a\u88d2\u5425\u5485\u54e3\u57ba\u57f9\u5837\u5a44\u6294\u6299\u62b1\u634a\u68d3\u6daa\u7283\u7b81\u88e6\u8912\u8943\u8e23\u90e8\u90f6\u9307\u952b\u9892",ppun:"\u517a\u54db",pu:"\u6251\u94fa\u8c31\u812f\u4ec6\u84b2\u8461\u6734\u83e9\u8386\u7011\u57d4\u5703\u6d66\u5821\u666e\u66b4\u9568\u5657\u530d\u6ea5\u6fee\u6c06\u8e7c\u749e\u9564\u50d5\u525d\u5265\u535c\u5711\u5724\u58a3\u5dec\u5ded\u6276\u62aa\u6357\u64b2\u64c8\u6534\u669c\u67e8\u6a38\u6a8f\u6f7d\u7087\u70f3\u735b\u752b\u75e1\u77a8\u7832\u79ff\u7a59\u7b81\u7e80\u8216\u8217\u82fb\u8379\u83d0\u84b1\u8705\u8946\u8965\u8ae9\u8b5c\u8c67\u8d0c\u917a\u92ea\u93f7\u9420\u9660\u99c7\u9bc6\u9d4f\u6535\u66dd",q:"\u7441",qi:"\u8d77\u5176\u4e03\u6c14\u671f\u9f50\u5668\u59bb\u9a91\u6c7d\u68cb\u5947\u6b3a\u6f06\u542f\u621a\u67d2\u5c82\u780c\u5f03\u6ce3\u7941\u51c4\u4f01\u4e5e\u5951\u6b67\u7948\u6816\u7566\u8110\u5d0e\u7a3d\u8fc4\u7f09\u6c8f\u8bab\u65d7\u797a\u9880\u9a90\u5c7a\u5c90\u8e4a\u8401\u8572\u6864\u61a9\u82aa\u8360\u840b\u8291\u6c54\u4e9f\u9ccd\u4fdf\u69ed\u5601\u86f4\u7da6\u4e93\u6b39\u742a\u9e92\u7426\u871e\u573b\u675e\u847a\u789b\u6dc7\u7957\u8006\u7eee\u4e0c\u4e9d\u4f0e\u501b\u5048\u50b6\u50db\u5207\u523a\u5258\u52e4\u5403\u5431\u5447\u546e\u54a0\u5518\u552d\u5553\u5554\u555f\u55b0\u5650\u57fc\u5921\u5a38\u5a4d\u5bbf\u5c93\u5d5c\u5df1\u5e3a\u5fd4\u5fee\u5fef\u5ffe\u6053\u605d\u60bd\u6112\u612d\u613e\u617c\u617d\u6187\u61e0\u6262\u6271\u627a\u6280\u62b5\u62de\u6308\u637f\u6391\u63ed\u6456\u652f\u6532\u6567\u6589\u658a\u65c2\u6675\u66a3\u671e\u679d\u6814\u687c\u68a9\u68c4\u68ca\u68e8\u68f2\u69bf\u6ab1\u6ac0\u6b2b\u6bc4\u6c17\u6c23\u6d13\u6d4e\u6dd2\u6e08\u6e0d\u6e0f\u6e46\u6e47\u6eca\u6f2c\u6fdd\u6fdf\u7081\u710f\u7309\u7382\u7398\u7482\u7508\u752d\u7578\u75a7\u76c0\u76f5\u77f5\u7881\u7895\u78b6\u78ce\u78dc\u78e7\u78e9\u7918\u793a\u7947\u79a5\u79a8\u7a18\u7ad2\u7c2f\u7c31\u7c4f\u7cb8\u7d2a\u7d5c\u7da5\u7da8\u7dae\u7dba\u7dc0\u7dd5\u7ddd\u7e83\u7f3c\u7f4a\u8090\u80b5\u81cd\u8219\u8269\u829e\u8415\u85ba\u85c4\u8604\u8691\u8694\u869a\u871d\u8787\u87a7\u87e3\u87ff\u8810\u8879\u88b3\u88ff\u8900\u8904\u89ed\u8a16\u8ac6\u8aec\u8aff\u8c48\u8d9e\u8dbf\u8dc2\u8e11\u8e16\u8e26\u8ea4\u8ea9\u8ed9\u8edd\u8fc9\u9017\u9094\u90ea\u913f\u91ee\u9321\u93da\u9416\u951c\u95d9\u9691\u970b\u980e\u9951\u9a0e\u9a0f\u9a39\u9b10\u9b3e\u9b3f\u9b4c\u9b55\u9ba8\u9bd5\u9c2d\u9caf\u9d78\u9d80\u9d88\u9ea1\u9f1c\u9f4a\u9f6e",qia:"\u6070\u5361\u6390\u6d3d\u9ac2\u88b7\u845c\u4f49\u50f9\u51be\u54ad\u5736\u5ba2\u5e22\u6118\u62b2\u62e4\u6308\u63e2\u6433\u64d6\u696c\u6b8e\u75b4\u77fb\u7848\u78cd\u7d5c\u8dd2\u9160\u9790\u9b9a\u9c92",qian:"\u524d\u94b1\u5343\u7275\u6d45\u7b7e\u6b20\u94c5\u5d4c\u948e\u8fc1\u94b3\u4e7e\u8c34\u8c26\u6f5c\u6b49\u7ea4\u6266\u9063\u9ed4\u5811\u4edf\u5c8d\u94a4\u8930\u7b9d\u63ae\u6434\u5029\u614a\u60ad\u6106\u8654\u82a1\u8368\u7f31\u4f65\u828a\u9621\u80b7\u831c\u6920\u728d\u9a9e\u4e79\u4ef1\u4f23\u4fd4\u5042\u5094\u50c9\u5119\u51c4\u51f5\u520b\u53b1\u550a\u55db\u5731\u5732\u5879\u5898\u58cd\u5977\u5a5c\u5a8a\u5b31\u5b45\u5b6f\u5be8\u5c92\u5d70\u5ede\u5fcf\u5ff4\u6093\u6173\u6272\u62d1\u62ea\u6333\u6394\u63c3\u63f5\u647c\u6481\u648d\u6496\u6510\u6511\u6513\u6701\u6744\u6774\u67d1\u68c8\u69a9\u69cf\u69e7\u6a6c\u6ab6\u6acf\u6b26\u6b3f\u6b41\u6b6c\u6c58\u6c67\u6d94\u6dd2\u6dfa\u6e10\u6e54\u6f38\u6f5b\u6ff3\u6ffd\u704a\u7052\u70b6\u7154\u7191\u71c2\u71eb\u727d\u7698\u7acf\u7b4b\u7b9e\u7bcf\u7bdf\u7c3d\u7c56\u7c64\u7c81\u7daa\u7e34\u7e7e\u7f9f\u7fa5\u7fac\u8125\u8171\u8181\u81e4\u824c\u82c2\u833e\u8355\u8465\u8474\u84a8\u8533\u8541\u85d6\u8688\u8699\u8738\u8ad0\u8b19\u8b74\u8c38\u8d76\u8ee1\u8f24\u9077\u91fa\u9206\u9210\u9246\u9257\u925b\u92ad\u92df\u930e\u9322\u937c\u9386\u93f2\u9431\u9453\u946f\u9513\u958b\u96c3\u976c\u97c6\u9845\u99af\u9a1a\u9a1d\u9a2b\u9b1c\u9b1d\u9c1c\u9c2c\u9cd2\u9cfd\u9d6e\u9dbc\u9e50\u9e63\u9eda\u9f66\u9f88",qiang:"\u5f3a\u67aa\u5899\u62a2\u8154\u545b\u7f8c\u8537\u5c06\u8723\u8dc4\u6217\u8941\u6215\u709d\u956a\u9516\u9535\u7f9f\u6a2f\u5af1\u5275\u52e5\u54d0\u5534\u554c\u55c6\u55f4\u588f\u58bb\u5b19\u5c07\u5d88\u5e86\u5ee7\u5f37\u5f4a\u6176\u6227\u63a7\u6436\u6464\u646a\u65a8\u690c\u69cd\u6aa3\u6bbb\u6eac\u6f12\u7197\u723f\u7244\u7246\u7310\u7347\u73b1\u7437\u7472\u77fc\u7b90\u7bec\u7e48\u7e66\u7f97\u7fa5\u7fab\u7fbb\u8262\u8503\u8594\u8620\u89aa\u8b12\u8deb\u8e4c\u8e61\u9306\u9397\u93d8\u93f9\u9869\u9dac\u9e27",qiao:"\u6865\u77a7\u6572\u5de7\u7fd8\u9539\u58f3\u9798\u64ac\u6084\u4fcf\u7a8d\u96c0\u4e54\u4fa8\u5ced\u6a47\u6a35\u835e\u8df7\u7857\u6194\u8c2f\u9792\u6100\u7f32\u8bee\u5281\u5062\u50d1\u50fa\u524a\u52ea\u55ac\u55bf\u563a\u566d\u5859\u589d\u58a7\u58bd\u5af6\u5ce4\u5d6a\u5da0\u5e29\u5e53\u5e67\u6101\u62db\u634e\u641e\u646e\u64bd\u656b\u6821\u69d7\u6a4b\u6a7e\u6bbc\u6bc3\u6bf3\u6f50\u7126\u7133\u71c6\u71cb\u729e\u7644\u7744\u785a\u785d\u78bb\u78dd\u78fd\u7904\u7909\u7aaf\u7ac5\u7bbe\u7e51\u7e70\u7ff9\u832d\u834d\u83ec\u8549\u854e\u85ee\u87dc\u8a9a\u8b51\u8b59\u8dab\u8dac\u8de4\u8e03\u8e0d\u8e7a\u8e7b\u8e88\u90fb\u9117\u9121\u9125\u91ae\u91e5\u929a\u936b\u936c\u93d2\u9408\u9430\u94eb\u9657\u97a9\u97bd\u97d2\u981d\u9864\u9866\u9a55\u9a84\u9ab9\u9ada\u9adc",qie:"\u5207\u4e14\u602f\u7a83\u8304\u780c\u90c4\u8d84\u60ec\u9532\u59be\u7ba7\u614a\u4f3d\u6308\u5022\u503f\u507c\u5327\u5392\u553c\u558b\u5951\u5a55\u5aab\u5e39\u608f\u611c\u6377\u6705\u6904\u6c8f\u6d2f\u6dc1\u6f06\u758c\u767f\u7a27\u7a55\u7aca\u7b21\u7bcb\u7c61\u7dc1\u807a\u811e\u82c6\u857a\u85d2\u86e3\u86ea\u8a67\u8dd9\u8e25\u9365\u9411\u9b65\u9bdc\u9c08\u9cbd",qin:"\u4eb2\u7434\u4fb5\u52e4\u64d2\u5bdd\u79e6\u82b9\u6c81\u79bd\u94a6\u5423\u8983\u77dc\u887e\u82a9\u6eb1\u5ed1\u55ea\u8793\u5659\u63ff\u6a8e\u9513\u512d\u53aa\u5422\u551a\u5745\u57c1\u57d0\u5807\u5890\u5a87\u5ac0\u5bd1\u5be2\u5bf4\u5d5a\u5d94\u5d9c\u5e88\u5ede\u5ff4\u616c\u61c3\u61c4\u6272\u628b\u6366\u6407\u64b3\u65b3\u6611\u68ab\u69ff\u6a6c\u6aec\u6b3d\u6d78\u6d81\u6e17\u6ef2\u6fbf\u6fc5\u7019\u73e1\u7439\u763d\u77dd\u7b09\u7d85\u8039\u80a3\u81e4\u83e3\u83e6\u83f3\u84c1\u8572\u85fd\u8604\u8699\u87bc\u8804\u887f\u89aa\u8a9b\u8d7a\u8d7e\u9202\u920a\u9219\u92df\u96c2\u9772\u981c\u9849\u9869\u988c\u99f8\u9a8e\u9b35\u9bbc\u9cf9",qing:"\u8bf7\u8f7b\u6e05\u9752\u60c5\u6674\u6c22\u503e\u5e86\u64ce\u9877\u4eb2\u537f\u6c30\u570a\u8b26\u6aa0\u7b90\u82d8\u873b\u9ee5\u7f44\u9cad\u78ec\u7dae\u5029\u50be\u512c\u51ca\u5260\u52cd\u5568\u57e5\u58f0\u591d\u5a87\u5bc8\u5ebc\u5ece\u6176\u6385\u64cf\u6692\u68fe\u6a08\u6abe\u6ae6\u6b91\u6bb8\u6c2b\u6d87\u6df8\u6e39\u6f00\u6fea\u73aa\u7520\u7858\u785c\u7883\u7cbe\u7daa\u80dc\u8394\u845d\u8acb\u8efd\u8f15\u90ec\u944b\u9751\u9758\u9803\u9bd6\u9d84",qiong:"\u7a77\u743c\u8deb\u7a79\u909b\u86e9\u8315\u928e\u7b47\u511d\u536d\u5b1b\u5b86\u60f8\u618c\u684f\u6a69\u712a\u712d\u7162\u718d\u7401\u749a\u74ca\u74d7\u7758\u778f\u7aae\u7ac6\u7b3b\u823c\u85d1\u85ed\u86ec\u8d79\u97a0",qiu:"\u6c42\u7403\u79cb\u4e18\u6cc5\u4ec7\u90b1\u56da\u914b\u9f9f\u6978\u86af\u88d8\u7cd7\u8764\u5def\u9011\u4fc5\u866c\u8d47\u9cc5\u72b0\u6e6b\u9f3d\u9052\u4e20\u533a\u53b9\u53f4\u5512\u56e2\u5775\u5a9d\u5bbf\u5bc8\u5d37\u5df0\u6058\u60c6\u6100\u624f\u6344\u641d\u6739\u6882\u6af9\u6b8f\u6bec\u6c3d\u6c3f\u6c53\u6d57\u6e1e\u6e6c\u6e6d\u716a\u726b\u738c\u7486\u76b3\u76da\u79cc\u7a50\u7bcd\u7d0c\u7d7f\u7de7\u808d\u827d\u838d\u8429\u84f2\u8612\u866f\u86f7\u8775\u87d7\u8824\u89d3\u89e9\u8a04\u8a05\u8cd5\u8d9c\u8da5\u900e\u90ba\u9194\u91d3\u91da\u91fb\u92b6\u9486\u97a6\u97a7\u9997\u9b82\u9bc4\u9c0c\u9c0d\u9c3d\u9c43\u9ce9\u9d6d\u9d96\u9e20\u9e59\u9f9c\u9f9d",qu:"\u53bb\u53d6\u533a\u5a36\u6e20\u66f2\u8d8b\u8da3\u5c48\u9a71\u86c6\u8eaf\u9f8b\u620c\u883c\u8627\u795b\u8556\u78f2\u52ac\u8bce\u9e32\u9612\u9eb4\u766f\u8862\u9ee2\u74a9\u6c0d\u89d1\u86d0\u6710\u77bf\u5c96\u82e3\u4f39\u4f49\u4f62\u521e\u5324\u5337\u5340\u53ba\u53e5\u547f\u5765\u5ca8\u5cb4\u5d87\u5de8\u5f06\u5fc2\u601a\u6188\u6235\u62be\u657a\u65aa\u6b0b\u6b2a\u6bc6\u6d40\u6ded\u7048\u710c\u7496\u7ad8\u7aec\u7b41\u7c67\u7cac\u7d36\u7d44\u7d47\u7ec4\u7fd1\u7ff5\u801d\u80ca\u80e0\u8125\u81de\u83c3\u844b\u86bc\u8721\u877a\u87b6\u87dd\u8837\u8850\u88aa\u89b0\u89b7\u89bb\u8a53\u8a58\u8a87\u8ab3\u8d8d\u8d9c\u8da8\u8dd4\u8dd9\u8dfc\u8ea3\u8ec0\u8ee5\u8ff2\u907d\u90e5\u9264\u943b\u947a\u95b4\u95c3\u9639\u97a0\u97ab\u99c6\u99c8\u9a36\u9a45\u9a7a\u9af7\u9b7c\u9b88\u9c38\u9c4b\u9d1d\u9d8c\u9e1c\u9eae\u9eaf\u9eb9\u9f01\u9f29\u9f72\u531a",quan:"\u5168\u6743\u529d\u5708\u62f3\u72ac\u6cc9\u5238\u98a7\u75ca\u919b\u94e8\u7b4c\u7efb\u8be0\u8f81\u754e\u9b08\u609b\u8737\u8343\u4f7a\u52e7\u52f8\u5377\u5573\u570f\u5733\u57e2\u59fe\u5a58\u5b49\u5cd1\u5dcf\u5dfb\u5f2e\u606e\u60d3\u62f4\u6372\u643c\u6812\u684a\u68ec\u6926\u697e\u69eb\u6a29\u6b0a\u6c71\u6d24\u6e76\u7065\u70c7\u7276\u7277\u7288\u737e\u742f\u7454\u753d\u77d4\u7842\u7d14\u7d5f\u7da3\u7e13\u7eaf\u8143\u8472\u8647\u8838\u89e0\u8a6e\u8b1c\u8b54\u8de7\u8e21\u8f07\u9144\u9293\u9409\u95ce\u97cf\u9874\u99e9\u9a21\u9c01\u9cc8\u9e1b\u9e73\u9f64\u72ad",que:"\u5374\u7f3a\u786e\u96c0\u7638\u9e4a\u7094\u69b7\u9619\u9615\u60ab\u5095\u51b3\u537b\u57c6\u5859\u58a7\u5c48\u5d05\u6128\u6164\u6409\u6509\u6560\u6bbb\u6bc3\u6c4b\u6c7a\u71e9\u730e\u7361\u76b5\u785e\u788f\u78ba\u78bb\u7910\u792d\u8203\u8204\u828d\u849b\u8697\u8d9e\u8e16\u8ea4\u95cb\u95d5\u96ba\u9ce5\u9d72",qun:"\u7fa4\u88d9\u9e87\u9021\u56f7\u590b\u5bad\u5cee\u5e2c\u6b4f\u7b98\u7fa3\u88e0\u8e06\u8f11\u9041\u9e8f\u9e95",ra:"\u4ebd\u7f56",ram:"\u56d5",ran:"\u67d3\u71c3\u7136\u5189\u9aef\u82d2\u86ba\u5184\u536a\u5465\u562b\u59cc\u5aa3\u67df\u6a6a\u71af\u73c3\u7e4e\u80b0\u8211\u8485\u86a6\u887b\u8887\u88a1\u8e68\u9ae5",rang:"\u8ba9\u56b7\u74e4\u6518\u58e4\u7a70\u79b3\u5134\u52f7\u58cc\u5b43\u5fc0\u61f9\u6b00\u703c\u7219\u737d\u7a63\u7e95\u8618\u8830\u8b72\u8b93\u8e9f\u9472\u9576\u9b24",rao:"\u9976\u7ed5\u6270\u835b\u6861\u5a06\u5b08\u6320\u6493\u64fe\u6a48\u72aa\u7a58\u7e5a\u7e5e\u7f2d\u8558\u87ef\u8953\u9076\u96a2\u9952",re:"\u70ed\u82e5\u60f9\u558f\u504c\u637c\u6e03\u71b1\u8e43",ren:"\u4eba\u4efb\u5fcd\u8ba4\u5203\u4ec1\u97e7\u598a\u7eab\u58ec\u996a\u8f6b\u4ede\u834f\u845a\u887d\u7a14\u4eed\u513f\u5204\u59d9\u5c7b\u5fc8\u5fce\u6041\u6268\u6732\u6752\u6820\u6823\u6895\u68ef\u6d8a\u7263\u79c2\u79f9\u7d09\u7d1d\u7d4d\u7d9b\u7eb4\u8095\u814d\u82a2\u8375\u83cd\u88b5\u8a12\u8a8d\u8bb1\u8eb5\u8ed4\u91f0\u9213\u928b\u976d\u9771\u97cc\u98ea\u9901\u9b5c\u9d40\u4ebb",ri:"\u65e5\u56f8\u6c1c\u91f0\u9224\u99b9\u9a72",rong:"\u5bb9\u7ed2\u878d\u6eb6\u7194\u8363\u620e\u84c9\u5197\u8338\u6995\u72e8\u5d58\u809c\u877e\u5087\u509b\u5748\u5ab6\u5ac6\u5b2b\u5b82\u5cf5\u5d64\u5db8\u5dc6\u6408\u6411\u6449\u66e7\u6804\u69ae\u69b5\u6be7\u6c04\u701c\u70ff\u7203\u7462\u7a41\u7a43\u7d68\u7e19\u7e1f\u7f1b\u7fa2\u8319\u878e\u8811\u8923\u8ef5\u9394\u9555\u9694\u980c\u9882\u99e5\u9af6",rou:"\u8089\u63c9\u67d4\u7cc5\u8e42\u97a3\u53b9\u5a83\u5b8d\u697a\u6e18\u7163\u7448\u74c7\u79b8\u7c88\u816c\u83a5\u8447\u875a\u8f2e\u9352\u9450\u97d6\u9a25\u9af3\u9c07\u9d94",ru:"\u5982\u5165\u6c5d\u5112\u8339\u4e73\u8925\u8fb1\u8815\u5b7a\u84d0\u8966\u94f7\u5685\u7f1b\u6fe1\u85b7\u98a5\u6ebd\u6d33\u4f9e\u5044\u543a\u54ae\u55d5\u5973\u5ab7\u5b2c\u5dbf\u5e24\u6256\u6310\u64e9\u66d8\u6708\u6741\u6847\u6abd\u6e2a\u71f8\u7373\u7b4e\u7e1f\u7e7b\u8089\u8097\u81d1\u8498\u8560\u88bd\u8fbc\u909a\u910f\u91b9\u92a3\u9450\u9700\u986c\u9c6c\u9cf0\u9d11\u9d3d",rua:"\u633c",ruan:"\u8f6f\u962e\u670a\u5044\u5827\u58d6\u5a86\u5af0\u611e\u648b\u6abd\u6e2a\u6fe1\u71f8\u744c\u74c0\u789d\u791d\u7ddb\u800e\u815d\u8761\u8edf\u8f2d\u9700",rui:"\u745e\u854a\u9510\u777f\u82ae\u868b\u6798\u8564\u514a\u514c\u5151\u5167\u5185\u53e1\u58e1\u5a51\u60e2\u6290\u648b\u6875\u68c1\u6a64\u6c6d\u7524\u7b0d\u7d8f\u7dcc\u7e60\u7ee5\u82fc\u854b\u8602\u8603\u8739\u8e12\u9209\u92b3\u92ed\u93f8\u94a0",run:"\u6da6\u95f0\u648b\u6a4d\u6f64\u958f\u95a0",ruo:"\u82e5\u5f31\u7bac\u504c\u53d2\u5a7c\u5d76\u60f9\u633c\u637c\u648b\u6949\u6e03\u6eba\u712b\u7207\u7bdb\u82ae\u84bb\u9100\u9c19\u9c2f\u9db8",sa:"\u6492\u6d12\u8428\u6332\u4ee8\u5345\u98d2\u810e\u644b\u6503\u686c\u6aab\u6ad2\u6bba\u6ce7\u6f75\u7051\u7e9a\u8521\u856f\u85a9\u8a2f\u8ea0\u9212\u939d\u93fe\u9491\u96a1\u9705\u9778\u9788\u98af\u99ba",saeng:"\u680d",sai:"\u585e\u816e\u9cc3\u601d\u8d5b\u567b\u50ff\u55ee\u5625\u6122\u63cc\u6be2\u6bf8\u7c11\u7c3a\u8cfd\u984b\u9c13",sal:"\u4e77\u8644",san:"\u4e09\u6563\u4f1e\u53c1\u9993\u7cc1\u6bf5\u9730\u4fd5\u5098\u50aa\u5381\u53c2\u53c3\u53c4\u53c5\u58ed\u5e34\u5f0e\u6a75\u6bf6\u6bff\u6f75\u7299\u7cc2\u7cdd\u7ce3\u7ce4\u7e56\u8518\u8b32\u93d2\u93fe\u9590\u994a\u9b16\u5f61\u6c35",sang:"\u6851\u4e27\u55d3\u98a1\u78c9\u6421\u55aa\u6852\u69e1\u7e95\u892c\u939f\u9859",sao:"\u626b\u5ac2\u6414\u9a9a\u68a2\u57fd\u9ccb\u81ca\u7f2b\u7619\u54e8\u6145\u61c6\u6383\u63bb\u6a7e\u6c09\u6e9e\u7170\u71e5\u77c2\u7e3f\u7e45\u7e70\u7f32\u9135\u9430\u98be\u9a12\u9a37\u9ade\u9bf5\u9c20\u9c3a\u9c62\u9cb9",se:"\u8272\u6da9\u745f\u585e\u556c\u94ef\u7a51\u55c7\u5be8\u5ee7\u612c\u61ce\u62fa\u64cc\u681c\u69ed\u6b6e\u6b70\u6ce3\u6d13\u6e0b\u6e0d\u6eb9\u6f2c\u6f80\u6f81\u6fc7\u6fcf\u7012\u7417\u74b1\u7637\u7a61\u7a6f\u7ca3\u7e6c\u8537\u8594\u8669\u8b45\u8f56\u924d\u92ab\u938d\u93a9\u93fc\u94cb\u94e9\u95df\u96ed\u98cb",sed:"\u88c7",sei:"\u6d81\u8053",sen:"\u68ee\u63ba\u647b\u69ee\u6e17\u6ef2\u7bf8\u8942",seng:"\u50e7\u9b19",seo:"\u95aa",seon:"\u7e07",sha:"\u6740\u6c99\u5565\u7eb1\u50bb\u7802\u5239\u838e\u53a6\u715e\u6749\u55c4\u553c\u9ca8\u970e\u94e9\u75e7\u88df\u6332\u6b43\u4e77\u503d\u510d\u524e\u5526\u5551\u55a2\u564e\u5e39\u5ec8\u6331\u63a5\u6442\u6444\u644b\u651d\u699d\u6a27\u6bba\u6fc8\u7300\u7870\u7b91\u7c86\u7d17\u7e4c\u7e7a\u7fdc\u7fe3\u83e8\u8410\u8531\u8cd2\u8cd6\u8d4a\u93a9\u95af\u95b7\u9705\u9b66\u9bca\u9bcb",shai:"\u6652\u7b5b\u8272\u917e\u644b\u6526\u66ec\u6bba\u7be9\u7c01\u7c1b\u7c6d\u7e7a\u8853\u8af0\u95b7",shan:"\u5c71\u95ea\u886b\u5584\u6247\u6749\u5220\u717d\u5355\u73ca\u63ba\u8d61\u6805\u82eb\u63b8\u81b3\u9655\u6c55\u64c5\u7f2e\u5b17\u87ee\u829f\u7985\u8dda\u912f\u6f78\u9cdd\u59d7\u5261\u9a9f\u759d\u81bb\u8baa\u9490\u8222\u57cf\u5093\u50d0\u50e4\u5103\u510b\u522a\u527c\u5358\u55ae\u5607\u5738\u58a0\u58a1\u58c7\u59cd\u5da6\u5e53\u633b\u639e\u6400\u6427\u647b\u64d4\u6519\u657e\u6671\u66cf\u66d1\u6763\u67f5\u692b\u6a3f\u6a80\u6a86\u6afc\u6f6c\u6f98\u6fb9\u7057\u70b6\u70fb\u7154\u718c\u72e6\u732d\u75c1\u7752\u78f0\u79aa\u7a47\u7b18\u7b27\u7e3f\u7e55\u7e94\u7fb4\u7fb6\u8120\u8460\u852a\u87ec\u87fa\u8942\u8973\u89a2\u8a15\u8b06\u8b71\u8d0d\u8d78\u8ed5\u9093\u9096\u91e4\u928f\u9425\u9583\u9584\u958a\u965d\u9843\u986b\u98a4\u994d\u9a38\u9bc5\u9c53\u9c54\u9c63\u9ce3\u5f61\u51f5\u9adf",shang:"\u4e0a\u4f24\u5c1a\u5546\u8d4f\u664c\u5892\u6c64\u88f3\u71b5\u89de\u7ef1\u6b87\u57a7\u4e04\u4ee9\u50b7\u573a\u57eb\u5834\u5872\u5c19\u6066\u6113\u616f\u6244\u6ba4\u6e6f\u6ef3\u6f21\u7993\u7dd4\u850f\u87aa\u8830\u89f4\u8b2a\u8cde\u8e3c\u945c\u979d\u9b3a",shao:"\u5c11\u70e7\u634e\u54e8\u52fa\u68a2\u7a0d\u90b5\u97f6\u7ecd\u828d\u53ec\u9798\u82d5\u52ad\u6f72\u8244\u86f8\u7b72\u4f4b\u524a\u5372\u5a0b\u5f30\u62db\u641c\u65d3\u67d6\u6eb2\u713c\u71d2\u71ff\u73bf\u7744\u7b24\u7d39\u7d83\u7da4\u7ee1\u83a6\u8414\u8437\u8571\u8891\u8f0e\u97a9\u97d2\u98b5\u9afe\u9bb9\u6753",she:"\u793e\u5c04\u86c7\u8bbe\u820c\u6444\u820d\u6298\u6d89\u8d4a\u8d66\u6151\u5962\u6b59\u538d\u7572\u731e\u9e9d\u6ee0\u4f58\u5399\u5953\u5f3d\u6174\u61fe\u62b4\u62fe\u6315\u6368\u63f2\u6442\u6475\u651d\u6aa8\u6b07\u6dbb\u6e09\u7044\u756c\u776b\u789f\u78fc\u8042\u8076\u820e\u8449\u850e\u8675\u86de\u86e5\u8802\u8a2d\u8cd2\u8cd6\u8f0b\u95cd\u9607\u97a8\u97d8\u9a07",shen:"\u8eab\u4f38\u6df1\u5a76\u795e\u751a\u6e17\u80be\u5ba1\u7533\u6c88\u7ec5\u547b\u53c2\u7837\u4ec0\u5a20\u614e\u845a\u7cc1\u8398\u8bdc\u8c02\u77e7\u6939\u6e16\u8703\u54c2\u80c2\u4f14\u4f81\u4fba\u4fe1\u515f\u53c3\u53c4\u53c5\u5432\u5607\u5814\u59bd\u59fa\u5ac0\u5b38\u5b5e\u5bb7\u5be9\u5c7e\u5cf7\u5e53\u5f1e\u613c\u625f\u628c\u62bb\u6437\u661a\u66cb\u67db\u68ef\u692e\u698a\u69ee\u6c20\u6d81\u6df0\u6ef2\u700b\u71ca\u73c5\u7521\u7527\u7606\u762e\u7712\u7718\u778b\u77ab\u77e4\u7973\u7a7c\u7c76\u7c78\u7d33\u7d9d\u7f59\u7f67\u8124\u814e\u8460\u84e1\u8518\u8593\u8704\u88d1\u89be\u8a20\u8a37\u8a75\u8ad7\u8b85\u8c09\u90a5\u926e\u92e0\u9707\u9823\u99ea\u9b6b\u9bc5\u9bd3\u9bf5\u9c30\u9c3a\u9cb9\u9d62\u9eee",sheng:"\u58f0\u7701\u5269\u751f\u5347\u7ef3\u80dc\u76db\u5723\u7525\u7272\u4e58\u665f\u6e11\u771a\u7b19\u5d4a\u4e1e\u4e57\u5057\u51bc\u5270\u52dd\u544f\u57a9\u58ad\u59d3\u5a0d\u5ab5\u61b4\u6598\u6607\u6660\u66fb\u67a1\u69ba\u6a73\u6b85\u6bb8\u6ce9\u6e3b\u6e66\u6fa0\u713a\u72cc\u73c4\u741e\u7538\u7ad4\u7bb5\u7e04\u7e69\u8056\u8072\u82fc\u8542\u8b5d\u8cb9\u8cf8\u924e\u935f\u9629\u965e\u9679\u9c66\u9d7f\u9f2a",shi:"\u662f\u4f7f\u5341\u65f6\u4e8b\u5ba4\u5e02\u77f3\u5e08\u8bd5\u53f2\u5f0f\u8bc6\u8671\u77e2\u62fe\u5c4e\u9a76\u59cb\u4f3c\u5618\u793a\u58eb\u4e16\u67ff\u5319\u62ed\u8a93\u901d\u52bf\u4ec0\u6b96\u5cd9\u55dc\u566c\u5931\u9002\u4ed5\u4f8d\u91ca\u9970\u6c0f\u72ee\u98df\u6043\u8680\u89c6\u5b9e\u65bd\u6e7f\u8bd7\u5c38\u8c55\u83b3\u57d8\u94c8\u8210\u9ca5\u9cba\u8d33\u8f7c\u84cd\u7b6e\u70bb\u8c25\u5f11\u917e\u87ab\u4e17\u4e68\u4e8a\u4f40\u4f66\u5158\u519f\u52e2\u534b\u5394\u53d3\u545e\u5469\u54b6\u5511\u5547\u5653\u57f6\u5824\u5852\u596d\u59fc\u5a9e\u5b15\u5b9f\u5ba9\u5bb2\u5bd4\u5be6\u5bfa\u5c4d\u5cd5\u5d3c\u5d75\u5e2b\u5f12\u5f56\u5fa5\u5fd5\u5fef\u6040\u60ff\u623a\u63d0\u63d3\u65af\u65f9\u6630\u6642\u67be\u67f9\u683b\u6974\u6981\u69af\u6aa1\u6c41\u6cb6\u6d02\u6d49\u6db2\u6e5c\u6e64\u6ea1\u6eae\u6ebc\u6fa4\u6fa8\u6fd5\u70d2\u7176\u72e7\u72f6\u7345\u7461\u7564\u75d1\u7702\u770e\u7721\u7757\u793b\u794f\u79b5\u79f2\u7acd\u7b36\u7b39\u7b5b\u7bb7\u7bd2\u7be9\u7c2d\u7c42\u7c6d\u7d41\u7e79\u7ece\u8006\u80a2\u80d1\u820d\u8213\u8479\u8492\u8494\u8755\u8768\u8906\u8937\u896b\u8979\u8996\u89e2\u8a11\u8a66\u8a69\u8adf\u8ae1\u8b1a\u8b58\u8cb0\u8d6b\u8de9\u8efe\u8fbb\u9048\u905e\u9069\u9070\u907e\u90bf\u90dd\u91b3\u91c3\u91c8\u91cb\u91f6\u9230\u9242\u9243\u9247\u9248\u9250\u927d\u92b4\u9349\u9366\u93a9\u94ca\u94e9\u98e0\u98ed\u98fe\u9919\u991d\u9963\u996c\u99b6\u99db\u9b73\u9b96\u9bf4\u9c18\u9c23\u9c24\u9cf2\u9cfe\u9db3\u9e24\u9f2b\u9f2d\u9f5b\u9f65",shou:"\u624b\u53d7\u6536\u9996\u5b88\u7626\u6388\u517d\u552e\u719f\u5bff\u824f\u72e9\u7ef6\u53ce\u563c\u57a8\u58fd\u5900\u624c\u63b1\u654a\u6d9b\u6dad\u6fe4\u7363\u7378\u75e9\u7dac\u8184\u91bb\u93c9",shu:"\u4e66\u6811\u6570\u719f\u8f93\u68b3\u53d4\u5c5e\u675f\u672f\u8ff0\u8700\u9ecd\u9f20\u6dd1\u8d4e\u5b70\u852c\u758f\u620d\u7ad6\u5885\u5eb6\u85af\u6f31\u6055\u67a2\u6691\u6b8a\u6292\u66d9\u7f72\u8212\u59dd\u6445\u79eb\u7ebe\u6cad\u6bf9\u8167\u587e\u83fd\u6bb3\u6f8d\u500f\u4fb8\u4fc6\u4fde\u4ff6\u5010\u5135\u516a\u54b0\u552e\u55fd\u5a36\u5a4c\u5b4e\u5c0c\u5c17\u5c6c\u5ebb\u5fec\u6037\u6086\u6348\u6352\u6393\u63c4\u6504\u6578\u668f\u66f8\u672e\u6731\u6778\u677c\u67d5\u6a1e\u6a39\u6a7e\u6bfa\u6c00\u6d91\u6f44\u6f4f\u6f7b\u6fd6\u702d\u7102\u7479\u74b9\u758b\u758e\u7659\u7a0c\u7aea\u7c54\u7cec\u7d13\u7d35\u7d49\u7d80\u7fdb\u8357\u837c\u8481\u84a3\u85a5\u85ae\u85ea\u85f7\u866a\u8834\u883e\u8853\u88cb\u8961\u8969\u8b36\u8c4e\u8c6b\u8d16\u8dfe\u8e08\u8ed7\u8f38\u900f\u9103\u91ce\u9265\u9330\u93e3\u9432\u956f\u964e\u9664\u9683\u9b9b\u9c6a\u9c70\u9d68\u9d90\u9df8\u9e00\u9e6c\u9f21\u5fc4\u4e28",shua:"\u5237\u800d\u5530\u5506\u6dae\u8a9c\u9009\u9078",shuai:"\u6454\u7529\u7387\u5e05\u8870\u87c0\u535b\u5e25\u7d8f\u7e17\u7ee5\u7f1e",shuan:"\u6813\u62f4\u95e9\u6dae\u5c08\u6812\u69eb\u6c55\u8168\u8e39\u9582",shuang:"\u53cc\u971c\u723d\u6cf7\u5b40\u50b1\u587d\u5b47\u6161\u6a09\u6b06\u6dd9\u6edd\u6f3a\u7027\u7040\u7935\u7e14\u826d\u93ef\u96d9\u9a3b\u9a66\u9aa6\u9dde\u9e18\u9e74",shui:"\u6c34\u8c01\u7761\u7a0e\u8bf4\u5a37\u5e28\u6329\u635d\u6c3a\u6d97\u6d9a\u7971\u7a05\u813d\u88de\u8aaa\u8aac\u8ab0\u9596\u6c35",shun:"\u987a\u542e\u77ac\u821c\u4fca\u5ddb\u5de1\u5ef5\u6042\u696f\u6a53\u7734\u779a\u77a4\u8563\u8f34\u9806\u9b0a",shuo:"\u8bf4\u6570\u7855\u70c1\u6714\u6420\u5981\u69ca\u84b4\u94c4\u54fe\u55cd\u55fd\u6b36\u6c4b\u6d2c\u6eaf\u6fef\u71ff\u720d\u7361\u7642\u77df\u78a9\u7bbe\u836f\u8437\u85e5\u8aaa\u8aac\u928f\u9399\u9460",shw:"\u6298",si:"\u56db\u6b7b\u4e1d\u6495\u4f3c\u79c1\u5636\u601d\u5bfa\u53f8\u65af\u98df\u4f3a\u5395\u8086\u9972\u55e3\u5df3\u801c\u9a77\u5155\u86f3\u53ae\u6c5c\u9536\u6cd7\u7b25\u549d\u9e36\u59d2\u53b6\u7f0c\u7940\u6f8c\u4fdf\u4e96\u4ee5\u4f40\u4f41\u4fa1\u4fec\u5072\u5082\u5129\u51d8\u53a0\u53f0\u565d\u5a30\u5aa4\u5b60\u5edd\u5f99\u6056\u6122\u676b\u6790\u67b1\u67f6\u68a9\u6952\u69b9\u6cc0\u6ce4\u6d0d\u6d98\u7003\u71cd\u726d\u78c3\u7960\u7997\u79a0\u79a9\u7ae2\u7c1b\u7cf8\u7cf9\u7d72\u7de6\u7f52\u7f73\u8082\u8084\u83e5\u856c\u857c\u8652\u8724\u8784\u8794\u87d6\u87f4\u8997\u8b15\u8c84\u9018\u91f2\u9236\u923b\u9270\u9289\u92af\u92d6\u9376\u9401\u96c9\u98b8\u98d4\u98e4\u98f4\u98fc\u9974\u99df\u9a03\u9a26\u9dc9\u9de5\u9e97\u9f36\u706c",so:"\u87a6",sol:"\u4e7a",song:"\u9001\u677e\u8038\u5b8b\u9882\u8bf5\u6002\u8bbc\u7ae6\u83d8\u6dde\u609a\u5d69\u51c7\u5d27\u5fea\u502f\u50b1\u5405\u5a00\u5d77\u5eba\u612f\u616b\u6181\u61bd\u6352\u6374\u63d4\u6457\u6780\u67a9\u67d7\u68a5\u68c7\u6964\u6aa7\u6f0e\u6fcd\u7879\u8073\u84ef\u8634\u8719\u8a1f\u8aa6\u9376\u93b9\u9536\u980c\u9938\u99f7\u9b06",sou:"\u8258\u641c\u64de\u55fd\u55fe\u55d6\u98d5\u53df\u85ae\u953c\u998a\u778d\u6eb2\u878b\u5081\u51c1\u53dc\u5ec0\u5ecb\u6352\u635c\u6457\u64a8\u64fb\u6555\u65cf\u68f7\u6ae2\u6b36\u6d91\u6f5a\u7340\u7636\u7c54\u8490\u84c3\u85ea\u8b0f\u910b\u9199\u93aa\u93c9\u98bc\u98be\u993f\u9a2a",su:"\u7d20\u901f\u8bc9\u5851\u5bbf\u4fd7\u82cf\u8083\u7c9f\u9165\u7f29\u6eaf\u50f3\u612b\u7c0c\u89eb\u7a23\u5919\u55c9\u8c21\u850c\u6d91\u5083\u50c1\u5379\u55d6\u56cc\u5731\u5732\u57e3\u5850\u5aca\u612c\u619f\u637d\u642c\u6475\u6880\u68f4\u69a1\u6a0e\u6a15\u6a5a\u6aef\u6b90\u6cdd\u6d2c\u6eb8\u6f5a\u6f65\u738a\u73df\u749b\u7526\u78bf\u7a21\u7a24\u7a4c\u7aa3\u7c9b\u7e24\u7e2e\u8085\u8186\u83a4\u85d7\u8607\u8613\u8a34\u8b16\u8d9a\u8e5c\u9061\u906c\u92c9\u9917\u9a4c\u9a95\u9bc2\u9c50\u9deb\u9e54",suan:"\u9178\u7b97\u849c\u72fb\u5334\u64b0\u75e0\u7958\u7b07\u7b6d\u7bf9\u9009\u9078",sui:"\u5c81\u968f\u788e\u867d\u7a57\u9042\u5c3f\u968b\u9ad3\u7ee5\u96a7\u795f\u772d\u8c07\u6fc9\u9083\u71e7\u837d\u7762\u4e97\u5020\u54f8\u55fa\u57e3\u590a\u5a1e\u5b18\u5d57\u633c\u65de\u6a96\u6b72\u6b73\u6bf8\u6d7d\u6ed6\u6fbb\u7021\u716b\u71a3\u74b2\u74cd\u775f\u7815\u79ad\u7a42\u7a5f\u7c11\u7c8b\u7cb9\u7d8f\u7e17\u7e40\u7e50\u7e78\u7f1e\u813a\u81b8\u8295\u837e\u838e\u8470\u84d1\u895a\u8ab6\u8b62\u8ce5\u9040\u9057\u907a\u93f8\u9406\u9429\u964f\u968a\u96a8\u96d6\u9743\u9796\u97e2\u9ac4",sun:"\u5b59\u635f\u7b0b\u69ab\u836a\u98e7\u72f2\u96bc\u55b0\u5b6b\u5dfa\u627b\u640d\u640e\u644c\u6811\u69c2\u6f60\u733b\u7543\u7b4d\u7bb0\u7c28\u84c0\u8575\u859e\u8de3\u93a8\u98f1\u9910\u9dbd",suo:"\u6240\u7f29\u9501\u7410\u7d22\u68ad\u84d1\u838e\u5506\u6332\u7743\u55cd\u5522\u686b\u55e6\u5a11\u7fa7\u4e9b\u509e\u55e9\u5ac5\u5c81\u5d57\u60e2\u6284\u6331\u644d\u669b\u6b72\u6c99\u6e91\u6eb9\u727a\u72a7\u737b\u7411\u7463\u7485\u7c11\u7c14\u7e12\u7e2e\u838f\u8470\u8736\u8870\u8928\u8d96\u9021\u9024\u9388\u938d\u9396\u93bb\u93c1\u970d\u9743\u9aff\u9b66\u9bbb",ta:"\u4ed6\u5979\u5b83\u8e0f\u5854\u584c\u62d3\u736d\u631e\u8e4b\u6ebb\u8dbf\u9cce\u6c93\u69bb\u6f2f\u9062\u94ca\u95fc\u55d2\u4fa4\u509d\u547e\u549c\u5683\u56ba\u5896\u592a\u5d09\u6428\u642d\u6498\u64bb\u6999\u6bfe\u6dbe\u6e7f\u6e9a\u6fbe\u6fcc\u6fd5\u7260\u72e7\u737a\u7942\u79a2\u8345\u891f\u8abb\u8b76\u8e79\u8ea2\u8fbe\u8fcf\u8fd6\u9039\u9054\u905d\u9248\u9314\u9389\u9391\u95d2\u95df\u95e5\u9618\u9788\u9791\u979c\u97b3\u97c3\u9b99\u9c28",tae:"\u5788\u8968",tai:"\u592a\u62ac\u53f0\u6001\u80ce\u82d4\u6cf0\u915e\u6c70\u70b1\u80bd\u8dc6\u5454\u9c90\u949b\u85b9\u90b0\u9a80\u5113\u51ad\u548d\u56fc\u576e\u5927\u5933\u5964\u5b2f\u5b61\u5fd5\u5ff2\u614b\u64e1\u6584\u65f2\u67b1\u6aaf\u6e99\u6f26\u70b2\u71e4\u73c6\u7b88\u7c49\u7c8f\u80fd\u81fa\u8226\u83ed\u8a52\u8bd2\u8eda\u91d0\u9226\u9236\u98b1\u99d8\u9b90",tan:"\u8c08\u53f9\u63a2\u6ee9\u5f39\u78b3\u644a\u6f6d\u8d2a\u575b\u75f0\u6bef\u5766\u70ad\u762b\u8c2d\u574d\u6a80\u8892\u94bd\u90ef\u9561\u952c\u8983\u6fb9\u6619\u5fd0\u4f46\u5013\u509d\u50cb\u5103\u5574\u55ff\u5606\u563d\u563e\u57ee\u58b0\u58b5\u58c7\u58dc\u5a52\u5f3e\u5f48\u6039\u60d4\u619b\u61b3\u61bb\u63b8\u64a2\u64a3\u64f9\u6524\u66ba\u66c7\u6983\u6a5d\u6b4e\u6c88\u6de1\u6e5b\u6e60\u6f22\u6f6c\u7058\u708e\u74ae\u75d1\u7649\u7671\u79aa\u7dc2\u7e75\u7f48\u7f4e\u80c6\u8211\u8214\u8215\u8368\u83fc\u8541\u8548\u85eb\u88e7\u8962\u8ac7\u8b5a\u8b60\u8c9a\u8caa\u8ce7\u8d55\u9188\u9193\u91b0\u926d\u931f\u9843\u9924\u9de4\u9eee",tang:"\u8eba\u8d9f\u5802\u7cd6\u6c64\u5858\u70eb\u5018\u6dcc\u5510\u642a\u68e0\u819b\u87b3\u6a18\u7fb0\u91a3\u746d\u9557\u50a5\u9967\u6e8f\u8025\u5e11\u94f4\u8797\u4f16\u5052\u508f\u513b\u528f\u557a\u5621\u5763\u5d63\u5f39\u6113\u6203\u6269\u6465\u64f4\u6529\u66ed\u69b6\u6a56\u6b13\u6e6f\u6f1f\u6f21\u717b\u71d9\u7223\u77d8\u78c4\u799f\u7bd6\u7c1c\u7cc3\u7cdb\u8185\u8361\u84ce\u8569\u859a\u862f\u876a\u8d6f\u8e3c\u8e5a\u903f\u910c\u9395\u93b2\u93dc\u940b\u943a\u9482\u94db\u954b\u95b6\u95db\u95e3\u960a\u969a\u97ba\u9933\u9939\u9944\u9db6\u9ee8\u9f1e",tao:"\u5957\u638f\u9003\u6843\u8ba8\u6dd8\u6d9b\u6ed4\u9676\u7ee6\u8404\u9f17\u6d2e\u7118\u5555\u9955\u97ec\u53e8\u4ed0\u530b\u54b7\u5932\u5935\u59da\u5acd\u5e4d\u5f22\u6146\u62ad\u6311\u642f\u68bc\u69c4\u6aae\u6dad\u6fe4\u71fe\u746b\u7979\u7b79\u7c4c\u7d5b\u7da2\u7daf\u7e1a\u7e27\u7ef8\u7ef9\u872a\u88ea\u8a0e\u8a5c\u8b1f\u8df3\u8f41\u8fef\u9184\u92fe\u932d\u9780\u9789\u97b1\u97dc\u982b\u98f8\u9940\u99e3\u9a0a",teng:"\u75bc\u817e\u85e4\u8a8a\u6ed5\u50dc\u512f\u5e50\u6f1b\u75cb\u7c50\u7c58\u7e22\u81af\u8645\u87a3\u8b04\u9086\u972f\u99e6\u9a30\u9a63\u9c27\u9f1f",ti:"\u63d0\u66ff\u4f53\u9898\u8e22\u8e44\u5243\u5254\u68af\u9511\u557c\u6d95\u568f\u60d5\u5c49\u918d\u9e48\u7ee8\u7f07\u501c\u88fc\u9016\u8351\u608c\u4ff6\u504d\u5397\u5551\u55c1\u5694\u5943\u59fc\u5a82\u5a9e\u5c5c\u5d39\u5d5c\u5f1a\u5f1f\u5fa5\u5fb2\u6090\u60d6\u60ff\u623b\u6298\u632e\u63a6\u63e5\u64ff\u662f\u684b\u68e3\u6974\u6b52\u6ba2\u6d1f\u6e27\u6f3d\u72c4\u73f6\u7445\u74cb\u7747\u78ae\u78c3\u79b5\u7a0a\u7a49\u7c4a\u7d88\u7df9\u7f64\u8086\u82d0\u855b\u8599\u8652\u876d\u87ec\u8879\u8905\u8906\u8a46\u8ae6\u8b15\u8bcb\u8c1b\u8da7\u8daf\u8dc3\u8e36\u8e4f\u8e8d\u8eb0\u8ec6\u8fbe\u8fcf\u8fd6\u9037\u9046\u9069\u92bb\u932b\u9357\u941f\u9521\u984c\u9a20\u9ab5\u9ad4\u9ae2\u9af0\u9b00\u9b04\u9ba7\u9bb7\u9bf7\u9cc0\u9d3a\u9d5c\u9d97\u9d99\u9dc8\u9dc9\u9de4\u624c",tian:"\u5929\u7530\u6dfb\u586b\u751c\u8214\u606c\u8146\u4f43\u63ad\u94bf\u9617\u5fdd\u6b84\u754b\u500e\u5172\u5178\u541e\u5451\u553a\u55d4\u5861\u5a17\u5a56\u5bd8\u5c47\u60bf\u6375\u6437\u666a\u681d\u6cba\u6cbe\u6ddf\u6e49\u6ec7\u7420\u7471\u74b3\u751b\u7538\u753a\u7547\u7551\u7560\u75f6\u76f7\u7753\u777c\u778b\u78b5\u78cc\u7ab4\u7d3e\u7dc2\u80cb\u8211\u821a\u82eb\u83fe\u8695\u86ba\u89a5\u89cd\u8cdf\u915f\u923f\u929b\u932a\u9369\u93ad\u93ae\u94e6\u9518\u9547\u95d0\u9754\u975d\u9766\u985a\u985b\u98a0\u9902\u9d2b\u9dc6\u9dcf\u9ec7",tiao:"\u6761\u8df3\u6311\u8c03\u8fe2\u773a\u9f86\u7b24\u7967\u8729\u9aeb\u4f7b\u7a95\u9ca6\u82d5\u7c9c\u5135\u54b7\u5541\u59da\u5b25\u5ba8\u5ca7\u5cb9\u5ea3\u604c\u65a2\u65eb\u6640\u6713\u6737\u6843\u689d\u6a24\u7952\u7a20\u7ab1\u7cf6\u7d69\u804e\u8101\u8129\u825e\u8280\u8414\u84da\u84e7\u84e8\u87a9\u899c\u8a82\u8abf\u8d85\u8d92\u8da0\u8e14\u929a\u92da\u93a5\u94eb\u9797\u982b\u9bc8\u9c37\u9f60",tie:"\u94c1\u8d34\u5e16\u841c\u992e\u50e3\u5360\u546b\u6017\u60f5\u8051\u86c8\u8776\u8cbc\u8dd5\u9244\u9246\u9295\u92e8\u9421\u9435\u9507\u98fb\u9a56\u9d29",ting:"\u542c\u505c\u633a\u5385\u4ead\u8247\u5ead\u5ef7\u70c3\u6c40\u753a\u839b\u94e4\u8476\u5a77\u8713\u6883\u9706\u4fb1\u4fb9\u539b\u5722\u5960\u5975\u5a17\u5d49\u5e81\u5e8d\u5ef0\u5ef3\u5fca\u686f\u695f\u69b3\u6d8f\u6e1f\u6fce\u70f4\u70f6\u73f5\u73fd\u7b73\u7d8e\u8013\u8064\u8074\u807c\u807d\u8121\u827c\u874f\u8a94\u8aea\u9092\u92cc\u95ae\u9793\u9832\u988b\u9f2e",tol:"\u4e6d",ton:"\u7364",tong:"\u540c\u901a\u75db\u94dc\u6876\u7b52\u6345\u7edf\u7ae5\u5f64\u6850\u77b3\u606b\u4f97\u916e\u6f7c\u833c\u4edd\u783c\u5cd2\u6078\u4f5f\u55f5\u578c\u5045\u50ee\u528f\u52ed\u54c3\u56f2\u5cc2\u5cdd\u5e9d\u607f\u615f\u6185\u664d\u66c8\u6723\u6a0b\u6a66\u6c03\u6d1e\u6d75\u6e69\u70b5\u70d4\u71a5\u71d1\u721e\u729d\u72ea\u735e\u75cc\u772e\u7850\u7867\u79f1\u7a5c\u7b69\u7ca1\u7d67\u7d71\u7d82\u81a7\u825f\u84ea\u8692\u873c\u87f2\u8855\u8a77\u8d68\u91cd\u9256\u9275\u9285\u9907\u9ba6\u9c96\u5182",tou:"\u5934\u5077\u900f\u6295\u94ad\u9ab0\u4ea0\u5078\u57f1\u59b5\u5a7e\u5aae\u6109\u6568\u65a2\u6b95\u7d0f\u7d89\u7df0\u7ee3\u8623\u8915\u8aed\u8af3\u8c15\u8c19\u9017\u92c0\u936e\u982d\u98f3\u9ec8",tu:"\u571f\u56fe\u5154\u6d82\u5410\u79c3\u7a81\u5f92\u51f8\u9014\u5c60\u9174\u837c\u948d\u83df\u580d\u4f59\u514e\u51c3\u550b\u555a\u56f3\u5716\u5717\u5721\u5817\u5857\u58bf\u5b8a\u5cf9\u5d5e\u5d80\u5ea9\u5edc\u6022\u6087\u6348\u6378\u63ec\u6455\u6581\u675c\u688c\u6aa1\u6c62\u6d8b\u6e65\u6f73\u7479\u75dc\u760f\u79bf\u7a0c\u7b61\u815e\u816f\u83b5\u8456\u84a4\u8d83\u8dcc\u8dff\u8fcc\u91f7\u922f\u92c0\u92f5\u934e\u999f\u99fc\u9d4c\u9d5a\u9d75\u9d9f\u9dcb\u9df5\u9f35",tuan:"\u56e2\u6e4d\u7583\u629f\u5f56\u526c\u5278\u56e3\u5715\u5718\u587c\u58a5\u5ae5\u5c08\u6171\u6476\u6566\u69eb\u6ab2\u6e6a\u6f19\u7153\u732f\u757d\u78da\u7a05\u7a0e\u7bff\u7cf0\u84f4\u890d\u8916\u8c92\u93c4\u9c44\u9d89\u9dd2\u9dfb\u9e51",tui:"\u817f\u63a8\u9000\u892a\u9893\u8715\u717a\u5fd2\u4fbb\u4fc0\u50d3\u554d\u58a4\u5a27\u5c35\u5f1a\u5f1f\u6022\u6a54\u7a05\u7a0e\u7a68\u8049\u812b\u812e\u8131\u84f7\u85ec\u8608\u86fb\u8b09\u8b89\u8e46\u8e6a\u8ffd\u96a4\u9839\u983a\u983d\u994b\u9988\u99fe\u9a29\u9abd\u9b4b",tun:"\u541e\u5c6f\u892a\u81c0\u56e4\u6c3d\u9968\u8c5a\u66be\u5428\u5434\u5451\u554d\u564b\u5749\u5e89\u5ff3\u619e\u65fd\u671c\u6c6d\u6c8c\u6d92\u7096\u711e\u71c9\u757d\u7a80\u7d14\u7eaf\u80ab\u81af\u81cb\u829a\u8733\u8c58\u8ed8\u9010\u932a\u9715\u98e9\u9b68\u9c80\u9ed7",tuo:"\u62d6\u8131\u6258\u59a5\u9a6e\u62d3\u9a7c\u692d\u553e\u9e35\u9640\u9b44\u6a50\u67dd\u8dce\u4e47\u5768\u4f57\u5eb9\u9161\u67c1\u9f0d\u6cb1\u7ba8\u7823\u4ed6\u4edb\u4f82\u4fbb\u5483\u5574\u563d\u5836\u5aa0\u5af7\u5b83\u5cae\u5f75\u60f0\u6261\u62d5\u6329\u635d\u64b1\u6754\u675d\u68c1\u6955\u69d6\u6a62\u6be4\u6bfb\u6c51\u6c60\u6cb0\u6db6\u7260\u72cf\u7824\u78a2\u78da\u7a05\u7a0e\u7c5c\u7d3d\u812b\u8203\u8204\u838c\u841a\u8600\u86c7\u87fa\u8889\u8898\u88a5\u8a11\u8a17\u8a51\u8aaa\u8aac\u8bac\u8bf4\u8dc5\u8e3b\u8ec3\u8fc6\u8fe4\u8ff1\u9248\u92d6\u94ca\u9624\u9641\u968b\u98e5\u9966\u99b1\u99b2\u99c4\u99dd\u99de\u9a28\u9a52\u9a5d\u9b60\u9b80\u9c16\u9c53\u9d15\u9d4e\u9f09\u9f27\u8235",uu:"\u5c57\u5f9a\u658f\u66e2\u6711\u685b\u6b5a\u6bdc\u6bdd\u6bee\u6d1c\u70ea\u7111\u713d\u71de\u7677\u76bc\u794d\u7a25\u8002\u8041\u8063\u8248\u8312\u848a\u84de\u85d4\u8672\u874a\u88b0\u8d18\u8ebc\u8faa\u9342\u93bc\u9422\u95e7\u973b\u9d91",wa:"\u6316\u74e6\u86d9\u54c7\u5a03\u6d3c\u51f9\u889c\u4f64\u5a32\u817d\u52b8\u5493\u5532\u5558\u55d7\u55e2\u59fd\u5aa7\u5c72\u5e13\u5f8d\u6432\u6528\u6c59\u6c5a\u6c61\u6e9b\u6f25\u74f2\u7556\u7819\u7a75\u7a8a\u7a90\u7aaa\u8049\u8183\u896a\u8b41\u90b7\u977a\u978b\u97c8\u97ce\u97e4\u9bad\u9c91\u9ef3\u9f03",wai:"\u5916\u6b6a\u5d34\u5459\u54bc\u558e\u592d\u7024\u7af5\u9861",wan:"\u5b8c\u4e07\u665a\u7897\u73a9\u5f2f\u633d\u6e7e\u4e38\u8155\u5b9b\u5a49\u70f7\u987d\u8c4c\u60cb\u5a29\u7696\u8513\u839e\u8118\u873f\u7efe\u8284\u742c\u7ea8\u525c\u7579\u83c0\u4e5b\u5007\u514d\u5173\u5213\u534d\u5350\u550d\u56ed\u57e6\u5846\u58ea\u5917\u5918\u59a7\u5a60\u5b6f\u5c8f\u5e35\u5f4e\u5fe8\u60cc\u628f\u6356\u6365\u6394\u6669\u667c\u670a\u6764\u689a\u6900\u69fe\u6c4d\u6db4\u6f6b\u6fab\u7063\u7413\u76cc\u7755\u7b02\u7ba2\u7d08\u7d7b\u7d84\u7da9\u7db0\u7feb\u8115\u82cb\u83a7\u83ac\u8416\u842c\u858d\u8696\u8ca6\u8cab\u8d03\u8d0e\u8d2f\u8e20\u8f10\u8f13\u909c\u9124\u92c4\u92d4\u92fa\u933d\u9350\u93ab\u95a2\u95d7\u95dc\u9811\u9aa9\u9aaa\u9aab\u9b6d",wang:"\u671b\u5fd8\u738b\u5f80\u7f51\u4ea1\u6789\u65fa\u6c6a\u5984\u8292\u8f8b\u9b4d\u60d8\u7f54\u4ebe\u4efc\u5166\u5321\u5c22\u5c23\u5c29\u5c2a\u5c2b\u5f7a\u5f83\u5f8d\u5ff9\u6282\u6680\u671a\u6722\u68e2\u7007\u7139\u741e\u7687\u76f3\u7db2\u83a3\u83f5\u869f\u86e7\u8744\u8ab7\u8f1e\u8fcb\u8fec",wei:"\u4e3a\u4f4d\u672a\u56f4\u5582\u80c3\u5fae\u5473\u5c3e\u4f2a\u5a01\u4f1f\u536b\u5371\u8fdd\u59d4\u9b4f\u552f\u7ef4\u754f\u60df\u97e6\u5dcd\u851a\u8c13\u5c09\u6f4d\u7eac\u6170\u6845\u840e\u82c7\u6e2d\u9057\u8473\u5e0f\u8249\u9c94\u5a13\u9036\u95f1\u9688\u6ca9\u73ae\u6da0\u5e37\u5d34\u9697\u8bff\u6d27\u504e\u7325\u732c\u5d6c\u8ece\u97ea\u709c\u7168\u5729\u8587\u75ff\u4eb9\u502d\u5049\u507d\u50de\u5130\u5383\u53de\u54d9\u5529\u55a1\u55b4\u5672\u56d7\u570d\u5824\u589b\u58dd\u5a81\u5a99\u5aa6\u5bea\u5cbf\u5cd7\u5cde\u5d23\u5d54\u5db6\u5dcb\u5e43\u5ec6\u5fab\u6051\u6104\u6107\u61c0\u6364\u637c\u63cb\u63fb\u649d\u64b1\u6596\u6690\u6709\u673a\u68b6\u6932\u6933\u6972\u6b08\u6c87\u6d08\u6d58\u6e28\u6e4b\u6e88\u6ea6\u6f59\u6f7f\u6fca\u6ff0\u6ffb\u7022\u70ba\u70d3\u7140\u7152\u715f\u71a8\u71ad\u71f0\u7232\u729a\u72a9\u7317\u731a\u741f\u744b\u748f\u74d7\u75cf\u7650\u7653\u772d\u77b6\u784a\u7859\u78a8\u78c8\u78d1\u7acb\u7dad\u7ded\u7def\u7e05\u7f7b\u8172\u829b\u829f\u82ff\u831f\u8371\u837d\u83cb\u840f\u8466\u8468\u848d\u84f6\u853f\u85b3\u85ef\u8636\u8732\u8739\u873c\u875b\u875f\u87b1\u885b\u885e\u893d\u89a3\u89b9\u89f9\u89fd\u89ff\u8a74\u8ac9\u8b02\u8b86\u8b8f\u8da1\u8e12\u8e13\u8e97\u8e9b\u8f4a\u9055\u907a\u912c\u9180\u9317\u934f\u9361\u93cf\u95c8\u9622\u9687\u96b9\u9728\u973a\u97cb\u97d1\u97d9\u97e1\u9820\u98b9\u9927\u9935\u9956\u9aa9\u9aaa\u9aab\u9b87\u9ba0\u9baa\u9c03\u9c04\u9c16\u9cc2\u9cda",wen:"\u95ee\u6587\u95fb\u7a33\u6e29\u543b\u868a\u7eb9\u761f\u7d0a\u6c76\u960c\u520e\u96ef\u74ba\u514d\u5445\u545a\u5461\u554f\u586d\u598f\u5a29\u5f63\u5fde\u5fdf\u6120\u614d\u6286\u63fe\u6435\u6627\u6637\u687d\u6985\u69b2\u6b7e\u6b81\u6b9f\u6e02\u6eab\u7086\u7174\u73f3\u7465\u7612\u773c\u7807\u7a4f\u7a69\u7b0f\u7d0b\u7d7b\u7dfc\u7e15\u7f0a\u805e\u80b3\u8115\u8117\u82a0\u83ac\u8570\u8574\u8580\u85f4\u860a\u8689\u87a1\u87c1\u891e\u8c71\u8f3c\u8f40\u8f92\u922b\u93be\u95ba\u95bf\u95c5\u95e6\u9650\u97de\u97eb\u9850\u9942\u99bc\u9b70\u9c1b\u9c2e\u9cc1\u9cfc\u9d0d\u9d16\u9f24\u4ea0",weng:"\u7fc1\u55e1\u74ee\u8579\u84ca\u52dc\u5855\u58c5\u5963\u5d61\u66a1\u6ec3\u7515\u7788\u7f4b\u806c\u8499\u8789\u9393\u9db2\u9e5f\u9f46",wie:"\u81b8",wo:"\u6211\u63e1\u7a9d\u5367\u631d\u6c83\u8717\u6da1\u65a1\u502d\u5e44\u9f8c\u809f\u83b4\u5594\u6e25\u786a\u4ef4\u5053\u5529\u55cc\u5641\u5684\u57da\u581d\u592d\u5a50\u5a51\u5a89\u5aaa\u5abc\u6370\u637c\u637e\u64be\u64ed\u674c\u6782\u6943\u6db4\u6db9\u6e26\u6fc4\u6fe3\u7125\u7327\u74c1\u761f\u7783\u77c6\u7aa9\u815b\u81d2\u81e5\u8267\u8435\u84a6\u85b6\u8778\u8e12\u8e20\u96d8\u99a7\u9f77\u9f8f",wu:"\u65e0\u4e94\u5c4b\u7269\u821e\u96fe\u8bef\u6342\u6c61\u609f\u52ff\u94a8\u6b66\u620a\u52a1\u545c\u4f0d\u5434\u5348\u543e\u4fae\u4e4c\u6bcb\u6076\u8bec\u829c\u5deb\u6664\u68a7\u575e\u59a9\u8708\u727e\u5be4\u5140\u6003\u9622\u90ac\u5fe4\u9a9b\u65bc\u92c8\u4ef5\u674c\u9e5c\u5a7a\u8fd5\u75e6\u82b4\u7110\u5e91\u9e49\u9f2f\u6d6f\u572c\u4e44\u4ea1\u4ebe\u4ee1\u4f06\u4f89\u4fc9\u5035\u511b\u5166\u526d\u52d9\u5433\u5449\u554e\u5594\u55da\u5641\u57ad\u57e1\u5825\u5862\u58b2\u5966\u5a12\u5a2a\u5a2c\u5af5\u5c7c\u5c89\u5cff\u5d4d\u5d68\u5e60\u5ee1\u5f19\u5fa1\u5fe2\u609e\u60ae\u60e1\u61ae\u625c\u625d\u6264\u63fe\u6440\u6544\u65c4\u65ff\u6745\u6747\u67ee\u6a46\u6b4d\u6bcd\u6c59\u6c5a\u6c95\u6d16\u6d3f\u6e1e\u6e25\u6ea9\u6f55\u70cf\u7121\u7183\u7193\u739d\u73f7\u73f8\u7466\u7491\u7512\u7780\u77b4\u77f9\u7894\u7966\u7991\u7a8f\u7ab9\u7b0f\u7bbc\u7c85\u81b4\u8323\u8381\u83ab\u856a\u8601\u8790\u87f1\u8a88\u8aa3\u8aa4\u8b55\u8db6\u8e8c\u901c\u90da\u9114\u91eb\u92d8\u92d9\u933b\u93a2\u94fb\u965a\u9696\u96fa\u971a\u9727\u973f\u9770\u9a16\u9bc3\u9c1e\u9d2e\u9d50\u9d61\u9da9\u9de1\u9e40\u9f3f\u9f40\u9f6c\u9f89\u5514\u8765",xi:"\u897f\u6d17\u7ec6\u5438\u620f\u7cfb\u559c\u5e2d\u7a00\u6eaa\u7184\u9521\u819d\u606f\u88ad\u60dc\u4e60\u563b\u5915\u6089\u77fd\u7199\u5e0c\u6a84\u727a\u6670\u6614\u5ab3\u7852\u94e3\u70ef\u814a\u6790\u9699\u6816\u6c50\u7280\u8725\u595a\u6d60\u8478\u9969\u5c63\u73ba\u5b09\u798a\u516e\u7fd5\u7a78\u79a7\u50d6\u6dc5\u84f0\u823e\u8e4a\u91af\u6b37\u7699\u87cb\u7fb2\u831c\u5f99\u96b0\u550f\u66e6\u8785\u6b59\u6a28\u960b\u7c9e\u71b9\u89cb\u83e5\u9f37\u88fc\u8204\u4e49\u4fc2\u4fd9\u5092\u51de\u5338\u534c\u5365\u537b\u5380\u541a\u546c\u5470\u54a5\u54a6\u54ad\u553d\u564f\u568a\u56b1\u5848\u58d0\u594a\u5a2d\u5a90\u5b06\u5ba9\u5c43\u5c4e\u5c56\u5c6d\u5d60\u5d8d\u5db2\u5dc2\u5dc7\u5ed7\u5f86\u5faf\u5fd4\u5fda\u5fe5\u602c\u6038\u6044\u6095\u60c1\u613e\u6140\u6198\u6199\u622f\u6231\u6232\u6271\u6278\u6461\u6495\u64ca\u65e2\u665e\u6673\u66bf\u676b\u67b2\u6878\u68f2\u691e\u693a\u69bd\u69e2\u6a40\u6a72\u6b2a\u6b2f\u6b56\u6c23\u6c25\u6d12\u6e13\u6e7f\u6eca\u6f07\u6f1d\u6f5d\u6f5f\u6f99\u6fd5\u7051\u7101\u7108\u711f\u712c\u7155\u7182\u7188\u71ba\u71bb\u71cd\u71e8\u7214\u7294\u72a0\u72a7\u72f6\u730e\u7361\u737b\u740b\u74bd\u74d5\u761c\u76fb\u774e\u77a6\u77d6\u788f\u78f6\u7902\u7a27\u7ab8\u7ce6\u7d30\u7d8c\u7dc6\u7e18\u7e30\u7e65\u7e6b\u7e9a\u7ee4\u7f9b\u7fa9\u7fd2\u7fd6\u80b8\u80b9\u80c1\u8105\u8107\u810b\u8203\u8383\u8394\u8448\u84a0\u84b5\u84c6\u8507\u856e\u8582\u8669\u8724\u8734\u8777\u8787\u87e2\u8835\u884b\u8936\u8972\u8980\u89a1\u89a4\u89f9\u89fd\u89ff\u8a22\u8a51\u8a92\u8af0\u8b11\u8b1a\u8b35\u8b46\u8bf6\u8c25\u8c3f\u8c40\u8c68\u8c6f\u8c95\u8d65\u8d69\u8d87\u8d98\u8e5d\u8ea7\u905f\u90c4\u90cb\u90e4\u910e\u9145\u91d0\u91f3\u91f8\u9212\u9222\u9268\u9269\u9291\u932b\u932f\u93b4\u93ed\u9474\u9491\u9519\u95df\u969f\u96b5\u96df\u96ed\u972b\u973c\u98c1\u990f\u9919\u993c\u997b\u9a31\u9a3d\u9a68\u9b29\u9bd1\u9c13\u9c3c\u9c5a\u9cc3\u9cdb\u9d57\u9e02\u9ed6\u9f30\u9f33\u90d7",xia:"\u4e0b\u5413\u590f\u5ce1\u867e\u778e\u971e\u72ed\u5323\u4fa0\u8f96\u53a6\u6687\u552c\u72ce\u67d9\u5477\u9ee0\u7856\u7f45\u9050\u7455\u4e05\u4fe0\u5047\u5084\u53da\u5440\u54e7\u55c4\u55d1\u5687\u5737\u57c9\u5913\u593e\u5c88\u5cfd\u5ec8\u5fa6\u61d7\u62bc\u637e\u6433\u656e\u6630\u68ba\u6b31\u6b43\u6bf3\u6d43\u6d79\u6e8a\u70a0\u70da\u7146\u72f9\u73e8\u759c\u75a8\u7615\u7771\u7864\u78ac\u78cd\u796b\u7b1a\u7b6a\u7d66\u7e00\u7e16\u7ed9\u7fc8\u821d\u823a\u8290\u846d\u8578\u8766\u879b\u8ad5\u8b11\u8c3a\u8d6e\u8f44\u90c3\u935c\u938b\u93ec\u9595\u959c\u965c\u967f\u98ac\u9a22\u9b7b\u9c15\u9db7",xian:"\u5148\u7ebf\u53bf\u73b0\u663e\u6380\u95f2\u732e\u5acc\u9677\u9669\u9c9c\u5f26\u8854\u9985\u9650\u54b8\u9528\u4ed9\u817a\u8d24\u7ea4\u5baa\u8237\u6d8e\u7fa1\u94e3\u89c1\u82cb\u85d3\u5c98\u75eb\u83b6\u7c7c\u5a34\u86ac\u7303\u7946\u51bc\u71f9\u8de3\u8df9\u9170\u66b9\u6c19\u9e47\u7b45\u9730\u4eda\u4f23\u4f2d\u4f61\u4fd4\u50ca\u50e9\u50f2\u50f4\u5481\u549e\u54ef\u550c\u5563\u55db\u5615\u57b7\u57f3\u583f\u58cf\u597e\u5997\u59b6\u59cd\u59d7\u59ed\u59fa\u5a0a\u5a28\u5a39\u5a71\u5afa\u5afb\u5b10\u5b45\u5bf0\u5c1f\u5c20\u5c73\u5cf4\u5d04\u5dae\u5e70\u5eef\u5ffa\u614a\u6173\u61aa\u61b2\u61b8\u61e2\u6326\u634d\u63a2\u63f1\u641a\u641f\u648a\u648f\u6507\u6515\u665b\u6774\u67ae\u6898\u69cf\u6a4c\u6af6\u6b26\u6be8\u6d12\u6d17\u6d80\u6e7a\u6e93\u6f96\u6fc2\u7017\u7051\u7066\u70cd\u72dd\u736b\u736e\u737b\u7381\u73b9\u73d7\u73fe\u7509\u7647\u764e\u76f7\u7701\u770c\u774d\u77af\u77e3\u784d\u78b1\u7906\u7925\u7992\u79b0\u79c8\u7a34\u7b15\u7b67\u7bb2\u7caf\u7cee\u7d43\u7d64\u7d85\u7d96\u7dab\u7dda\u7e23\u7e3f\u7e4a\u7e8e\u7e96\u7f10\u7fa8\u7fac\u80a9\u80c1\u80d8\u8105\u8107\u810b\u8181\u81d4\u81e4\u81fd\u82ee\u83a7\u8539\u859f\u85d6\u861a\u861d\u861e\u86bf\u86dd\u8706\u8858\u893c\u8973\u898b\u8aa2\u8ab8\u8af4\u8b40\u8b63\u8c4f\u8ce2\u8d12\u8d7b\u8e6e\u8e9a\u8ed0\u8ed2\u8f31\u8f69\u918e\u91b6\u91e4\u9291\u929b\u929c\u92e7\u930e\u931f\u9341\u934c\u93fe\u9466\u9490\u94e6\u952c\u9591\u9592\u95de\u961a\u9665\u967a\u96aa\u97c5\u97ef\u97f1\u9848\u9855\u986f\u9921\u9940\u99a6\u9bae\u9c14\u9c7b\u9db1\u9df3\u9df4\u9dfc\u9e79\u9e99\u9eb2\u9ef9\u9f38",xiang:"\u60f3\u5411\u8c61\u9879\u54cd\u9999\u4e61\u76f8\u50cf\u7bb1\u5df7\u4eab\u9576\u53a2\u964d\u7fd4\u7965\u6a61\u8be6\u6e58\u8944\u98e8\u9c9e\u9aa7\u87d3\u5ea0\u8297\u9977\u7f03\u8459\u4ea8\u4eaf\u4f6d\u50a2\u5134\u52e8\u52f7\u554c\u554d\u56ae\u59e0\u5d91\u5ec2\u5fc0\u6518\u6651\u66cf\u6819\u697f\u6b00\u6d0b\u6f52\u73e6\u74d6\u74e8\u7d74\u7dd7\u7e95\u7f3f\u7f8f\u81b7\u8221\u842b\u858c\u8618\u8683\u8801\u8856\u8950\u8a73\u8ded\u8fd2\u90f7\u9109\u910a\u9115\u9284\u9297\u92de\u940c\u9472\u95a7\u95c0\u95c2\u97ff\u9805\u9909\u9957\u995f\u9a64\u9b28\u9b9d\u9bd7\u9c4c\u9c5c\u9c76\u9d39\u9e98",xiao:"\u5c0f\u7b11\u6d88\u524a\u9500\u8427\u6548\u5bb5\u6653\u8096\u5b5d\u785d\u6dc6\u5578\u9704\u54ee\u56a3\u6821\u9b48\u86f8\u9a81\u67b5\u54d3\u5d24\u7b71\u6f47\u900d\u67ad\u7ee1\u7bab\u4f7c\u4fbe\u4fcf\u4ff2\u509a\u52b9\u53dc\u53df\u53f7\u547a\u547c\u54b2\u54bb\u54e8\u5520\u552c\u554b\u55c3\u560b\u5610\u5628\u562e\u562f\u5635\u56bb\u56c2\u59e3\u5a4b\u5baf\u5ea8\u5f47\u6054\u6077\u61a2\u6320\u634e\u63f1\u641c\u6493\u64a8\u6569\u6585\u6586\u6681\u66c9\u689f\u68a2\u6a5a\u6af9\u6b4a\u6b52\u6b57\u6bbd\u6bca\u6d28\u6d8d\u6ee7\u6f3b\u6f5a\u6fa9\u701f\u7071\u7072\u70cb\u7107\u7187\u71bd\u71c6\u71fa\u723b\u72e1\u7307\u735f\u7362\u75da\u75df\u769b\u76a2\u7744\u7863\u7a58\u7a99\u7b39\u7b7f\u7bbe\u7be0\u7c18\u7c2b\u7d5e\u7d83\u7e3f\u7ede\u7fdb\u80f6\u8129\u81ae\u828d\u832d\u83a6\u8437\u856d\u8582\u85c3\u8648\u8653\u87c2\u87cf\u87f0\u8828\u8a24\u8a68\u8a9f\u8ab5\u8b0f\u8b1e\u8b3c\u8b4a\u8e03\u8f03\u8f47\u8f83\u90e9\u92b7\u98b5\u9a37\u9a4d\u9a55\u9a84\u9a9a\u9ab9\u9ac7\u9ad0\u9d1e\u9d35\u9d41\u9dcd\u9dd5\u9e2e",xie:"\u5199\u4e9b\u978b\u6b47\u659c\u8840\u8c22\u5378\u631f\u5c51\u87f9\u6cfb\u61c8\u6cc4\u6954\u90aa\u534f\u68b0\u8c10\u874e\u643a\u80c1\u89e3\u5951\u53f6\u7ec1\u9889\u7f2c\u736c\u69ad\u5ee8\u64b7\u5055\u7023\u6e2b\u4eb5\u698d\u9082\u85a4\u8e9e\u71ee\u52f0\u4f33\u505e\u5070\u50c1\u5136\u51a9\u52a6\u5354\u5368\u5424\u550f\u5588\u55cb\u5667\u57a5\u586e\u5911\u593e\u594a\u5a0e\u5a9f\u5b48\u5beb\u5c53\u5c5c\u5c5f\u5c67\u5c6d\u5ceb\u5db0\u5fa2\u604a\u6136\u6140\u62f9\u633e\u63a5\u63f3\u641a\u647a\u64d5\u64f7\u651c\u65ea\u66ac\u67bb\u6854\u699d\u69f7\u6b38\u6b59\u6bba\u6c41\u6d29\u6e5d\u6e89\u6eca\u6f70\u6fa5\u7009\u707a\u70a7\u70a8\u70f2\u710e\u7181\u71f2\u7215\u7332\u744e\u772d\u78bf\u7944\u79bc\u7ccf\u7d32\u7d4f\u7d5c\u7d6c\u7d8a\u7de4\u7df3\u7e72\u7e88\u7f37\u7fd3\u8036\u8105\u8107\u810b\u818e\u85a2\u85db\u8751\u8762\u880d\u880f\u887a\u88cc\u8909\u893b\u896d\u89df\u89e7\u8adc\u8ae7\u8b1d\u8b6e\u8b97\u8c0d\u8c6b\u8dec\u8ea0\u8fe6\u9371\u9437\u96b0\u97a2\u97b5\u97f0\u9801\u9821\u9875\u9ab1\u9b39\u9b7c\u9bad\u9c91\u9f42\u9f58\u9f5b\u9f65\u9fa4\u6e83",xin:"\u65b0\u5fc3\u6b23\u4fe1\u82af\u85aa\u950c\u8f9b\u5bfb\u8845\u5ffb\u6b46\u56df\u8398\u9561\u99a8\u946b\u6615\u4f08\u4f29\u4ffd\u5174\u5677\u567a\u59a1\u59f0\u5b1c\u5b5e\u5c0b\u5e8d\u5ede\u60de\u6116\u6196\u64a2\u677a\u6794\u6a5d\u6b35\u6b3e\u6b40\u6f43\u7098\u712e\u76fa\u7925\u812a\u8208\u820b\u8951\u8a22\u8a2b\u8ed0\u90a4\u91c1\u920a\u92c5\u9414\u9620\u9856\u99ab\u99b8\u9b35",xing:"\u6027\u884c\u578b\u5f62\u661f\u9192\u59d3\u8165\u5211\u674f\u5174\u5e78\u90a2\u7329\u60fa\u7701\u784e\u60bb\u8365\u9649\u64e4\u8347\u4f80\u5016\u54d8\u5753\u5759\u57b6\u5842\u5a19\u5a5e\u5ac8\u5b39\u5de0\u66d0\u6d10\u6dac\u6ece\u714b\u7192\u72cc\u7446\u76a8\u7772\u7814\u784f\u7bb5\u7bc2\u7dc8\u80dc\u81d6\u8208\u8395\u86f5\u88c4\u89ea\u89f2\u8b03\u90c9\u9203\u9276\u9292\u92de\u9498\u94cf\u9658\u9933\u9967\u9a02\u9a8d\u9b8f\u9bf9",xiong:"\u80f8\u96c4\u51f6\u5144\u718a\u6c79\u5308\u828e\u5147\u54c5\u5910\u5baa\u5ff7\u605f\u657b\u662b\u6d36\u7138\u80f7\u8a29\u8a57\u8a7e\u8bbb\u8bc7\u8cef\u8d68",xiu:"\u4fee\u9508\u7ee3\u4f11\u7f9e\u5bbf\u55c5\u8896\u79c0\u673d\u81ed\u6eb4\u8c85\u9990\u9af9\u9e3a\u54bb\u5ea5\u5cab\u4fe2\u568a\u6a07\u6af9\u6eeb\u70cb\u70cc\u7166\u73db\u7407\u7493\u7cd4\u7d87\u7d89\u7e4d\u7e61\u8119\u8129\u81f0\u81f9\u82ec\u8320\u83a0\u84e8\u8791\u88e6\u890e\u890f\u929d\u92b9\u9380\u93c5\u93e5\u93fd\u98cd\u9948\u9ae4\u9bb4\u9c43\u9d42\u9f45",xu:"\u8bb8\u987b\u9700\u865a\u5618\u84c4\u7eed\u5e8f\u53d9\u755c\u7d6e\u5a7f\u620c\u5f90\u65ed\u7eea\u5401\u9157\u6064\u589f\u7cc8\u52d6\u6829\u6d52\u84ff\u987c\u5729\u6d2b\u80e5\u9191\u8be9\u6e86\u7166\u76f1\u7809\u4e8e\u4e90\u4f03\u4f11\u4f35\u4f59\u4f90\u4fc6\u5066\u5194\u52d7\u5379\u5455\u5474\u547c\u54bb\u55a3\u55c5\u5614\u563c\u5653\u57bf\u58fb\u59b6\u59c1\u59d0\u5aad\u5b03\u5e41\u6034\u6035\u6053\u60d0\u6149\u639d\u63df\u654d\u6558\u65ee\u65f4\u662b\u6647\u668a\u6702\u6710\u6948\u69d2\u6b28\u6b30\u6b3b\u6b54\u6b58\u6b88\u6c7f\u6c80\u6de2\u6e51\u6ec0\u6ef8\u6f35\u6f4a\u70c5\u70fc\u735d\u73dd\u73ec\u759e\u76e2\u76e8\u7717\u7781\u77b2\u77de\u7a30\u7a38\u7aa2\u7c72\u7d9a\u7dd2\u7dd6\u7df0\u7e03\u7e7b\u7e8c\u805f\u80b7\u80ca\u828b\u828c\u82a7\u84a3\u84f2\u8566\u85c7\u85da\u8657\u865b\u86bc\u86e1\u8751\u898f\u89c4\u8a0f\u8a31\u8a39\u8a61\u8add\u8aff\u8b23\u8b33\u8b43\u8bb4\u8c1e\u8cc9\u90aa\u9126\u9265\u928a\u9450\u96e9\u9808\u980a\u9998\u9a49\u9b1a\u9b46\u9b56\u9b63\u9c6e",xuan:"\u9009\u60ac\u65cb\u7384\u5ba3\u55a7\u8f69\u7eda\u7729\u7663\u5238\u6684\u6966\u5107\u6e32\u6f29\u6ceb\u94c9\u7487\u714a\u78b9\u955f\u70ab\u63ce\u8431\u75c3\u8c16\u4e98\u5405\u54ba\u559b\u5847\u5910\u59b6\u59f0\u5a97\u5ad9\u5b1b\u5f32\u6030\u6103\u610b\u61c1\u61f8\u63c8\u64b0\u64d0\u660d\u6621\u6645\u6685\u6696\u66b6\u688b\u6965\u6a88\u6d35\u6d93\u6fb4\u70dc\u7156\u72df\u7367\u7386\u73b9\u7401\u7404\u7444\u74bf\u74ca\u766c\u76e4\u7734\u777b\u77ce\u79a4\u7bae\u7d43\u7d62\u7d79\u7e23\u7e3c\u7e4f\u7ee2\u7fe7\u7ffe\u8432\u84d2\u8519\u857f\u85fc\u8610\u8701\u870e\u8756\u8809\u8852\u88a8\u8ae0\u8afc\u8b5e\u8b82\u8d19\u8ed2\u8f4b\u9078\u9084\u9249\u92d7\u9379\u93c7\u9436\u956e\u9799\u98b4\u994c\u9994\u99e8\u99fd\u9c1a",xue:"\u5b66\u96ea\u8840\u9774\u7a74\u524a\u859b\u8e05\u5671\u9cd5\u6cf6\u4e74\u51b3\u52ea\u5437\u54ee\u56af\u5779\u58c6\u5b78\u5ca4\u5cc3\u5da8\u6034\u6588\u6856\u688b\u6a30\u6c7a\u6ce7\u6cec\u6ec8\u6fa9\u7025\u7094\u70d5\u71e2\u72d8\u75a6\u75b6\u77b2\u81a4\u825d\u8313\u8486\u8895\u89f7\u8b14\u8c11\u8d90\u8f4c\u8fa5\u96e4\u97be\u97e1\u9c48\u9dfd\u9e34",xun:"\u5bfb\u8baf\u718f\u8bad\u5faa\u6b89\u65ec\u5de1\u8fc5\u9a6f\u6c5b\u900a\u52cb\u8364\u8be2\u6d5a\u5dfd\u9c9f\u6d54\u57d9\u6042\u736f\u91ba\u6d35\u90c7\u5ccb\u8548\u85b0\u8340\u7aa8\u66db\u5f87\u4f28\u4f9a\u5071\u52db\u52f2\u52f3\u5342\u54b0\u5640\u565a\u5691\u5743\u5864\u58ce\u58e6\u595e\u59f0\u5b59\u5b6b\u5c0b\u5ef5\u609b\u613b\u63d7\u648f\u6533\u674a\u6812\u686a\u68ad\u6a33\u6bbe\u6be5\u6d12\u6f6d\u6f6f\u6fec\u7065\u7104\u7147\u71c2\u71c5\u71d6\u71fb\u720b\u7213\u72e5\u72fb\u73e3\u7495\u7734\u77c4\u7a04\u7b4d\u7b7c\u7bd4\u7d03\u7d62\u7e81\u7eda\u81d0\u8368\u8477\u8512\u8541\u85ab\u860d\u87eb\u87f3\u8951\u8a0a\u8a13\u8a19\u8a62\u8cd0\u8fff\u9021\u9041\u905c\u9129\u9442\u946b\u9868\u99b4\u99e8\u9c4f\u9c58\u9dbd\u5f50",ya:"\u5440\u538b\u7259\u62bc\u82bd\u9e2d\u8f67\u54d1\u4e9a\u6daf\u4e2b\u96c5\u8859\u9e26\u8bb6\u869c\u57ad\u758b\u7811\u740a\u6860\u775a\u5a05\u75d6\u5c88\u6c29\u4f22\u8fd3\u63e0\u4e5b\u4e9c\u4e9e\u4ff9\u503b\u529c\u538a\u538c\u5393\u53ad\u5416\u543e\u547e\u5516\u555e\u5714\u5720\u5727\u57e1\u580a\u5810\u58d3\u59f6\u5a6d\u5b72\u5d15\u5e8c\u5e98\u5fa1\u62c1\u631c\u6397\u672d\u6792\u690f\u693b\u6b47\u6c2c\u6d65\u6f04\u6f5d\u70cf\u72bd\u731a\u7330\u73a1\u7458\u75a8\u7602\u78a3\u78cd\u7a0f\u7a75\u7aab\u7b0c\u8050\u8565\u897e\u8a1d\u8ecb\u8f05\u8f35\u8f82\u90aa\u91fe\u930f\u941a\u94d4\u9598\u95f8\u9854\u989c\u9d09\u9d28\u9d6a\u9d76\u9d95\u9e4c\u9f3c\u9f56\u9f7e\u5d16",yan:"\u773c\u70df\u6cbf\u76d0\u8a00\u6f14\u4e25\u54bd\u6df9\u708e\u63a9\u538c\u5bb4\u5ca9\u7814\u5ef6\u5830\u9a8c\u8273\u6bb7\u9609\u781a\u96c1\u5501\u5f66\u7130\u8712\u884d\u8c1a\u71d5\u989c\u960e\u94c5\u7109\u5944\u82ab\u53a3\u960f\u83f8\u9b47\u7430\u6edf\u7131\u8d5d\u7b75\u814c\u5156\u5261\u990d\u6079\u7f68\u6a90\u6e6e\u5043\u8c33\u80ed\u664f\u95eb\u4fe8\u90fe\u917d\u9122\u598d\u9f39\u5d26\u963d\u5ae3\u4e75\u4f46\u4ffa\u5050\u5063\u50bf\u513c\u5157\u5186\u5266\u533d\u5382\u5383\u53ad\u53b3\u53b4\u550c\u55a6\u55ad\u565e\u56a5\u56b4\u56d0\u57cf\u57ef\u5869\u5895\u58db\u58e7\u590f\u5935\u599f\u59f2\u59f8\u5a2b\u5a2e\u5a95\u5b0a\u5b10\u5b2e\u5b3f\u5b4d\u5c75\u5d04\u5d43\u5d52\u5d53\u5d96\u5dae\u5dcc\u5dd6\u5dd7\u5dd8\u5dda\u5de1\u5e7f\u5eb5\u5ef5\u5f07\u5f65\u611d\u61d5\u622d\u624a\u6281\u6329\u633b\u635d\u639e\u63c5\u63dc\u63de\u6565\u6616\u667b\u66a5\u66d5\u66ee\u68ea\u693b\u693c\u694c\u6a2e\u6a6a\u6abf\u6ae9\u6b15\u6b97\u6c24\u6c87\u6d07\u6d1d\u6d8e\u6dca\u6de1\u6deb\u6e30\u6e37\u6e7a\u6e8e\u6f39\u704e\u7054\u7067\u7069\u708f\u70fb\u7114\u7159\u7196\u71c4\u7213\u726a\u72e0\u72ff\u7312\u73da\u7402\u74db\u7517\u784f\u786f\u787d\u789e\u7939\u7bf6\u7c37\u7d96\u7e2f\u7fa1\u7fa8\u8181\u81d9\u8276\u8277\u839a\u83b6\u83f4\u8412\u844a\u8455\u8505\u852b\u859f\u8664\u8758\u88fa\u8917\u8983\u898e\u89c3\u89fe\u8a01\u8a2e\u8a7d\u8afa\u8b8c\u8b9e\u8ba0\u8c53\u8c54\u8c5c\u8c63\u8d0b\u8d17\u8dbc\u8ebd\u8ec5\u8fd9\u9019\u9043\u90d4\u9140\u9153\u9183\u91b6\u91bc\u91c5\u925b\u931f\u952c\u9586\u95b9\u95bb\u95bc\u962d\u9669\u9670\u9681\u9692\u96aa\u9765\u9768\u984f\u9851\u9854\u9869\u995c\u9a10\u9a13\u9a34\u9a57\u9a60\u9b33\u9b58\u9c0b\u9ceb\u9cf1\u9d08\u9d33\u9da0\u9dc3\u9df0\u9e7d\u9e99\u9ea3\u9eb2\u9ee1\u9ee4\u9eeb\u9eec\u9eed\u9ef0\u9ef6\u9f34\u9f57\u9f5e\u9f74\u9f82\u9f91",yang:"\u6837\u517b\u7f8a\u6d0b\u4ef0\u626c\u79e7\u6c27\u75d2\u6768\u6f3e\u9633\u6b83\u592e\u9e2f\u4f6f\u75a1\u7080\u6059\u5f89\u9785\u6cf1\u86d8\u70ca\u600f\u4f52\u509f\u52b7\u52dc\u536c\u5489\u5771\u579f\u594d\u59ce\u5a78\u5c07\u5c9f\u5d35\u5d38\u6143\u61e9\u62b0\u63da\u6501\u656d\u65f8\u6602\u661c\u6620\u6698\u67cd\u694a\u6967\u69d8\u6a23\u6b4d\u6c1c\u6c31\u6e6f\u6f52\u7001\u70b4\u716c\u73dc\u7452\u760d\u7662\u770f\u773b\u7922\u7993\u7d3b\u7f8f\u7f95\u7f98\u7faa\u80e6\u82f1\u8a47\u8a73\u8af9\u8be6\u8eee\u8f30\u9260\u9348\u935a\u940a\u9496\u9626\u967d\u96f5\u9719\u9737\u98ba\u98cf\u98ec\u990a\u99da\u9c11\u9d26\u9d39\u9e09",yao:"\u8981\u6447\u836f\u54ac\u8170\u7a91\u8200\u9080\u5996\u8c23\u9065\u59da\u7476\u8000\u5c27\u94a5\u4fa5\u9676\u7ea6\u759f\u73e7\u592d\u9cd0\u9e5e\u8f7a\u723b\u5406\u94eb\u5e7a\u5d3e\u80b4\u66dc\u5fad\u6773\u7a88\u4e48\u4e50\u4ef8\u5004\u5060\u509c\u50e5\u530b\u556e\u5593\u55c2\u565b\u5699\u579a\u582f\u5a06\u5a79\u5ab1\u5b08\u5b8e\u5c2d\u5c86\u5ce3\u5da2\u5da4\u5e7c\u5fba\u602e\u604c\u612e\u62ad\u63fa\u6416\u647f\u64bd\u669a\u66e3\u6796\u67fc\u6946\u699a\u69a3\u6a02\u6b80\u6bbd\u6d2e\u6deb\u6e94\u6edb\u7039\u70c4\u70d1\u718e\u71ff\u72d5\u7336\u733a\u735f\u7385\u7464\u7531\u7711\u77c5\u78d8\u7945\u7a7e\u7a85\u7a94\u7aaf\u7ab0\u7b44\u7bb9\u7d04\u7e47\u7e85\u825e\u82ed\u835b\u846f\u847d\u84d4\u8558\u85ac\u85e5\u8628\u888e\u899e\u8a1e\u8a4f\u8b20\u8b21\u8b91\u8daf\u8e30\u8efa\u9059\u929a\u9390\u9470\u95c4\u9683\u977f\u9864\u98bb\u98d6\u9906\u991a\u9a15\u9a41\u9a9c\u9c29\u9d01\u9d22\u9dc2\u9dd5\u9f3c\u9f69",ye:"\u4e5f\u591c\u4e1a\u91ce\u53f6\u7237\u9875\u6db2\u6396\u814b\u51b6\u564e\u8036\u54bd\u66f3\u6930\u90aa\u8c12\u90ba\u6654\u70e8\u63f6\u94d8\u9765\u4eaa\u4eb1\u503b\u505e\u50f7\u5414\u5558\u559d\u5622\u5688\u57dc\u5828\u5885\u58b7\u58c4\u5c04\u5ceb\u5daa\u5dab\u61d5\u62b4\u62fd\u6353\u6359\u63de\u63f2\u64d6\u64db\u64e8\u64ea\u64eb\u659c\u668d\u66c4\u66c5\u66d7\u6792\u67bc\u67bd\u696a\u696d\u6b4b\u6b95\u6b97\u6d02\u6d07\u6d82\u6f1c\u6f71\u6fb2\u7160\u7180\u71c1\u7217\u723a\u74db\u75f7\u76a3\u77b1\u77b8\u790f\u7aab\u7de4\u8042\u8076\u837c\u8449\u8675\u882e\u8831\u8b01\u9113\u9134\u91f6\u91fe\u92e3\u9371\u9381\u9391\u9437\u9768\u9801\u9918\u9923\u9941\u9950\u9980\u998c\u9a5c\u9d7a\u9e08\u9ee6",yi:"\u4e00\u4ee5\u5df2\u4ebf\u8863\u79fb\u4f9d\u6613\u533b\u4e59\u4eea\u4ea6\u6905\u76ca\u501a\u59e8\u7ffc\u8bd1\u4f0a\u86c7\u9057\u98df\u827e\u80f0\u7591\u6c82\u5b9c\u5f02\u5f5d\u58f9\u8681\u8c0a\u63d6\u94f1\u77e3\u7fcc\u827a\u6291\u7ece\u9091\u86fe\u5c79\u5c3e\u5f79\u81c6\u9038\u8084\u75ab\u9890\u88d4\u610f\u6bc5\u5fc6\u4e49\u5937\u6ea2\u8be3\u8bae\u603f\u75cd\u9552\u7654\u6021\u9a7f\u65d6\u71a0\u914f\u7fca\u6b39\u5cc4\u572f\u6baa\u55cc\u54a6\u61ff\u566b\u5293\u8bd2\u9974\u6f2a\u4f5a\u54bf\u7617\u7317\u7719\u7fbf\u5f08\u82e1\u8351\u4ee1\u4f7e\u8d3b\u9487\u7f22\u8fe4\u5208\u6092\u9edf\u7ff3\u5f0b\u5955\u8734\u57f8\u6339\u5db7\u858f\u5453\u8f76\u9571\u8223\u4e3f\u4e41\u4e42\u4e5f\u4e84\u4f07\u4f3f\u4f41\u4f57\u4f87\u4fcb\u506f\u5100\u5104\u5117\u517f\u519d\u52ae\u52da\u52e9\u5307\u531c\u5370\u53c6\u53d5\u53f0\u53f9\u541a\u542c\u546d\u5479\u5508\u564e\u56c8\u571b\u572a\u5744\u5768\u57bc\u57f6\u58bf\u58f1\u5901\u5915\u5931\u5947\u59b7\u59ec\u5a90\u5ad5\u5adb\u5b04\u5b11\u5b1f\u5b74\u5b83\u5b90\u5ba7\u5bf1\u5bf2\u5c04\u5cd3\u5d0e\u5d3a\u5da7\u5dac\u5df3\u5df8\u5e1f\u5e20\u5e46\u5ea1\u5ed9\u5f0c\u5f2c\u5f5b\u5f5c\u5f5e\u5f75\u5fd4\u6008\u6020\u605e\u6098\u60a5\u61b6\u61cc\u623a\u6245\u6246\u6261\u62e9\u62f8\u638e\u639c\u640b\u6424\u648e\u64c7\u653a\u6561\u657c\u6581\u65bd\u65d1\u6633\u6679\u6686\u66c0\u66ce\u66f5\u6759\u675d\u678d\u67bb\u67c2\u6818\u6827\u683a\u684b\u68ed\u692c\u6938\u698f\u69f7\u69f8\u6a34\u6a8d\u6aa5\u6ab9\u6ac2\u6b25\u6b2d\u6b56\u6b5d\u6b94\u6bb9\u6bc9\u6c7d\u6cb6\u6cbb\u6cc4\u6cc6\u6d22\u6d29\u6d2b\u6d42\u6d65\u6d73\u6e2b\u6e59\u6f69\u6fa4\u6fba\u7037\u7088\u7109\u712c\u7131\u7132\u7188\u7199\u71a4\u71aa\u71bc\u71da\u71e1\u71f1\u7284\u72cb\u72cf\u7348\u73b4\u73c6\u747f\u74f5\u7569\u7570\u7599\u75ec\u761e\u7631\u776a\u7796\u786a\u7912\u7919\u794e\u7995\u79c7\u7a26\u7a53\u7ae9\u7b16\u7bb7\u7c03\u7c4e\u7d32\u7d4f\u7dad\u7dba\u7e0a\u7e44\u7e76\u7e79\u7ec1\u7eee\u7ef4\u7f9b\u7fa0\u7fa1\u7fa8\u7fa9\u801b\u8034\u808a\u8189\u8257\u8264\u8285\u82c5\u82e2\u8413\u841f\u84fa\u85d9\u85dd\u8619\u8649\u86dc\u86e1\u86e6\u8794\u8798\u87a0\u87fb\u8864\u886a\u8875\u8882\u8886\u8898\u88a3\u88db\u88ff\u8918\u8939\u8957\u897c\u89fa\u8a11\u8a32\u8a33\u8a4d\u8a51\u8a52\u8a63\u8a83\u8a92\u8abc\u8b1a\u8b3b\u8b69\u8b6f\u8b70\u8b7a\u8b89\u8b9b\u8bf6\u8c25\u8c59\u8c5b\u8c77\u8c96\u8ca4\u8cbd\u8cf9\u8d00\u8dc7\u8de0\u8e26\u8efc\u8f17\u8f22\u8f59\u8fa5\u8fb7\u8fc6\u8fed\u8ff1\u8ffb\u9018\u907a\u90fc\u91ab\u91b3\u91b7\u91ca\u91cb\u91d4\u91f4\u91f6\u9218\u9220\u9247\u9248\u926f\u9295\u92a5\u9321\u93b0\u93d4\u943f\u9480\u94ca\u951c\u9623\u9624\u9641\u966d\u96b6\u96bf\u96c9\u9705\u972c\u9749\u977e\u9809\u9824\u9825\u984a\u9857\u98f4\u9950\u99c5\u9a5b\u9aae\u9ba7\u9ba8\u9be3\u9ce6\u9d3a\u9d82\u9d83\u9d8d\u9dc1\u9dca\u9dd6\u9de7\u9dfe\u9e03\u9e5d\u9e62\u9e65\u9ed3\u9edd\u9ef3\u9f6e\u9f78",yin:"\u56e0\u5f15\u5370\u94f6\u97f3\u996e\u9634\u9690\u836b\u541f\u5c39\u5bc5\u8335\u6deb\u6bb7\u59fb\u70df\u5819\u911e\u5591\u5924\u80e4\u9f88\u5432\u573b\u72fa\u57a0\u972a\u8693\u6c24\u94df\u7aa8\u763e\u6d07\u831a\u4e51\u4e5a\u4f12\u4f17\u4f8c\u50bf\u5198\u51d0\u542c\u552b\u5656\u567e\u569a\u56d9\u5701\u5794\u57a6\u57bd\u5837\u58f9\u5a63\u5a6c\u5cfe\u5d1f\u5d2f\u5dbe\u5e01\u5ed5\u6114\u6147\u616d\u6196\u6197\u61da\u65a6\u6704\u6836\u6880\u6a83\u6aad\u6abc\u6afd\u6b2d\u6b3d\u6b45\u6ba5\u6c82\u6cff\u6d15\u6d54\u6dfe\u6e5a\u6eb5\u6edb\u6f6d\u6f6f\u6fe5\u6fe6\u70ce\u72be\u730c\u73aa\u73e2\u748c\u7616\u764a\u766e\u784d\u7892\u78e4\u798b\u79f5\u7b43\u7c8c\u7d6a\u7df8\u7e2f\u82a9\u82c2\u8376\u8491\u8529\u852d\u861f\u87be\u87eb\u88c0\u8a00\u8a14\u8a1a\u8a21\u8a22\u8abe\u8af2\u8b94\u8d7a\u8d9b\u8f11\u9153\u9173\u91ff\u920f\u921d\u9280\u92a6\u95c7\u95c9\u9625\u9670\u967b\u9682\u96a0\u96b1\u9712\u9720\u9777\u9787\u97fe\u98ee\u98f2\u99f0\u9a83\u9ba3\u9de3\u9f57\u9f66\u9f82",ying:"\u5e94\u786c\u5f71\u8425\u8fce\u6620\u8747\u8d62\u9e70\u82f1\u9896\u83b9\u76c8\u5a74\u6a31\u7f28\u8367\u8424\u8426\u6979\u84e5\u763f\u8314\u9e66\u5ab5\u83ba\u748e\u90e2\u5624\u6484\u745b\u6ee2\u6f46\u5b34\u7f42\u701b\u81ba\u8365\u988d\u4fd3\u5040\u50cc\u54fd\u5568\u55b6\u565f\u56b6\u584b\u5903\u592e\u5a96\u5ac8\u5b30\u5b46\u5b7e\u5d64\u5dc6\u5dca\u5eee\u5fdc\u6125\u61c9\u646c\u650d\u6516\u651a\u65f2\u666f\u668e\u6720\u67cd\u685c\u686f\u68ac\u6afb\u6aff\u6cc2\u6d67\u6e36\u6e81\u6e8b\u6ece\u6f41\u6fd9\u6fda\u6ff4\u7005\u7020\u702f\u7034\u7050\u705c\u7138\u7150\u7192\u71df\u73f1\u7469\u74d4\u7507\u7516\u7538\u766d\u76c1\u770f\u77e8\u78a4\u792f\u7a4e\u7c5d\u7c6f\u7dd3\u7e04\u7e08\u7e69\u7e93\u7eec\u7ef3\u7f43\u7f4c\u803a\u81a1\u8396\u843e\u85c0\u8621\u86cd\u8767\u877f\u87a2\u8805\u8833\u892e\u89ae\u8b0d\u8b4d\u8b7b\u8ccf\u8d0f\u8ec8\u901e\u93a3\u941b\u944d\u9533\u9719\u9795\u97f9\u97fa\u9834\u9895\u9c66\u9d2c\u9da7\u9daf\u9dea\u9df9\u9e0e\u9e1a",yo:"\u54df\u80b2\u5537\u55b2\u569b",yong:"\u7528\u6d8c\u6c38\u62e5\u86f9\u52c7\u96cd\u548f\u6cf3\u4f63\u8e0a\u75c8\u5eb8\u81c3\u607f\u58c5\u6175\u4fd1\u5889\u9cd9\u9095\u5581\u752c\u9954\u955b\u509b\u50ad\u52c8\u55c8\u5670\u57c7\u584e\u5ade\u5bb9\u5d71\u5ef1\u5f6e\u603a\u6080\u60e5\u6111\u6139\u6142\u63d8\u64c1\u67e1\u6810\u69e6\u6e67\u6efd\u6fad\u7049\u7245\u7655\u7670\u783d\u7867\u799c\u7b69\u81fe\u82da\u848f\u8579\u8a60\u8e34\u9047\u90fa\u9118\u919f\u92bf\u93de\u96dd\u9852\u9899\u9bd2\u9c2b\u9c45\u9cac\u9ddb",you:"\u6709\u53c8\u7531\u53f3\u6cb9\u6e38\u5e7c\u4f18\u53cb\u94c0\u5fe7\u5c24\u72b9\u8bf1\u60a0\u90ae\u9149\u4f51\u91c9\u5e7d\u75a3\u6538\u86b0\u83a0\u9c7f\u5363\u9edd\u83b8\u7337\u86b4\u5ba5\u7256\u56ff\u67da\u8763\u839c\u9f2c\u94d5\u8764\u7e47\u5466\u4f91\u4e23\u4eb4\u5064\u512a\u5198\u53f9\u54ca\u5500\u5698\u5773\u5965\u598b\u59f7\u5b67\u5c22\u5c23\u5cdf\u5cf3\u5eae\u601e\u6023\u602e\u6182\u61ee\u622d\u6270\u63c2\u63c4\u65bf\u682f\u6884\u688e\u6962\u69f1\u6acc\u6afe\u6c53\u6c7c\u6c8b\u6cc5\u6cc8\u6cd1\u6d5f\u6e75\u6efa\u7000\u7257\u7270\u72d6\u7336\u7376\u7534\u75cf\u7950\u7989\u79de\u7cff\u7e8b\u7f90\u7f91\u7f97\u8030\u8048\u8071\u80ac\u811c\u8129\u82c3\u83a4\u848f\u8555\u8698\u870f\u890e\u890f\u8a27\u8a98\u8c81\u8f0f\u8f36\u8ff6\u900c\u9030\u904a\u908e\u90f5\u913e\u916d\u923e\u92aa\u92b9\u9508\u99c0\u9b77\u9b8b\u9c89\u9e80",yu:"\u4e0e\u4e8e\u6b32\u9c7c\u96e8\u4f59\u9047\u8bed\u6108\u72f1\u7389\u6e14\u4e88\u8a89\u80b2\u611a\u7fbd\u865e\u5a31\u6de4\u8206\u5c7f\u79b9\u5b87\u8fc2\u4fde\u903e\u57df\u828b\u90c1\u8c37\u5401\u76c2\u55bb\u5cea\u5fa1\u6109\u7ca5\u6e1d\u5c09\u6986\u9685\u6d74\u5bd3\u88d5\u9884\u8c6b\u9a6d\u851a\u59aa\u5d5b\u96e9\u9980\u9608\u7aac\u9e46\u59a4\u63c4\u7ab3\u89ce\u81fe\u8201\u9f89\u84e3\u715c\u94b0\u8c00\u7ea1\u65bc\u7afd\u745c\u79ba\u807f\u6b24\u4fe3\u4f1b\u5704\u9e6c\u5ebe\u6631\u8438\u7610\u8c15\u9b3b\u5709\u7600\u71a8\u996b\u6bd3\u71e0\u8174\u72f3\u83c0\u872e\u8753\u4e02\u4e8f\u4e90\u4f03\u4fc1\u4ffc\u504a\u50b4\u50ea\u5125\u516a\u532c\u53de\u5433\u543e\u5537\u5539\u5581\u5585\u5590\u55a9\u564a\u5662\u5673\u572b\u5809\u5823\u582c\u58ba\u5915\u5965\u5a1b\u5a2a\u5a2f\u5a7e\u5a80\u5aae\u5ad7\u5b29\u5b9b\u5bd9\u5cff\u5d1b\u5d33\u5d4e\u5d8e\u5dbc\u5ebd\u5f67\u5fec\u6086\u6087\u60cc\u60d0\u617e\u61ca\u61d9\u6216\u622b\u625c\u6275\u62d7\u6327\u6353\u6554\u6594\u659e\u65df\u6619\u6745\u6829\u682f\u6859\u68a7\u68db\u68dc\u68eb\u6940\u6961\u6970\u6af2\u6b0e\u6b1d\u6b48\u6b5f\u6b76\u6c59\u6c5a\u6c61\u6c69\u6de2\u6def\u6e61\u6eea\u6f01\u6f9a\u6f9e\u6fa6\u6fb3\u706a\u7079\u7134\u7168\u71cf\u71f0\u7229\u724f\u7344\u735d\u738b\u7397\u7399\u7419\u741f\u7440\u74b5\u756c\u756d\u75cf\u7609\u7652\u76d3\u776e\u77de\u7821\u7862\u7907\u7916\u791c\u7964\u79a6\u79d7\u7a22\u7a36\u7a65\u7a7b\u7b8a\u7bfd\u7c45\u7c5e\u7c72\u7d06\u7dce\u7e58\u7f6d\u7fad\u7fd1\u8167\u8207\u8212\u8245\u828c\u82d1\u831f\u8330\u8362\u83f8\u842d\u842e\u84ae\u84f9\u854d\u8577\u8581\u85c7\u860c\u861b\u8676\u870d\u871f\u877a\u87b8\u87c8\u8858\u8859\u8867\u88ac\u8915\u89a6\u8a9e\u8adb\u8aed\u8b23\u8b7d\u8c8d\u8c90\u8c97\u8e30\u8ec9\u8f0d\u8f3f\u8f5d\u8fc3\u9033\u9079\u9098\u90da\u9105\u9151\u91a7\u91ea\u923a\u9289\u92ca\u92d9\u9325\u935d\u940d\u942d\u94fb\u95bc\u95be\u960f\u9653\u9683\u96a9\u96d3\u9731\u9810\u9828\u9852\u9899\u98eb\u9918\u9947\u99ad\u9a1f\u9a48\u9aac\u9ac3\u9b30\u9b31\u9b4a\u9b5a\u9b63\u9bbd\u9bf2\u9c05\u9c4a\u9c6e\u9cff\u9d25\u9d27\u9d2a\u9d52\u9de0\u9df8\u9e06\u9e12\u9e8c\u9f6c\u9f75\u8080",yuan:"\u8fdc\u5458\u5143\u9662\u5706\u539f\u613f\u56ed\u63f4\u733f\u6028\u51a4\u6e90\u7f18\u8881\u6e0a\u82d1\u57a3\u9e33\u8f95\u571c\u9f0b\u6a7c\u5a9b\u7230\u7722\u9e22\u63be\u82ab\u6c85\u7457\u8788\u7ba2\u586c\u57b8\u5086\u5141\u5248\u53a1\u53b5\u54bd\u54e1\u559b\u566e\u56e6\u570e\u5712\u5713\u5917\u59a7\u59b4\u5ab4\u5ac4\u5ada\u5b3d\u5b9b\u5bc3\u5f32\u6081\u60cc\u6350\u676c\u68e9\u6965\u699e\u69ac\u6ade\u6d93\u6db4\u6df5\u6e01\u6e06\u6e15\u6e72\u6e92\u7041\u7106\u7328\u7342\u76f6\u7990\u7a7f\u7b0e\u7de3\u7e01\u7fb1\u8099\u847e\u849d\u84ac\u8597\u85b3\u8696\u870e\u8735\u875d\u876f\u884f\u88eb\u88f7\u8911\u8924\u8b1c\u8c9f\u8d20\u8f10\u8f45\u903a\u9060\u908d\u90a7\u915b\u9228\u92fa\u93b1\u962e\u9668\u9695\u9858\u99cc\u9a35\u9b6d\u9cf6\u9d1b\u9d77\u9da2\u9db0\u9e53\u9eff\u9f18\u9f1d",yue:"\u6708\u8d8a\u7ea6\u8dc3\u9605\u4e50\u5cb3\u60a6\u66f0\u8bf4\u7ca4\u94a5\u7039\u94ba\u5216\u9fa0\u680e\u6a3e\u54d5\u54fe\u5666\u56dd\u5757\u5981\u599c\u5b33\u5c84\u5dbd\u5f5f\u5f60\u6071\u6085\u6209\u625a\u6288\u6373\u64fd\u66f1\u6782\u6adf\u6c4b\u70c1\u7106\u720d\u721a\u73a5\u77c6\u77f1\u793f\u79b4\u7bb9\u7bd7\u7c46\u7c65\u7c70\u7cb5\u7d04\u81d2\u836f\u8625\u868e\u868f\u86fb\u8715\u8816\u8aaa\u8aac\u8daf\u8dc0\u8dde\u8e8d\u8e92\u8ecf\u9205\u925e\u92b3\u92ed\u9460\u94c4\u9510\u95b1\u95b2\u9afa\u9e11\u9e19\u9ee6\u9fa5",yun:"\u4e91\u8fd0\u6655\u5141\u5300\u97f5\u9668\u5b55\u8018\u8574\u915d\u90e7\u5458\u6c32\u607d\u6120\u90d3\u82b8\u7b60\u97eb\u6600\u72c1\u6b92\u7ead\u71a8\u4f1d\u508a\u52fb\u53de\u544d\u54e1\u5597\u56e9\u5747\u593d\u596b\u5998\u5aaa\u5abc\u5c09\u5c39\u6028\u60f2\u612a\u614d\u628e\u62a3\u6688\u679f\u6985\u6a02\u6a52\u6b9e\u6c33\u6c84\u6d92\u6da2\u6e29\u6eb3\u6f90\u7147\u7174\u717e\u7185\u7189\u73a7\u7547\u761f\u76fe\u7703\u78d2\u79d0\u7b4d\u7b7c\u7bd4\u7d1c\u7df7\u7dfc\u7e15\u7e1c\u7e67\u7f0a\u803a\u816a\u82d1\u837a\u83c0\u8480\u8495\u84b7\u8553\u8570\u8580\u85f4\u860a\u8735\u8779\u891e\u8c9f\u8cf1\u8d07\u8d20\u8d5f\u8f3c\u8f40\u8f92\u904b\u9106\u9116\u9196\u919e\u9217\u92c6\u962d\u9695\u96f2\u9723\u97d7\u97de\u97fb\u9835\u992b\u99a7\u99bb\u9f6b\u9f73",za:"\u6742\u7838\u548b\u531d\u624e\u54b1\u5482\u62f6\u5548\u5550\u5592\u5601\u5648\u56c3\u56cb\u56d0\u5e00\u685a\u6c9e\u6caf\u6ffd\u7052\u78fc\u7c74\u7d25\u7d2e\u81dc\u81e2\u894d\u9254\u96d1\u96dc\u96e5\u97f4\u9b73",zad:"\u66f1",zai:"\u5728\u518d\u707e\u8f7d\u683d\u5bb0\u54c9\u753e\u5d3d\u4ed4\u50a4\u510e\u624d\u6257\u6d05\u6e3d\u6ea8\u707d\u70d6\u7775\u7e21\u83d1\u8cf3\u8f09\u9168",zan:"\u54b1\u6682\u6512\u8d5e\u7c2a\u8db1\u7ccc\u74d2\u62f6\u661d\u933e\u507a\u5127\u5139\u5142\u5592\u56cb\u5bc1\u63dd\u648d\u6522\u66ab\u685a\u6d94\u6e54\u6ffa\u6ffd\u7052\u74c9\u74da\u79b6\u7a73\u7bf8\u7c2e\u81e2\u8978\u8b83\u8b9a\u8cdb\u8d0a\u8db2\u8e54\u913c\u9142\u9147\u93e8\u93e9\u9415\u941f\u9961",zang:"\u810f\u846c\u8d43\u85cf\u5958\u81e7\u9a75\u5328\u585f\u5f09\u6215\u7242\u726b\u7f98\u81d3\u81df\u8535\u8ccd\u8cd8\u8d13\u8d1c\u92ba\u99d4\u9a61\u9ad2",zao:"\u65e9\u9020\u906d\u7cdf\u7076\u71e5\u67a3\u51ff\u8e81\u85fb\u7682\u566a\u6fa1\u86a4\u5523\u50ae\u5515\u55bf\u6165\u6806\u688d\u68d7\u69fd\u7170\u7485\u74aa\u7681\u7a96\u7ac3\u7ac8\u7c09\u7e45\u7e70\u7f2b\u7f32\u8241\u8349\u85bb\u8b32\u8b5f\u8dae\u8e67\u91a9\u947f",ze:"\u5219\u8d23\u62e9\u6cfd\u548b\u4fa7\u7ba6\u8234\u5e3b\u8fee\u5567\u4ec4\u6603\u7b2e\u8d5c\u4f2c\u5074\u5247\u5395\u53a0\u5536\u556b\u5616\u5928\u5ae7\u5d31\u5e58\u5e82\u5ec1\u629e\u6351\u63aa\u64c7\u6617\u67de\u6a0d\u6b75\u6c44\u6ca2\u6cce\u6ead\u6edc\u6fa4\u7042\u769f\u776a\u7794\u77e0\u790b\u7a04\u7a37\u7c00\u802b\u841a\u8443\u8536\u8600\u880c\u8957\u8ace\u8b2b\u8b2e\u8b81\u8c2a\u8cac\u8cfe\u98f5\u9e05\u9f5a\u9f70",zei:"\u8d3c\u8808\u8cca\u9bfd\u9c02\u9c61\u9c97\u9cab",zen:"\u600e\u8c2e\u50ed\u56ce\u648d\u8b56\u8b5b",zeng:"\u589e\u8d60\u618e\u66fe\u7efc\u7f2f\u7f7e\u7511\u9503\u5897\u66fd\u6a67\u71b7\u7494\u77f0\u78f3\u7d9c\u7e21\u7e52\u8b44\u8d08\u912b\u92e5\u9b37\u9c5b",zha:"\u624e\u70b8\u6e23\u95f8\u7728\u69a8\u4e4d\u8f67\u8bc8\u94e1\u672d\u8721\u67e5\u6805\u548b\u781f\u75c4\u5412\u54f3\u6942\u7339\u86b1\u63f8\u558b\u67de\u54a4\u9f44\u505e\u5067\u518a\u518c\u5273\u5284\u538f\u54c6\u55a5\u56c3\u5953\u5bb1\u600d\u6260\u62af\u62c3\u6313\u633f\u63d2\u63f7\u6429\u643e\u6463\u64d6\u67e4\u67f5\u6a1d\u6e2b\u6ea0\u6f73\u7079\u7160\u7250\u7534\u76b6\u76bb\u7b2e\u7b91\u7b9a\u7d25\u7d2e\u802b\u81aa\u82f2\u82f4\u8516\u854f\u85f8\u86bb\u89f0\u8a50\u8ace\u8b2f\u8b47\u8b57\u8e37\u8e45\u8ecb\u8fca\u91a1\u9358\u9598\u9705\u97a2\u9b93\u9bba\u9c08\u9c8a\u9c9d\u9cbd\u9f47\u9f5f\u9f70\u9f83\u9987\u55b3",zhai:"\u6458\u7a84\u503a\u658b\u5be8\u62e9\u7fdf\u5b85\u4fa7\u796d\u7826\u7635\u4e9d\u5074\u50b5\u5387\u538f\u5547\u568c\u5908\u5ea6\u62a7\u635a\u64c7\u64ff\u658e\u67f4\u69b8\u6aa1\u7274\u75b5\u7ba6\u7c00\u7c82\u81aa\u8cac\u8d23\u9259\u99d8\u9a80\u9ab4\u9f4b",zhan:"\u7ad9\u5360\u6218\u76cf\u6cbe\u7c98\u6be1\u5c55\u6808\u8a79\u98a4\u8638\u6e5b\u7efd\u65a9\u8f97\u5d2d\u77bb\u8c35\u640c\u65c3\u4eb6\u4f54\u5061\u5661\u5af8\u5d41\u5d83\u5d84\u5d98\u5da6\u6017\u60c9\u6226\u6230\u62c3\u65ac\u65dc\u6834\u685f\u68e7\u693e\u6990\u6a4f\u6b03\u6c08\u6c0a\u6e54\u6fb6\u7416\u76bd\u76de\u788a\u7dbb\u83da\u859d\u8665\u8666\u86c5\u8892\u8962\u89b1\u8a40\u8b19\u8b67\u8b6b\u8b9d\u8c26\u8d88\u8dd5\u8e4d\u8e94\u8f1a\u8f3e\u8f4f\u9085\u9186\u91ae\u959a\u9711\u98ad\u98d0\u98e6\u9930\u9958\u9a4f\u9a59\u9aa3\u9b59\u9c63\u9ce3\u9cfd\u9e07\u9e6f\u9ede\u9ef5",zhang:"\u5f20\u7ae0\u957f\u5e10\u4ed7\u4e08\u638c\u6da8\u8d26\u6a1f\u6756\u5f70\u6f33\u80c0\u7634\u969c\u4ec9\u5adc\u5e5b\u9123\u748b\u5d82\u7350\u87d1\u4ee7\u50bd\u5887\u5e33\u5e65\u5f21\u5f35\u615e\u6259\u627f\u66b2\u6db1\u6f32\u75ee\u762c\u7795\u7903\u7c80\u7cbb\u8139\u8501\u8cec\u9067\u93f1\u9423\u9577\u9578\u979d\u9926\u9a3f\u9c46\u9e9e",zhao:"\u627e\u7740\u7167\u62db\u7f69\u722a\u5146\u671d\u662d\u6cbc\u8087\u5632\u53ec\u8d75\u68f9\u5541\u948a\u7b0a\u8bcf\u4f4b\u5545\u5797\u59b1\u5df6\u65d0\u6641\u66cc\u679b\u6843\u6ac2\u6dd6\u6fef\u70a4\u71f3\u722b\u72e3\u7475\u76bd\u76c4\u77be\u7abc\u7b8c\u7f40\u7f84\u8081\u8088\u83ec\u8457\u86a4\u8a54\u8b3f\u8d99\u91d7\u91fd\u924a\u9363\u99cb\u9ba1\u9ced\u9f02\u9f0c",zhe:"\u7740\u8fd9\u8005\u6298\u906e\u86f0\u54f2\u8517\u9517\u8f99\u6d59\u67d8\u8f84\u8d6d\u647a\u9e67\u78d4\u8936\u8707\u8c2a\u4e47\u4edb\u5387\u5560\u5586\u55eb\u55fb\u5600\u569e\u56c1\u57d1\u5835\u5aec\u5eb6\u608a\u6179\u6278\u6442\u6444\u651d\u65a5\u6662\u6663\u6754\u68cf\u6a00\u6a1c\u6b7d\u6ddb\u6f6a\u77fa\u7813\u7c77\u7c8d\u8037\u8042\u8051\u8076\u8674\u87c4\u87c5\u88a9\u891a\u8975\u8a5f\u8b2b\u8b36\u8b3a\u8b81\u8b8b\u8efc\u8f12\u8f19\u8f4d\u8f76\u9019\u9069\u92b8\u937a\u966c\u99b2\u9a5d\u9bbf\u9dd3\u9dd9\u9e37\u8457",zhen:"\u771f\u9635\u9547\u9488\u9707\u6795\u632f\u659f\u73cd\u75b9\u8bca\u7504\u7827\u81fb\u8d1e\u4fa6\u7f1c\u84c1\u796f\u7bb4\u8f78\u699b\u7a39\u8d48\u6715\u9e29\u80d7\u6d48\u6862\u755b\u5733\u6939\u4fb2\u5075\u5507\u576b\u5861\u5866\u586b\u59eb\u5ac3\u5bca\u5c52\u5e2a\u5f2b\u614e\u6221\u62ae\u630b\u63d5\u6438\u6552\u6576\u6623\u673e\u67ae\u6815\u681a\u686d\u6968\u6990\u69c7\u6a3c\u6b9d\u6cb4\u6cb5\u6e5e\u6eb1\u6ec7\u6f67\u6fb5\u7349\u73ce\u7467\u7715\u771e\u7739\u78aa\u798e\u799b\u7ae7\u7c48\u7d16\u7d3e\u7d7c\u7e1d\u7e25\u7ebc\u8044\u8419\u8474\u8496\u85bd\u8704\u8897\u88d6\u8999\u8a3a\u8aab\u8b13\u8c9e\u8cd1\u8d81\u8d82\u8eeb\u8f43\u8fb4\u8fe7\u9049\u9156\u9159\u91dd\u9202\u9241\u92f4\u9331\u9356\u937c\u93ad\u93ae\u9663\u9673\u9755\u99d7\u9b12\u9b9d\u9c75\u9c9e\u9d06\u9eee\u9ef0\u9f0e\u9f11\u5e27",zheng:"\u6b63\u6574\u7741\u4e89\u6323\u5f81\u6014\u8bc1\u75c7\u90d1\u62ef\u4e01\u84b8\u72f0\u653f\u5ce5\u94b2\u94ee\u7b5d\u8be4\u5fb5\u9cad\u4e1e\u4f25\u4f42\u5000\u51e7\u57e5\u57e9\u5863\u59c3\u5a9c\u5d1d\u5d22\u5d92\u5e40\u5f8e\u5fb0\u5fb4\u6138\u6195\u627f\u628d\u6399\u639f\u63c1\u649c\u655e\u6678\u6b62\u6c36\u6d67\u6e5e\u70a1\u70dd\u722d\u7319\u753a\u7665\u7710\u775c\u77a0\u7b8f\u7bdc\u7cfd\u7daa\u8047\u8100\u8a3c\u8acd\u8b49\u8d9f\u8e2d\u912d\u9266\u931a\u9b07\u9b8f\u9bd6\u9bf9\u9d0a\u5e27",zhi:"\u53ea\u4e4b\u76f4\u77e5\u5236\u6307\u7eb8\u652f\u829d\u679d\u7a1a\u5431\u8718\u8d28\u80a2\u8102\u6c41\u7099\u7ec7\u804c\u75d4\u690d\u62b5\u6b96\u6267\u503c\u4f84\u5740\u6ede\u6b62\u8dbe\u6cbb\u65e8\u7a92\u5fd7\u631a\u63b7\u81f3\u81f4\u7f6e\u5e1c\u8bc6\u5cd9\u6c0f\u667a\u79e9\u5e19\u646d\u9ef9\u684e\u67b3\u8f75\u5fee\u7949\u86ed\u81a3\u89ef\u90c5\u6800\u5f58\u82b7\u7957\u54ab\u9e37\u7d77\u8e2c\u80dd\u9a98\u8f7e\u75e3\u965f\u8e2f\u96c9\u57f4\u8d3d\u536e\u916f\u8c78\u8dd6\u6809\u4e7f\u4e8a\u4f0e\u4fe7\u5001\u5024\u506b\u5082\u5128\u51ea\u526c\u5295\u52a7\u5394\u54a5\u5694\u5741\u5767\u5781\u57c3\u57f7\u5886\u588c\u591a\u591b\u59b7\u59ea\u5a21\u5a9e\u5b02\u5b9e\u5bd8\u5be6\u5d3b\u5df5\u5e0b\u5e5f\u5ea2\u5ea4\u5ecc\u5f8f\u5f94\u5f9d\u5fb4\u5fb5\u6043\u6049\u6179\u6184\u61e5\u61eb\u6220\u627a\u627b\u62a7\u62d3\u62de\u6303\u6357\u6418\u6431\u6455\u6468\u646f\u64f2\u64f3\u64ff\u65a6\u65d8\u6635\u664a\u675d\u676b\u67e3\u683a\u683d\u6894\u68bd\u6925\u6956\u69b0\u69dc\u6a00\u6a32\u6a34\u6acd\u6adb\u6b6d\u6c10\u6c65\u6c66\u6c9a\u6cdc\u6d14\u6d37\u6dfd\u6ecd\u6eef\u6f10\u6f4c\u6f6a\u7004\u71ab\u7286\u72fe\u7318\u74c6\u74e1\u7564\u7590\u75b7\u75bb\u7608\u7730\u780b\u7929\u793a\u7941\u7947\u7951\u796c\u7983\u7994\u79b5\u79c7\u79d3\u79d6\u79ea\u79ef\u79f2\u79f7\u7a19\u7a3a\u7a49\u7b6b\u7d19\u7d29\u7d7a\u7d95\u7dfb\u7e36\u7e54\u7fd0\u8006\u8040\u8077\u80d1\u80f5\u81b1\u81f7\u81f8\u8296\u830b\u831d\u83ed\u8599\u85e2\u8635\u8652\u8694\u87b2\u87d9\u8879\u887c\u889f\u88a0\u88fd\u8967\u899f\u89d7\u89dd\u89f6\u8a28\u8a8c\u8b22\u8b58\u8c51\u8c52\u8cad\u8cea\u8d04\u8df1\u8e36\u8e5b\u8e60\u8e62\u8e91\u8e93\u8ec4\u8ef9\u8efd\u8f0a\u8fdf\u8fe3\u905f\u9072\u90e6\u9148\u91de\u9244\u928d\u92b4\u92d5\u9455\u94c1\u94da\u9527\u9624\u962f\u9641\u96b2\u96bb\u99b6\u99bd\u99e4\u9a2d\u9a3a\u9a47\u9bef\u9ce9\u9cf7\u9d19\u9d32\u9da8\u9dd9\u9e20\u9f05\u5902",zhong:"\u4e2d\u91cd\u79cd\u949f\u80bf\u4f17\u7ec8\u76c5\u5fe0\u4ef2\u8877\u8e35\u822f\u87bd\u953a\u51a2\u5fea\u4e51\u4f00\u5045\u5223\u55a0\u5839\u585a\u5990\u5995\u5a91\u5c30\u5e52\u5f78\u5fb8\u67ca\u6b71\u6c77\u6cc8\u6f7c\u7082\u7144\u72c6\u7607\u773e\u794c\u7a2e\u7a5c\u7ae5\u7b57\u7c66\u7d42\u7ddf\u816b\u8202\u833d\u8463\u8520\u869b\u86a3\u8769\u87a4\u87f2\u8846\u8873\u8876\u8908\u8ae5\u8e71\u8fda\u9206\u9221\u92bf\u937e\u9418\u9d24\u9f28\u5902",zhou:"\u5468\u6d32\u76b1\u7ca5\u5dde\u8f74\u821f\u663c\u9aa4\u5b99\u8bcc\u8098\u5e1a\u5492\u7e47\u80c4\u7ea3\u836e\u5541\u78a1\u7ec9\u7c40\u59af\u914e\u4f37\u4f8f\u4f9c\u501c\u50fd\u5191\u546a\u54ae\u5544\u558c\u5599\u5663\u568b\u5a64\u5e9c\u5f9f\u626d\u63ab\u665d\u666d\u67da\u6906\u6ce8\u6d00\u6dcd\u70bf\u70d0\u73d8\u7503\u759b\u76ba\u76e9\u776d\u77ea\u795d\u7b92\u7c52\u7c55\u7c99\u7d02\u7d2c\u7e10\u7fe2\u80d5\u8233\u83f7\u8464\u85b5\u8a4b\u8a76\u8abf\u8acf\u8b05\u8b78\u8bea\u8bf9\u8c03\u8cd9\u8d52\u8ef8\u8f08\u8f16\u8f80\u9010\u9031\u90ee\u923e\u9282\u94c0\u970c\u99ce\u99f2\u9a06\u9a36\u9a5f\u9a7a\u9b3b\u9bde\u9d43\u9e3c",zhu:"\u4f4f\u4e3b\u732a\u7af9\u682a\u716e\u7b51\u8d2e\u94f8\u5631\u62c4\u6ce8\u795d\u9a7b\u5c5e\u672f\u73e0\u77a9\u86db\u6731\u67f1\u8bf8\u8bdb\u9010\u52a9\u70db\u86c0\u6f74\u6d19\u4f2b\u7603\u7fe5\u8331\u82ce\u6a65\u8233\u677c\u7bb8\u70b7\u4f8f\u94e2\u75b0\u6e1a\u891a\u8e85\u9e88\u90be\u69e0\u7afa\u4e88\u4f47\u5285\u529a\u52af\u54ae\u55fb\u5663\u56d1\u577e\u58b8\u58f4\u5b4e\u5b81\u5b94\u5c0c\u5c6c\u5d40\u5eb6\u640a\u6571\u6580\u6597\u65b8\u66ef\u671d\u6793\u67e0\u67f7\u696e\u6a26\u6ae1\u6ae7\u6aeb\u6b18\u6bb6\u6ccf\u6cde\u6f8d\u6fd0\u7026\u705f\u70a2\u7151\u71ed\u7225\u771d\u77da\u782b\u7843\u78e9\u7969\u79fc\u7a8b\u7ada\u7b01\u7b1c\u7b6f\u7bc9\u7beb\u7bf4\u7d35\u7d38\u7d51\u7ebb\u7f5c\u7f9c\u82a7\u82e7\u8301\u833f\u8387\u84eb\u854f\u85a5\u85f7\u85f8\u86b0\u876b\u880b\u8829\u883e\u88be\u8a3b\u8a5d\u8a85\u8af8\u8c6c\u8caf\u8dd3\u8dd9\u8de6\u8ef4\u8fec\u9017\u902b\u924f\u9252\u9296\u92f3\u9444\u9483\u963b\u9664\u967c\u9714\u98f3\u99b5\u99d0\u99ef\u9a36\u9a7a\u9ba2\u9bfa\u9c41\u9d38\u9e00\u9e86\u9f04\u8457\u4e36",zhua:"\u6293\u722a\u631d\u6463\u64be\u6a9b\u7c3b\u81bc\u9afd",zhuai:"\u62fd\u8f6c\u5c35\u6359\u7749\u8de9\u9861\u562c",zhuan:"\u8f6c\u4e13\u7816\u8d5a\u4f20\u64b0\u7bc6\u989b\u9994\u556d\u6c8c\u50b3\u50ce\u50dd\u5278\u53c0\u56c0\u581f\u587c\u5ae5\u5b68\u5c02\u5c08\u606e\u629f\u6476\u6e4d\u6f19\u7077\u7451\u747c\u750e\u78da\u7af1\u7bf9\u7bff\u7c28\u7c51\u7e33\u8011\u815e\u819e\u8483\u87e4\u8948\u8aef\u8b54\u8cfa\u8ee2\u8f49\u911f\u9853\u994c\u9c44",zhuang:"\u88c5\u649e\u5e84\u58ee\u6869\u72b6\u5e62\u5986\u50ee\u5958\u6206\u4e2c\u58ef\u58f5\u599d\u5a24\u5e92\u61a7\u6205\u6207\u6889\u6a01\u6e77\u6f34\u710b\u72c0\u735e\u7ca7\u7cda\u825f\u8358\u838a\u88dd\u8d11\u8d1b\u8d63",zhui:"\u8ffd\u5760\u7f00\u9525\u8d58\u690e\u9a93\u60f4\u7f12\u96b9\u5015\u5782\u57c0\u589c\u5a37\u63e3\u69cc\u6c9d\u7500\u7577\u787e\u78d3\u7908\u7b0d\u7ba0\u7db4\u7e0b\u814f\u8187\u81f4\u8411\u8ac8\u8d05\u8f5b\u9180\u918a\u9310\u9317\u9323\u939a\u9446\u968a\u96a7\u991f\u9a05\u9d7b",zhun:"\u51c6\u8c06\u5c6f\u80ab\u7a80\u51d6\u554d\u572b\u57fb\u5b92\u5ff3\u65fd\u6df3\u6e7b\u6e96\u753d\u76f9\u7a15\u7d14\u7da7\u7eaf\u80d7\u8860\u8a30\u8ac4\u8fcd\u98e9\u9968\u9ef1",zhuo:"\u6349\u684c\u7740\u5544\u62d9\u707c\u6d4a\u5353\u7422\u7f34\u8301\u914c\u64e2\u712f\u6fef\u8bfc\u6d5e\u6dbf\u502c\u956f\u799a\u65ab\u4e35\u5262\u5285\u52fa\u53d5\u5545\u555c\u5663\u5734\u5767\u588c\u59b0\u5a3a\u5f74\u6354\u6387\u64af\u64c6\u6580\u65ae\u65b1\u65b2\u65b5\u666b\u68b2\u68c1\u68f3\u68f9\u6913\u69d5\u6ae1\u6c4b\u6dd6\u6e96\u6fc1\u7042\u70aa\u70f5\u72b3\u72f5\u7438\u77e0\u787a\u7a5b\u7a71\u7aa1\u7aa7\u7bb8\u7be7\u7c57\u7c71\u7e73\u7f6c\u8049\u80ab\u84d4\u855e\u85cb\u8743\u8817\u883f\u8ac1\u8ad1\u8b36\u8da0\u8db5\u8e14\u8e60\u8e85\u9275\u92dc\u942f\u9432\u9d6b\u9ddf\u6753\u8457",zi:"\u5b57\u81ea\u5b50\u7d2b\u7c7d\u8d44\u59ff\u5431\u6ed3\u4ed4\u5179\u54a8\u5b5c\u6e0d\u6ecb\u6dc4\u7b2b\u7ca2\u9f87\u79ed\u6063\u8c18\u8d91\u7f01\u6893\u9cbb\u9531\u5b73\u8014\u89dc\u9aed\u8d40\u8308\u8a3e\u5d6b\u7726\u59ca\u8f8e\u4e8b\u5033\u525a\u5407\u5470\u5472\u5559\u55de\u59c9\u59d5\u5b56\u5b76\u5d30\u674d\u6825\u6914\u699f\u6a74\u6b21\u6c9d\u6cda\u6d13\u6e7d\u6f2c\u6fac\u7278\u7386\u74be\u753e\u75b5\u7725\u77f7\u798c\u79c4\u79f6\u7a35\u7a67\u7d0e\u7dc7\u80cf\u80d4\u80fe\u8293\u830a\u8321\u8332\u83d1\u8458\u84fb\u858b\u8678\u8a3f\u8aee\u8cb2\u8cc7\u8d7c\u8da6\u8dd0\u8f09\u8f1c\u8f3a\u8f7d\u9111\u91e8\u922d\u92c5\u9319\u937f\u93a1\u950c\u9543\u983e\u983f\u9bd4\u9c26\u9d85\u9f12\u9f4a\u9f4d\u9f50\u9f5c",zo:"\u5497\u5528",zong:"\u603b\u7eb5\u5b97\u68d5\u7efc\u8e2a\u9b03\u506c\u7cbd\u679e\u8159\u500a\u5027\u50af\u582b\u5d4f\u5d55\u5d78\u5f9e\u60e3\u60fe\u6121\u6374\u63d4\u6403\u6460\u662e\u6721\u6936\u6a05\u6f40\u6f48\u6f68\u719c\u71a7\u71ea\u7314\u7323\u75ad\u7632\u7882\u78eb\u7a2f\u7cc9\u7d9c\u7dc3\u7dcf\u7deb\u7df5\u7e02\u7e26\u7e31\u7e3d\u7fea\u8250\u847c\u84d7\u84ef\u876c\u8c75\u8e28\u8e64\u931d\u936f\u93d3\u9441\u9a0c\u9a23\u9a94\u9b09\u9b37\u9bee\u9bfc",zou:"\u8d70\u63cd\u594f\u90b9\u9cb0\u9139\u966c\u9a7a\u8bf9\u5062\u5ab0\u63ab\u640a\u65cf\u68f7\u68f8\u6971\u7b83\u7dc5\u82bb\u83c6\u8acf\u8d71\u90f0\u9112\u9a36\u9bd0\u9beb\u9ec0\u9f71\u9f7a\u8fb6",zu:"\u7ec4\u65cf\u8db3\u963b\u79df\u7956\u8bc5\u83f9\u955e\u5352\u4fce\u4f1c\u4f39\u5005\u50b6\u5346\u54eb\u5550\u5601\u5ca8\u5d12\u5d2a\u5f82\u601a\u67e4\u6cae\u6dec\u723c\u73c7\u7820\u7a21\u7ba4\u7d23\u7d44\u7db7\u82f4\u8445\u84a9\u8a5b\u8b2f\u8db1\u8db2\u8e24\u8e3f\u8e74\u9243\u924f\u9250\u930a\u9390\u93ba\u93c3\u947f\u977b\u9847\u99d4\u9a75",zuan:"\u94bb\u7e82\u8d5a\u7f35\u8e9c\u6525\u5297\u63dd\u64ae\u6512\u6522\u6b11\u7bf9\u7c6b\u7e64\u7e89\u7e98\u8cfa\u8ea6\u945a\u947d",zui:"\u6700\u5634\u9189\u7f6a\u5806\u5480\u89dc\u855e\u539c\u55fa\u567f\u5ae2\u5d89\u5d8a\u5db5\u6467\u64ae\u666c\u6718\u67a0\u682c\u69ef\u6a36\u6a87\u6a8c\u6b08\u6fe2\u74bb\u775f\u797d\u7a21\u7a5d\u7d4a\u7e97\u7fa7\u8127\u87d5\u8fa0\u9154\u9168\u917b\u92f7\u930a\u96cb",zun:"\u5c0a\u9075\u9cdf\u6499\u6a3d\u50ce\u50d4\u5642\u58ab\u5960\u5d9f\u62f5\u6358\u637d\u682b\u7033\u7e5c\u7f47\u88b8\u8b50\u8de7\u8e06\u8e72\u928c\u940f\u9c52\u9d8e\u9df7",zuo:"\u505a\u4f5c\u5750\u5de6\u5ea7\u6628\u51ff\u7422\u64ae\u4f50\u7b2e\u9162\u5511\u795a\u80d9\u600d\u963c\u67de\u4e4d\u4fb3\u5497\u5c9d\u5c9e\u632b\u637d\u67ee\u690a\u781f\u79e8\u7a13\u7b70\u7cf3\u7e53\u82f2\u838b\u8443\u8444\u84d9\u888f\u8ace\u918b\u923c\u947f\u98f5\u562c\u961d"};
})(window);
/**
 * 评级插件
 * @param  {Key-value}   [options]  配置
 * @param  {Number}      [options.MaxStar=5]       最大星级
 * @param  {Number}      [options.StarWidth=30]    每级所占宽度，与上面参数共同构成总宽度
 * @param  {Number}      [options.CurrentStar=0]   当级星级
 * @param  {Boolean}     [options.Enabled=true]    是否可用，当为false时，不能选择星级
 * @param  {Number}     [options.Half=0]          当Half为true时，可以选择每级的1/2处
 * @param  {Number}     [options.prefix=0]
 * @param  {Function}    callback                  回调
 * @return {Jquery}            jq对象
 */
$.fn.studyplay_star = function(options, callback) {
	//默认设置
	var settings = {
		MaxStar: 11,
		StarWidth: 10,
		CurrentStar: 0,
		Enabled: true,
		Half: 0,
		prefix: 0,
		mark: 0
	};

	var container = jQuery(this),
		_value =  container.data("value");
	if(_value) {
		settings.CurrentStar = _value; 
	}

	if (options) {
		jQuery.extend(settings, options);
	};
	container.css({
		"position": "relative",
		"float": "right"
	})
	.html('<ul class="studyplay_starBg"></ul>')
	.find('.studyplay_starBg').width(settings.MaxStar * settings.StarWidth)
	.html('<li class="studyplay_starovering" style="width:' + (settings.CurrentStar + 1) * settings.StarWidth + 'px; z-index:0;" id="studyplay_current"></li>');
	
	if (settings.Enabled) {
		var ListArray = "";
		if (settings.Half == 0) {
			for (k = 1; k < settings.MaxStar + 1; k++) {
				ListArray += '<li class="studyplay_starON" style="width:' + settings.StarWidth * k + 'px;z-index:' + (settings.MaxStar - k + 1) + ';"></li>';
			}
		}
		if (settings.Half == 1) {
			for (k = 1; k < settings.MaxStar * 2 + 1; k++) {
				ListArray += '<li class="studyplay_starON" style="width:' + settings.StarWidth * k / 2 + 'px;z-index:' + (settings.MaxStar - k + 1) + ';"></li>';
			}
		}
		container.find('.studyplay_starBg').append(ListArray);

		container.find('.studyplay_starON').hover(function() {
				var studyplay_count = settings.MaxStar - $(this).css("z-index");
				$(this).siblings('.studyplay_starovering').hide();
				$('#processbar_info_' + settings.prefix).html('&nbsp;' + studyplay_count * 10 + '%');
				$(this).removeClass('studyplay_starON').addClass("studyplay_starovering");
				$("#studyplay_current" + settings.prefix).hide();
				container.trigger("star.enter", { count: studyplay_count, current: $(this) })
			},
			function() {
				var studyplay_count = settings.MaxStar - $(this).css("z-index");
				$(this).siblings('.studyplay_starovering').show();
				$('#processbar_info_' + settings.prefix).html('&nbsp;' + $('#processinput_' + settings.prefix).val() * 10 + '%');
				$(this).removeClass('studyplay_starovering').addClass("studyplay_starON");
				$("#studyplay_current" + settings.prefix).show();
				container.trigger("star.leave", { count: studyplay_count, current: $(this) })		
			})
			.click(function() {
				var studyplay_count = settings.MaxStar - $(this).css("z-index");
				$(this).siblings('.studyplay_starovering').width((studyplay_count + 1) * settings.StarWidth)
				if (settings.Half == 0)
					$("#studyplay_current" + settings.prefix).width('&nbsp;' + studyplay_count * settings.StarWidth)
				$(this).siblings('.studyplay_starovering').width('&nbsp;' + (studyplay_count + 1) * settings.StarWidth)
				if (settings.Half == 1)
					$("#studyplay_current" + settings.prefix).width((studyplay_count + 1) * settings.StarWidth / 2)
					//回调函数
				if (typeof callback == 'function') {
					if (settings.Half == 0)
						callback(studyplay_count, container);
					if (settings.Half == 1)
						callback(studyplay_count / 2, container);
					return;
				}
			})
	}
};
//$.fn.switch
//开关初始化
(function(){
	/**
	 * 初始化开关的类
	 * @class  Switch
	 * @param  {Element|Jquery} element 要初始化的元素，必须为input:checkbox元素
	 * @param  {Key-Value}      options [配置，目前未定义]
	 * @return {Object}         switch实例对象
	 */
	var Switch = function(element, options){
		this.$el = $(element);
		this.options = options;
		this.init();
	}
	Switch.prototype = {
		constructor: Switch,
		/**
		 * 初始化函数
		 * @method init
		 * @private
		 */
		init: function(){
			var $el = this.$el,
				cls = "toggle",
				isChecked = $el.prop('checked'),
				isDisabled = $el.prop('disabled');
			!isChecked && (cls += " toggle-off");
			isDisabled && (cls += " toggle-disabled");
			// $el.remove();
			this.toggle = $el.wrap('<label class="'+ cls +'"></label>').parent();
			// 将input的title属性赋予容器label
			this.toggle.attr('title', $el.attr('title'));
			if(!isDisabled){
				this._bindEvent();
			}
		},
		/**
		 * 事件绑定
		 * @method bindEvent
		 * @private
		 * @chainable
		 * @return {Object}        当前调用对象
		 */
		_bindEvent: function(){
			var that = this;
			this.$el.off("change.switch").on("change.switch", function(){
				if(!this.checked) {
					that.toggle.addClass("toggle-off");
				}else{
					that.toggle.removeClass("toggle-off");
				}
			})
			return this;
		},
		/**
		 * 事件解绑
		 * @method unbindEvent
		 * @private
		 * @chainable
		 * @return {Object}        当前调用对象
		 */
		_unbindEvent: function(){
			this.$el.off("change.switch");
			return this;
		},
		/**
		 * 打开开关
		 * @method turnOn
		 * @chainable
		 * @param  {Function} call 回调函数
		 * @return {Object}        当前调用对象
		 */
		turnOn: function(call){
			this.$el.prop("checked", true).trigger("change");
		},
		/**
		 * 关闭开关
		 * @method turnOff
		 * @chainable
		 * @param  {Function} call 回调函数
		 * @return {Object}        当前调用对象
		 */
		turnOff: function(){
			this.$el.prop("checked", false).trigger("change");
		},
		/**
		 * 禁用开关
		 * @method setDisabled
		 * @chainable
		 * @param  {Function} call 回调函数
		 * @return {Object}        当前调用对象
		 */
		setDisabled: function(call){
			this.toggle.addClass("toggle-disabled");
			this.$el.prop("disabled", true);
			this._unbindEvent()
			return this;
		},
		/**
		 * 启用开关
		 * @method setDisabled
		 * @chainable
		 * @param  {Function} call 回调函数
		 * @return {Object}        当前调用对象
		 */
		setEnabled: function(call){
			this.toggle.removeClass("toggle-disabled");
			this.$el.prop("disabled", false);
			this._bindEvent()
			return this;
		}
	}
	/**
	 * @class $.fn
	 */
	/**
	 * 初始化开关，类Switch的入口
	 * @method $.fn.iSwitch
	 * @param  {String|Object} option Switch方法名或配置（配置目前不可用
	 * @param  {Any}           [any]  传入Switch方法的参数，类型，长度不限
	 * @return {Jquery}        jq数组
	 */
	$.fn.iSwitch = function(option/*,...*/){
		var argu = Array.prototype.slice.call(arguments, 1);
		return this.each(function(){
			var data = $(this).data("switch");
			if(!data||!(data instanceof Switch)){
				$(this).data("switch", data = new Switch($(this), option));
			}
			if(typeof option === "string"){
				data[option] && data[option].apply(data, argu);
			}
		})
	}
	//全局调用
	$(function(){
		$('[data-toggle="switch"]').iSwitch();
	})
})();
