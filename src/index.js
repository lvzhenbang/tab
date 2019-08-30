import defaults from '../config/defaults';
import version from '../config/version';

import addUnit from './utils/addUnit';
import inBrowser from './utils/inBrowser';

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

    this.tabTrigger();
  }

  tabTrigger() {
    for (const tabItem of this.items) {
      tabItem.addEventListener('click', this.changeSlider.bind(this));
    }
  }

  getActiveItem() {
    let activeEl = this.$el.querySelector('.tab-item.active');
    if (!activeEl) {
      activeEl = this.items[0];
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
    for (const key in this.slider) {
      this.$slider.style[key] = this.slider[key];
    }
  }

  getScrollBarEl() {
    const scrollBar = this.$el.parentNode;
    return this.options.scrollBar && scrollBar.classList.contains('tab__scroller') ? scrollBar : null;
  }

  tabScrollerTrigger() {
    const clientRect = this.activeItem.getBoundingClientRect();
    const halfWidth = clientRect.width / 2;
    const halfHeight = clientRect.height / 2;
    let finalPosition = null;

    if (this.isHorizontal) {
      if (clientRect.x < halfWidth) {
        finalPosition = this.scrollBarEl.scrollLeft + clientRect.x - halfWidth;
        this.tabScrollTo(finalPosition);
      }

      if (clientRect.x > this.scrollBarEl.offsetWidth - 3 * halfWidth) {
        finalPosition = this.scrollBarEl.scrollLeft
          + clientRect.x + 3 * halfWidth - this.scrollBarEl.offsetWidth;
        this.tabScrollTo(finalPosition);
      }
    } else {
      if (clientRect.y < halfHeight) {
        finalPosition = this.scrollBarEl.scrollTop + clientRect.y - halfHeight;
        this.tabScrollTo(finalPosition);
      }

      if (clientRect.y > this.scrollBarEl.offsetHeight - 3 * halfHeight) {
        finalPosition = this.scrollBarEl.scrollTop
          + clientRect.y + 3 * halfHeight - this.scrollBarEl.offsetHeight;
        this.tabScrollTo(finalPosition);
      }
    }
  }

  tabScrollTo(finalPosition) {
    this.scrollBarEl.scrollTo({
      top: this.isHorizontal ? null : finalPosition,
      left: this.isHorizontal ? finalPosition : null,
      behavior: 'smooth',
    });
  }
}

if (inBrowser) {
  window.Tab = Tab;
  window.console.log('plugin is running browser.');
}

export default Tab;
