export interface ChoiceOptionGroup<Group> {
    optionGroup: Group;
    group: true;
    index?: number;
}

type ChoiceFromField<Option, GroupField extends string> = Option extends unknown
    ? GroupField extends keyof Option
        ? NonNullable<Option[GroupField]> extends readonly (infer Item)[]
            ? Item
            : Option
        : Option
    : never;

export type ChoiceItem<Option, GroupField extends string, Child> = [Child] extends [never]
    ? string extends GroupField
        ? Option
        : ChoiceFromField<Option, GroupField>
    : Child;

export type DisplayedChoice<Option, GroupField extends string, Child> = [Child] extends [never]
    ? string extends GroupField
        ? Option
        : ChoiceItem<Option, GroupField, Child> | ChoiceOptionGroup<Option>
    : Child | ChoiceOptionGroup<Option>;
