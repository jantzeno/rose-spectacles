/**
 *
 * Timeline visualizes a series of chained events.
 *
 *
 * @module timelinestyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TimelineClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-timeline',
    /**
     * Class name of the event element
     */
    event = 'rs-timeline-event',
    /**
     * Class name of the event opposite element
     */
    eventOpposite = 'rs-timeline-event-opposite',
    /**
     * Class name of the event separator element
     */
    eventSeparator = 'rs-timeline-event-separator',
    /**
     * Class name of the event marker element
     */
    eventMarker = 'rs-timeline-event-marker',
    /**
     * Class name of the event connector element
     */
    eventConnector = 'rs-timeline-event-connector',
    /**
     * Class name of the event content element
     */
    eventContent = 'rs-timeline-event-content'
}

export interface TimelineStyle extends BaseStyle {}

declare const style: TimelineStyle;
export default style;
