import store from 'Core/Store';

/**
 * @typedef {Object} CursorPluginParams
 * @property {?boolean} deferInit Set to true to stop auto init in `addPlugin()`
 * @property {boolean} hideOnBlur=true Hide the cursor when the mouse leaves the
 * waveform
 * @property {string} width='1px' The width of the cursor
 * @property {string} color='black' The color of the cursor
 * @property {string} opacity='0.25' The opacity of the cursor
 * @property {string} style='solid' The border style of the cursor
 * @property {number} zIndex=3 The z-index of the cursor element
 * @property {object} customStyle An object with custom styles which are applied
 * to the cursor element
 * @property {boolean} showTime=false Show the time on the cursor.
 * @property {object} customShowTimeStyle An object with custom styles which are
 * applied to the cursor time element.
 * @property {string} followCursorY=false Use `true` to make the time on
 * the cursor follow the x and the y-position of the mouse. Use `false` to make the
 * it only follow the x-position of the mouse.
 * @property {function} formatTimeCallback Formats the timestamp on the cursor.
 * @typedef {Object} RegionsPluginParams
 * @property {?boolean} dragSelection Enable creating regions by dragging with
 * the mouse
 * @property {?RegionParams[]} regions Regions that should be added upon
 * initialisation
 * @property {number} slop=2 The sensitivity of the mouse dragging
 * @property {?number} snapToGridInterval Snap the regions to a grid of the specified multiples in seconds
 * @property {?number} snapToGridOffset Shift the snap-to-grid by the specified seconds. May also be negative.
 * @property {?boolean} deferInit Set to true to manually call
 * @property {number[]} maxRegions Maximum number of regions that may be created by the user at one time.
 * `initPlugin('regions')`
 * @property {function} formatTimeCallback Allows custom formating for region tooltip.
 * @property {?number} edgeScrollWidth='5% from container edges' Optional width for edgeScroll to start
 * @typedef {Object} RegionParams
 * @desc The parameters used to describe a region.
 * @example wavesurfer.addRegion(regionParams);
 * @property {string} id=→random The id of the region
 * @property {number} start=0 The start position of the region (in seconds).
 * @property {number} end=0 The end position of the region (in seconds).
 * @property {?boolean} loop Whether to loop the region when played back.
 * @property {boolean} drag=true Allow/disallow dragging the region.
 * @property {boolean} resize=true Allow/disallow resizing the region.
 * @property {string} [color='rgba(0, 0, 0, 0.1)'] HTML color code.
 * @property {?number} channelIdx Select channel to draw the region on (if there are multiple channel waveforms).
 * @property {?object} handleStyle A set of CSS properties used to style the left and right handle.
 * @property {?boolean} preventContextMenu=false Determines whether the context menu is prevented from being opened.
 * @property {boolean} showTooltip=true Enable/disable tooltip displaying start and end times when hovering over region.
 */

/**
 * Displays a thin line at the position of the cursor on the waveform.
 *
 * @implements {PluginClass}
 * @extends {Observer}
 * @example
 * // es6
 * import Mpitendry from 'wavesurfer.cursor.js';
 *
 * // commonjs
 * var Mpitendry = require('wavesurfer.cursor.js');
 *
 * // if you are using <script> tags
 * var Mpitendry = window.WaveSurfer.cursor;
 *
 * // ... initialising wavesurfer with the plugin
 * var wavesurfer = WaveSurfer.create({
 *   // wavesurfer options ...
 *   plugins: [
 *     Mpitendry.create({
 *       // plugin options ...
 *     })
 *   ]
 * });
 */
class Mpitendry {
    /**
     * Cursor plugin definition factory
     *
     * This function must be used to create a plugin definition which can be
     * used by wavesurfer to correctly instantiate the plugin.
     *
     * @param  {CursorPluginParams} params parameters use to initialise the
     * plugin
     * @return {PluginDefinition} an object representing the plugin
     */
    static create(params) {
        return {
            name: 'mpitendry',
            deferInit: params && params.deferInit ? params.deferInit : false,
            params: params,
            staticProps: {
                addRegion(options) {
                    if (!this.initialisedPluginList.regions) {
                        this.initPlugin('mpitendry');
                    }
                    return this.regions.add(options);
                },

                clearRegions() {
                    this.regions && this.regions.clear();
                },

                enableDragSelection(options) {
                    if (!this.initialisedPluginList.regions) {
                        this.initPlugin('mpitendry');
                    }
                    this.regions.enableDragSelection(options);
                },

                disableDragSelection() {
                    this.regions.disableDragSelection();
                }
            },
            instance: Mpitendry
        };
    }

    /**
     * @type {CursorPluginParams}
     */
    defaultParams = {
        hideOnBlur: true,
        width: '1px',
        color: 'black',
        opacity: '0.25',
        style: 'solid',
        zIndex: 4,
        customStyle: {},
        customShowTimeStyle: {},
        showTime: false,
        followCursorY: false,
        formatTimeCallback: null
    };

    /**
     * @param {object} e Mouse move event
     */
    _onMousemove = e => {
        const bbox = this.wavesurfer.container.getBoundingClientRect();
        let y = 0;
        let x = e.clientX - bbox.left;

        if (this.params.showTime && this.params.followCursorY) {
            // follow y-position of the mouse
            y = e.clientY - (bbox.top + bbox.height / 2);
        }

        this.updateCursorPosition(x, y);
    };

    /**
     * @returns {void}
     */
    _onMouseenter = () => this.showCursor();

    /**
     * @returns {void}
     */
    _onMouseleave = () => this.hideCursor();

	_onClick = e => {
        const bbox = this.wavesurfer.container.getBoundingClientRect();
        let x = e.clientX - bbox.left;
        this.couper(x);
    };

    /**
     * Construct the plugin class. You probably want to use `Mpitendry.create`
     * instead.
     *
     * @param {CursorPluginParams} params Plugin parameters
     * @param {object} ws Wavesurfer instance
     */
    constructor(params, ws) {
        this.wavesurfer = ws;
        this.style = ws.util.style;
        /**
         * The cursor HTML element
         *
         * @type {?HTMLElement}
         */
        this.cursor = null;
        /**
         * displays the time next to the cursor
         *
         * @type {?HTMLElement}
         */
        this.showTime = null;
        /**
         * The html container that will display the time
         *
         * @type {?HTMLElement}
         */

        this.params = Object.assign({}, this.defaultParams, params);
    }

    /**
     * Initialise the plugin (used by the Plugin API)
     */
    init() {
        this.wrapper = this.wavesurfer.container;
        this.cursor = this.wrapper.appendChild(
            this.style(
                document.createElement('cursor'),
                Object.assign(
                    {
                        position: 'absolute',
                        zIndex: this.params.zIndex,
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '0',
                        display: 'flex',
                        borderRightStyle: this.params.style,
                        borderRightWidth: this.params.width,
                        borderRightColor: this.params.color,
                        opacity: this.params.opacity,
                        pointerEvents: 'none'
                    },
                    this.params.customStyle
                )
            )
        );
        if (this.params.showTime) {
            this.showTime = this.wrapper.appendChild(
                this.style(
                    document.createElement('showTitle'),
                    Object.assign(
                        {
                            position: 'absolute',
                            zIndex: this.params.zIndex,
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 'auto',
                            display: 'flex',
                            opacity: this.params.opacity,
                            pointerEvents: 'none',
                            height: '100%'
                        },
                        this.params.customStyle
                    )
                )
            );
        }

        this.wrapper.addEventListener('mousemove', this._onMousemove);
		this.wrapper.addEventListener('click', this._onClick);
        if (this.params.hideOnBlur) {
            // ensure elements are hidden initially
            this.hideCursor();
            this.wrapper.addEventListener('mouseenter', this._onMouseenter);
            this.wrapper.addEventListener('mouseleave', this._onMouseleave);
        }
    }

    /**
     * Destroy the plugin (used by the Plugin API)
     */
    destroy() {
        if (this.params.showTime) {
            this.cursor.parentNode.removeChild(this.showTime);
        }
        this.cursor.parentNode.removeChild(this.cursor);
        this.wrapper.removeEventListener('mousemove', this._onMousemove);
		this.wrapper.removeEventListener('click', this._onClick);
        if (this.params.hideOnBlur) {
            this.wrapper.removeEventListener('mouseenter', this._onMouseenter);
            this.wrapper.removeEventListener('mouseleave', this._onMouseleave);
        }
    }

	couper(xpos) {
		const duration = this.wavesurfer.getDuration();
		const elementWidth =
                this.wavesurfer.drawer.width /
                this.wavesurfer.params.pixelRatio;
		const scrollWidth = this.wavesurfer.drawer.getScrollX();

        const scrollTime =
                (duration / this.wavesurfer.drawer.width) * scrollWidth;
		const timeValue = Math.max(0, (xpos / elementWidth) * duration) + scrollTime;
		store.dispatch({type:'cut', xpos:timeValue, duration:duration})
	}

    /**
     * Update the cursor position
     *
     * @param {number} xpos The x offset of the cursor in pixels
     * @param {number} ypos The y offset of the cursor in pixels
     */
    updateCursorPosition(xpos, ypos) {
        this.style(this.cursor, {
            left: `${xpos}px`
        });
        if (this.params.showTime) {
            const duration = this.wavesurfer.getDuration();
            const elementWidth =
                this.wavesurfer.drawer.width /
                this.wavesurfer.params.pixelRatio;
            const scrollWidth = this.wavesurfer.drawer.getScrollX();

            const scrollTime =
                (duration / this.wavesurfer.drawer.width) * scrollWidth;

            const timeValue =
                Math.max(0, (xpos / elementWidth) * duration) + scrollTime;
            const formatValue = this.formatTime(timeValue);
            this.style(this.showTime, {
                left: `${xpos}px`,
                top: `${ypos}px`
            });
			store.dispatch({type:'ws.cursorpos', xpos:timeValue*1000, ypos})
        }
    }

    /**
     * Show the cursor
     */
    showCursor() {
        this.style(this.cursor, {
            display: 'flex'
        });
        if (this.params.showTime) {
            this.style(this.showTime, {
                display: 'flex'
            });
        }
    }

    /**
     * Hide the cursor
     */
    hideCursor() {
        this.style(this.cursor, {
            display: 'none'
        });
        if (this.params.showTime) {
            this.style(this.showTime, {
                display: 'none'
            });
        }
    }

    /**
     * Format the timestamp for `cursorTime`.
     *
     * @param {number} cursorTime Time in seconds
     * @returns {string} Formatted timestamp
     */
    formatTime(cursorTime) {
        cursorTime = isNaN(cursorTime) ? 0 : cursorTime;

        if (this.params.formatTimeCallback) {
            return this.params.formatTimeCallback(cursorTime);
        }
        return [cursorTime].map(time =>
            [
                Math.floor((time % 3600) / 60), // minutes
                ('00' + Math.floor(time % 60)).slice(-2), // seconds
                ('000' + Math.floor((time % 1) * 1000)).slice(-3) // milliseconds
            ].join(':')
        );
    }

    /**
     * Get outer width of given element.
     *
     * @param {DOM} element DOM Element
     * @returns {number} outer width
     */
    outerWidth(element) {
        if (!element) {
            return 0;
        }

        let width = element.offsetWidth;
        let style = getComputedStyle(element);

        width += parseInt(style.marginLeft + style.marginRight);
        return width;
    }
}

export default Mpitendry