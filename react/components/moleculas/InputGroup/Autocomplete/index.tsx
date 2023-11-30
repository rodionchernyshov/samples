import React, { useState } from 'react';
import cx from 'classnames';
import { UserTeamRole } from '@writerai/common-utils';
import { Icon, IconVariant, RoleLabel, Tooltip, useMuiAutocomplete } from '@writerai/ui-atoms';

import styles from './styles.module.css';

const ToolTipText = {
  self: 'You cannot remove yourself from a team',
};

export enum AutocompleteListPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export interface IAutocompleteValues {
  name: string;
  subText?: string;
  id?: number;
  updateDisabled?: boolean;
  isCurrentUser?: boolean;
  label?: string;
  labelColor?: string;
}

export interface IAutocomplete {
  className?: string;
  style?: React.CSSProperties;
  options: IAutocompleteValues[];
  setValue: (e: (string | IAutocompleteValues)[]) => void;
  onInputChange?: (e: string) => void;
  id?: string;
  defaultValue?: IAutocompleteValues[];
  freeSolo?: boolean;
  placeholder?: string;
  prefilledTagsTooltip?: string;
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Tag = ({ prefilledTagsTooltip, isCurrentUser, label, isUpdateDisabled, onDelete = () => {}, ...props }: any) => {
  const _tooltipText = !isCurrentUser ? prefilledTagsTooltip : ToolTipText.self;
  const _tooltipTag = !isCurrentUser ? <RoleLabel role={UserTeamRole.ORG_ADMIN} /> : null;

  return (
    <div {...props} className={cx(styles.tag, { [styles.adminTag]: isUpdateDisabled && !isCurrentUser })}>
      <span>{label}</span>
      {!isUpdateDisabled && (
        <span className={styles.closeIcon} onClick={onDelete}>
          <Icon name={IconVariant.CLOSE} />
        </span>
      )}
      {isUpdateDisabled && (
        <Tooltip title={_tooltipText} tag={_tooltipTag} placement="top" tooltipWidth={150}>
          <span>
            <Icon name={IconVariant.INFO_OUTLINED} />
          </span>
        </Tooltip>
      )}
    </div>
  );
};

export const Autocomplete: React.FC<IAutocomplete> = ({
  options,
  setValue,
  onInputChange,
  defaultValue,
  id,
  className,
  placeholder,
  style,
  prefilledTagsTooltip,
  disabled = false,
  ...props
}) => {
  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    value,
    groupedOptions,
    focused,
    setAnchorEl,
  } = useMuiAutocomplete<IAutocompleteValues, true, false, false>({
    id,
    multiple: true,
    options,
    defaultValue,
    freeSolo: false,
    autoHighlight: true,
    onChange: (event, newValue: IAutocompleteValues[]) => setValue(newValue),
    isOptionEqualToValue: (option: IAutocompleteValues, value: IAutocompleteValues) => option.id === value.id,
    filterSelectedOptions: true,
    getOptionLabel: (option: IAutocompleteValues) => {
      const { name, subText } = option;

      return subText && name ? `${subText} ${name}` : name || '';
    },
    onInputChange: (event: object, value: string) => {
      setInputValue(value);
      onInputChange?.(value);
    },
  });

  const [inputValue, setInputValue] = useState('');

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Backspace' && inputValue === '' && value?.length > 0 && value[value.length - 1].updateDisabled) {
      /* This checks for backspace event and avoids deleting when `updateDisabled` flag is true for the last entry in the list */
      e.stopPropagation();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div {...getRootProps()}>
        <div
          style={style}
          className={cx(className, styles.inputWrapper, {
            [styles.focused]: focused,
            [styles.emptyText]: value.length === 0 && !inputValue && !focused,
            [styles.disabled]: disabled,
          })}
          {...props}
          ref={setAnchorEl}
        >
          {value.map((option, index: number) => (
            <Tag
              prefilledTagsTooltip={prefilledTagsTooltip}
              isCurrentUser={option.isCurrentUser}
              isUpdateDisabled={option.updateDisabled}
              label={typeof option === 'string' ? option : option.name || option.subText}
              {...getTagProps({ index })}
            />
          ))}
          <input
            {...getInputProps()}
            placeholder={value.length === 0 ? placeholder : ''}
            onKeyDown={onKeyDown}
            disabled={disabled}
          />
        </div>
      </div>
      {groupedOptions.length > 0 ? (
        <ul className={styles.list} {...getListboxProps()}>
          {(groupedOptions as IAutocompleteValues[]).map((option, index) => (
            <li {...getOptionProps({ option, index })}>
              <span>{option.name}</span>
              <small>{option.subText}</small>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
