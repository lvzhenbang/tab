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

    this.slider = {
      width: null,
      height: addUnit(this.options.height),
      top: null,
      left: null,
      backgroundColor: this.options.backgroundColor,
    };

    this.$slider = this.getSlider();

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
    const isHorizontal = this.options.direction;
    this.slider.width = isHorizontal
      ? addUnit(this.activeItem.scrollWidth) : addUnit(this.options.width);
    this.slider.height = isHorizontal
      ? addUnit(this.options.height) : addUnit(this.activeItem.scrollHeight);
    this.slider.top = isHorizontal
      ? undefined : addUnit(this.activeItem.offsetTop);
    this.slider.left = isHorizontal
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
}

if (inBrowser) {
  window.Tab = Tab;
  window.console.log('plugin is running browser.');
}

export default Tab;
