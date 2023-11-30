import React, { ReactNode, RefObject } from 'react';
import cx from 'classnames';
import { DropdownOption } from '@writerai/common-utils';
import {
  AutoSizeTextarea,
  Dropdown,
  DropdownPlacement,
  Icon,
  IconVariant,
  Input,
  Label,
  MuiFormControl,
  MuiInputProps,
  Tag,
  TagSize,
  Text,
  TextSize,
  Tooltip,
  TooltipAlignment,
} from '@writerai/ui-atoms';

import { Autocomplete, AutocompleteListPosition, IAutocompleteValues } from './Autocomplete';
import { AutocompleteTags } from './AutocompleteTags';

import styles from './styles.module.css';

export interface AutocompleteOption {
  name: string;
  subText?: string;
}

export interface IInputGroup extends MuiInputProps {
  /** Input's ID */
  id: string;
  /** Set additional css class */
  className?: string;
  classNameSelectTrigger?: string;
  classNameDropdownItem?: string;
  classNameSelectStyled?: string;
  /** Input's ref */
  inputRef?: RefObject<HTMLTextAreaElement> | RefObject<HTMLInputElement>;
  /** Input's label */
  label?: string | ReactNode;
  /** Pass the type of Input required */
  inputType?: InputTypes;
  /** Input's NAME */
  name?: string;
  /** Input value */
  value?: string;
  /** onChange function for Input */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChangeInput?: (e: any) => void;
  /** onChange function for every Input change */
  onInputChange?: (e: string) => void;
  /** Input's placeholder */
  placeholder?: string;
  /** Adds mark " *REQUIRED " to Label */
  required?: boolean;
  /** Error text to show in label field if */
  errorText?: string;
  /** Helper text under Input field */
  helperText?: string;
  /** options for Dropdown */
  dropdownOptions?: DropdownOption[];
  /** Icon for Select field */
  selectIcon?: ReactNode | null;
  /** default values for Autocomplete */
  defaultValue?: IAutocompleteValues[];
  /** options for Autocomplete */
  autocompleteOptions?: AutocompleteOption[];
  /** options position for Autocomplete */
  autocompleteOptionsPosition?: AutocompleteListPosition;
  /** Type of the input element. It should be a valid HTML5 input type */
  type?: string;
  /** for Autocomplete only, shows tooltip text when there are prefilled tags which user can't delete */
  prefilledTagsTooltip?: string;
  /** disables the helper text for input groups */
  disableHelperText?: boolean;
  /** shows the dropdown options in form of tags (specifically for Dropdown type = SELECT)  */
  withTags?: boolean;
  /** shows add item feature */
  autocompleteEditable?: boolean;
  /** shows default values to autocomplete */
  autocompleteValue?: IAutocompleteValues[];
  /** shows default values to autocomplete */
  autocompleteFreeSolo?: boolean;
  /** clear the selected autocomplete value */
  autocompleteSelectOnFocus?: boolean;
  /** helps to enter a new value */
  autocompleteClearOnBlur?: boolean;
  /** input filed icon */
  indicator?: ReactNode;
  /** input filed popup text */
  tooltipContent?: ReactNode;
  /** input filed popup container class */
  tooltipContainerClass?: string;
  /** input filed popup text */
  labelTooltipContent?: ReactNode;
  /** input filed popup container class */
  labelTooltipContainerClass?: string;
  /** input filed focus container class */
  classNameFocused?: string;
  /** Additional text to show in label field if */
  additionalText?: string;
  /** use checkbox inputs */
  useCheckbox?: boolean;
  /** hide popup on option click */
  hideOnCLick?: boolean;
  /** hide popup on option click */
  disabled?: boolean;
  /** add additional border radius */
  rounded?: boolean;
  /** add make input focused */
  autoFocus?: boolean;
}

export enum InputTypes {
  INPUT = 'input',
  AUTOCOMPLETE = 'autocomplete',
  AUTOCOMPLETE_TAGS = 'autocomplete_tags',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  CUSTOM = 'custom',
  TEXTAREA = 'textarea',
}

const DescriptionTooltip = ({ content, className }: { content: React.ReactNode; className?: string }) => (
  <div className={cx(styles.formControlTooltipContainer, className)}>{content}</div>
);

const LabelIcon = ({
  labelTooltipContent,
  tooltipContainerClass,
}: {
  labelTooltipContent: React.ReactNode;
  tooltipContainerClass?: string;
}) => (
  <Tooltip
    title={<DescriptionTooltip content={labelTooltipContent} className={tooltipContainerClass} />}
    disabled={!labelTooltipContent}
    placement="right"
  >
    <div className={cx(styles.formLabelIconContainer)}>
      <Icon name={IconVariant.INFO_OUTLINED} />
    </div>
  </Tooltip>
);

export const InputGroup: React.FC<IInputGroup> = ({
  className,
  classNameSelectTrigger = '',
  classNameDropdownItem = '',
  classNameSelectStyled = '',
  inputType = InputTypes.INPUT,
  handleChangeInput,
  id,
  inputRef,
  value,
  defaultValue,
  label,
  placeholder,
  required = false,
  errorText = '',
  helperText = '',
  autocompleteOptions = [],
  dropdownOptions = [],
  selectIcon = null,
  children,
  disableHelperText,
  withTags,
  autocompleteOptionsPosition,
  autocompleteEditable,
  autocompleteValue = [],
  autocompleteFreeSolo,
  autocompleteSelectOnFocus,
  autocompleteClearOnBlur,
  indicator,
  tooltipContent,
  tooltipContainerClass,
  labelTooltipContent,
  labelTooltipContainerClass,
  classNameFocused,
  additionalText = '',
  useCheckbox,
  hideOnCLick,
  disabled = false,
  autoFocus = false,
  rounded,
  ...props
}) => {
  let inputField: React.ReactNode;

  switch (inputType) {
    case InputTypes.CUSTOM:
      inputField = children;
      break;

    case InputTypes.TEXTAREA:
      inputField = (
        <AutoSizeTextarea
          inputRef={inputRef as React.RefObject<HTMLTextAreaElement>}
          error={!!errorText}
          onChange={handleChangeInput}
          disabled={disabled}
          autoFocus={autoFocus}
          className={className}
          value={(value as string) || ''}
          {...{ id, defaultValue, placeholder }}
          {...props}
        />
      );
      break;

    case InputTypes.AUTOCOMPLETE:
      inputField = (
        <Autocomplete
          setValue={handleChangeInput!}
          options={autocompleteOptions}
          disabled={disabled}
          {...{ id, defaultValue, placeholder }}
          {...props}
        />
      );
      break;

    case InputTypes.AUTOCOMPLETE_TAGS:
      inputField = (
        <AutocompleteTags
          freeSolo={autocompleteFreeSolo}
          selectOnFocus={autocompleteSelectOnFocus}
          clearOnBlur={autocompleteClearOnBlur}
          setValue={handleChangeInput!}
          options={autocompleteOptions || []}
          listPosition={autocompleteOptionsPosition}
          editable={autocompleteEditable}
          value={autocompleteValue}
          autoFocus={autoFocus}
          error={!!errorText}
          {...{ id, defaultValue, placeholder }}
          {...props}
        />
      );
      break;

    case InputTypes.SELECT:
      inputField = (
        <Dropdown
          trigger={
            <div className={cx(styles.selectTrigger, classNameSelectTrigger, { [styles.error]: !!errorText })}>
              {selectIcon}
              <span className={styles.valueContainer}>
                {withTags ? (
                  <Tag size={TagSize.S} upperCase>
                    {value || defaultValue}
                  </Tag>
                ) : (
                  value || placeholder
                )}
              </span>
              <span className={styles.arrowIcon}>
                <Icon name={IconVariant.DROP_DOWN_ARROW} />
              </span>
            </div>
          }
          dropdownItemClassName={classNameDropdownItem}
          triggerClassName={styles.selectTriggerContainer}
          placement={DropdownPlacement.BOTTOM_LEFT}
          options={dropdownOptions}
          onPrimaryOptionClickAction={handleChangeInput!}
          className={cx(styles.selectStyled, classNameSelectStyled)}
          withTags={withTags}
          useCheckbox={useCheckbox}
          hideOnCLick={hideOnCLick}
          {...props}
        />
      );

      break;

    case InputTypes.MULTI_SELECT:
      inputField = (
        <Dropdown
          trigger={
            <div className={styles.selectTrigger}>
              {selectIcon}
              <span className={styles.valueContainer}>
                {withTags ? (
                  <Tag size={TagSize.S} upperCase>
                    {value || defaultValue}
                  </Tag>
                ) : (
                  value || placeholder
                )}
              </span>
              <span className={styles.arrowIcon}>
                <Icon name={IconVariant.DROP_DOWN_ARROW} />
              </span>
            </div>
          }
          triggerClassName={styles.selectTriggerContainer}
          placement={DropdownPlacement.BOTTOM_LEFT}
          options={dropdownOptions}
          onPrimaryOptionClickAction={handleChangeInput!}
          className={styles.selectStyled}
          withTags={withTags}
          useCheckbox={useCheckbox}
          hideOnCLick={false}
          {...props}
        />
      );

      break;

    case InputTypes.INPUT:
    default:
      inputField = (
        <Input
          inputProps={{
            'aria-autocomplete': 'both',
            'aria-haspopup': 'false',
          }}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          rounded={rounded}
          classNameFocused={classNameFocused}
          onChange={handleChangeInput}
          error={!!errorText}
          value={value || defaultValue || ''}
          disabled={disabled}
          autoFocus={autoFocus}
          {...{ id, placeholder }}
          {...props}
        />
      );

      break;
  }

  return (
    <MuiFormControl className={cx(className, styles.formControl)}>
      {label && (
        <Label
          htmlFor={id}
          {...{ required, errorText, additionalText }}
          className={cx({
            [styles.labelWithIcon]: !!labelTooltipContent,
          })}
        >
          {label}
          {labelTooltipContent && (
            <LabelIcon labelTooltipContent={labelTooltipContent} tooltipContainerClass={labelTooltipContainerClass} />
          )}
        </Label>
      )}
      <Tooltip
        title={<DescriptionTooltip content={tooltipContent} className={tooltipContainerClass} />}
        disabled={!tooltipContent}
        align={TooltipAlignment.LEFT}
      >
        <div className={styles.formControlInput}>{inputField}</div>
      </Tooltip>
      {!disableHelperText && (
        <Text variant={TextSize.XS} className={styles.helperText}>
          {helperText}
        </Text>
      )}
      {indicator && <div>{indicator}</div>}
    </MuiFormControl>
  );
};

export * from './Autocomplete';
export * from './AutocompleteTags';
