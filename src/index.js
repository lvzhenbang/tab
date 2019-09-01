import defaults from '../config/defaults';
import version from '../config/version';

import addUnit from './utils/addUnit';
import inBrowser from './utils/inBrowser';

import ScrollTo from './scrollTo';

class Tab {
  constructor(el, opt) {
    this.$el = el;
    this.options = {
      ...defaults,
      ...opt,
    };
    this.items = this.$el.querySelectorAll('.tab-item');
    this.activeItem = this.getActiveItem();
    this.scrollBarEl = this.getScrollBarEl();
    this.$slider = this.getSlider();

    this.slider = {
      width: null,
      height: addUnit(this.options.height),
      top: null,
      left: null,
      backgroundColor: this.options.backgroundColor,
    };

    this.isHorizontal = this.options.direction;

    this.version = version;

    this.init();
  }

  init() {
    if (!this.options.hideSlider) {
      this.setSliderStyle();
      this.setActiveItemStyle();
    }
    this.hideScrollbar();
    this.tabTrigger();
  }

  tabTrigger() {
    this.items.forEach((tabItem) => {
      tabItem.addEventListener('click', this.changeSlider.bind(this));
    });
  }

  getActiveItem() {
    let activeEl = this.$el.querySelector('.tab-item.active');
    if (!activeEl) {
      [activeEl] = this.items;
      activeEl.classList.add('active');
    }
    return activeEl;
  }

  getSlider() {
    let sliderEl = this.$el.querySelector('.tab__slider');
    // to create element without sliderEl
    if (!sliderEl) {
      sliderEl = document.createElement('div');
      sliderEl.classList.add('tab__slider');
      this.$el.appendChild(sliderEl);
    }
    return sliderEl;
  }

  callSlider() {
    this.slider.width = this.isHorizontal
      ? addUnit(this.activeItem.scrollWidth) : addUnit(this.options.width);
    this.slider.height = this.isHorizontal
      ? addUnit(this.options.height) : addUnit(this.activeItem.scrollHeight);
    this.slider.top = this.isHorizontal
      ? undefined : addUnit(this.activeItem.offsetTop);
    this.slider.left = this.isHorizontal
      ? addUnit(this.activeItem.offsetLeft) : undefined;
  }

  changeSlider(e) {
    const item = e.currentTarget;
    const itemClassList = item.classList;
    if (!itemClassList.contains('active')) {
      this.activeItem.classList.remove('active');
      this.activeItem.style = null;
      item.classList.add('active');
      this.activeItem = item;
      // enable tabscroller
      if (this.scrollBarEl) {
        this.tabScrollerTrigger();
      } else {
        throw new Error("it's error. Please check the options of Tab-instance.");
      }
      // set the slider style
      this.setSliderStyle();
      // set the background and font colors the same
      this.setActiveItemStyle();
    }
  }

  setActiveItemStyle() {
    this.activeItem.style.color = this.options.backgroundColor;
  }

  setSliderStyle() {
    this.callSlider();

    Object.entries(this.slider).forEach(([key, value]) => {
      this.$slider.style[key] = value;
    });
  }

  getScrollBarEl() {
    const scrollBar = this.$el.parentNode;
    return this.options.scrollBar && scrollBar.classList.contains('tab__scroller') ? scrollBar : null;
  }

  hideScrollbar() {
    if (
      this.scrollBarEl.offsetHeight > this.scrollBarEl.clientHeight
      || this.scrollBarEl.offsetWidth > this.scrollBarEl.clientWidth
    ) {
      if (this.isHorizontal) {
        this.scrollBarEl.style['margin-bottom'] = addUnit(this.scrollBarEl.clientHeight - this.scrollBarEl.offsetHeight);
      } else {
        this.scrollBarEl.style['margin-right'] = addUnit(this.scrollBarEl.clientWidth - this.scrollBarEl.offsetWidth);
      }
    }
  }

  tabScrollerTrigger() {
    const clientRect = this.activeItem.getBoundingClientRect();
    const halfWidth = clientRect.width / 2;
    const halfHeight = clientRect.height / 2;
    const scrollBarRectX = clientRect.left - this.scrollBarEl.getBoundingClientRect().left;
    const scrollBarRectY = clientRect.top - this.scrollBarEl.getBoundingClientRect().top;

    let finalPosition = null;

    if (this.isHorizontal) {
      if (scrollBarRectX < halfWidth) {
        const previousEl = this.activeItem.previousElementSibling;
        if (previousEl) {
          finalPosition = this.scrollBarEl.scrollLeft + scrollBarRectX - previousEl.offsetWidth / 2;
        } else {
          finalPosition = 0;
        }
        this.tabScrollTo(finalPosition);
      }

      if (scrollBarRectX > this.scrollBarEl.offsetWidth - 3 * halfWidth) {
        const nextEl = this.activeItem.nextElementSibling;
        if (nextEl) {
          finalPosition = this.scrollBarEl.scrollLeft
            + scrollBarRectX + 2 * halfWidth - this.scrollBarEl.offsetWidth
            + nextEl.offsetWidth / 2;
        } else {
          finalPosition = this.scrollBarEl.offsetWidth;
        }

        this.tabScrollTo(finalPosition);
      }
    } else {
      if (scrollBarRectY < halfHeight) {
        const previousEl = this.activeItem.previousElementSibling;
        if (previousEl) {
          finalPosition = this.scrollBarEl.scrollTop + scrollBarRectY - halfHeight;
        } else {
          finalPosition = 0;
        }
        this.tabScrollTo(finalPosition);
      }

      if (scrollBarRectY > this.scrollBarEl.offsetHeight - 3 * halfHeight) {
        const nextEl = this.activeItem.nextElementSibling;
        if (nextEl) {
          finalPosition = this.scrollBarEl.scrollTop
            + scrollBarRectY + 2 * halfHeight - this.scrollBarEl.offsetHeight
            + nextEl.offsetHeight / 2;
        } else {
          finalPosition = this.scrollBarEl.offsetHeight;
        }
        this.tabScrollTo(finalPosition);
      }
    }
  }

  tabScrollTo(finalPosition) {
    this.handleCompatible();
    this.scrollBarEl.scrollTo({
      top: this.isHorizontal ? null : finalPosition,
      left: this.isHorizontal ? finalPosition : null,
      behavior: 'smooth',
    });
  }

  handleCompatible() {
    if (!Object.prototype.hasOwnProperty.call(this.$el, 'scrollTo')) {
      window.Element.prototype.scrollTo = function scrollTo(opts) {
        return new ScrollTo(this, opts);
      };
    }
  }
}

if (inBrowser) {
  window.Tab = Tab;
  window.console.log('plugin is running browser.');
}

export default Tab;
