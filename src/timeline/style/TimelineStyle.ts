import { style } from '../../internal/styles/timeline/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }: StyleContext) => ['rs-timeline rs-component', 'rs-timeline-' + props.align, 'rs-timeline-' + props.layout],
    event: 'rs-timeline-event',
    eventOpposite: 'rs-timeline-event-opposite',
    eventSeparator: 'rs-timeline-event-separator',
    eventMarker: 'rs-timeline-event-marker',
    eventConnector: 'rs-timeline-event-connector',
    eventContent: 'rs-timeline-event-content'
};

export default BaseStyle.extend({
    name: 'timeline',
    style,
    classes
});
