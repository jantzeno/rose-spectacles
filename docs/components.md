# Removed legacy components

Use the replacements below in named imports and component subpaths. Update pass-through configuration to target the replacement component.

| Legacy component | Current alternative                                   |
| ---------------- | ----------------------------------------------------- |
| AccordionTab     | AccordionPanel, AccordionHeader, and AccordionContent |
| Calendar         | DatePicker                                            |
| Chips            | InputChips or AutoComplete with typeahead turned off  |
| Dropdown         | Select                                                |
| InlineMessage    | Message                                               |
| InputSwitch      | ToggleSwitch                                          |
| OverlayPanel     | Popover                                               |
| Sidebar          | Drawer                                                |
| Steps            | Stepper                                               |
| TabMenu          | Tabs                                                  |
| TabView          | Tabs, TabList, Tab, TabPanels, and TabPanel           |
| Badge directive  | OverlayBadge                                          |

For Accordion, use `value` and matching panel values. For Tabs, put headers in `Tab` and content in `TabPanel`, pairing them by `value`. Replace `v-badge` with an `OverlayBadge` wrapping the element.
