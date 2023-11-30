import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { isEmpty, trim } from 'lodash/fp';

import { createMuiAutocompleteFilterOptions, Icon, IconVariant, useMuiAutocomplete } from '@writerai/ui-atoms';

import { getLogger } from '../../../utils/logger';
import { AutocompleteListPosition, IAutocomplete, IAutocompleteValues } from '../Autocomplete';

import styles from './styles.module.css';

const LOG = getLogger('AutocompleteTags');

export interface TagProps {
  label?: string;
  isUpdateDisabled?: boolean;
  onDelete?: (event: unknown) => void;
}

const Tag = ({ label, isUpdateDisabled, onDelete = () => {}, ...props }: TagProps) => (
  <div {...props} className={cx(styles.tag, isUpdateDisabled && styles.adminTag)}>
    <span>{label}</span>
    {!isUpdateDisabled && (
      <span className={styles.closeTagIcon} onClick={onDelete}>
        <Icon name={IconVariant.CLOSE} />
      </span>
    )}
  </div>
);

export interface IAutocompleteTags extends IAutocomplete {
  /** Set additional css class */
  className?: string;
  /** Set inline css styles */
  style?: React.CSSProperties;
  /** Children passed on as React child */
  children?: React.ReactNode;
  editable?: boolean;
  listPosition?: AutocompleteListPosition;
  value: IAutocompleteValues[];
  selectOnFocus?: boolean;
  clearOnBlur?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

export const AutocompleteTags: React.FC<IAutocompleteTags> = ({
  options,
  setValue,
  onInputChange,
  defaultValue,
  id,
  className,
  freeSolo = false,
  editable = false,
  placeholder,
  style,
  listPosition = AutocompleteListPosition.BOTTOM,
  value,
  selectOnFocus = false,
  clearOnBlur = false,
  autoFocus,
  error,
  ...props
}) => {
  const allOptions = useRef(options);
  const filter = createMuiAutocompleteFilterOptions<IAutocompleteValues>();
  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    setAnchorEl,
  } = useMuiAutocomplete<IAutocompleteValues, true, false, false>({
    id,
    multiple: true,
    options,
    defaultValue,
    value,
    freeSolo: false,
    selectOnFocus,
    clearOnBlur,
    autoHighlight: true,
    openOnFocus: autoFocus,
    onChange: (event: React.SyntheticEvent, newValue: IAutocompleteValues[]) => {
      const inputValue = newValue.map(value => ({
        name: value.name,
        subText: value.subText || '',
      }));

      // The below logic is added to fix crashing issue when `enter` is pressed when no option is selected [WA-884]
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (event?.keyCode === 13 && typeof newValue[newValue.length - 1] === 'string') return null;

      return setValue(inputValue);
    },
    isOptionEqualToValue: (option: IAutocompleteValues, value: IAutocompleteValues) => option.name === value.name,
    filterSelectedOptions: true,
    filterOptions: (_, params) => {
      const uniqueOptionsSet = new Set(allOptions.current.map(option => option.name));

      if (!isEmpty(value)) {
        value.forEach(item => uniqueOptionsSet.add(item.name));
      }

      const uniqueOptions = Array.from(uniqueOptionsSet).map(name => ({
        name,
        subText: '',
      }));

      const filtered = filter(uniqueOptions, params);
      const isTagRepeated = uniqueOptions.some(option => option.name === params.inputValue);

      if (editable && !isEmpty(trim(params.inputValue)) && !isTagRepeated) {
        filtered.push({
          name: `Add "${params.inputValue}"`,
          subText: '',
        });
      }

      LOG.debug('value', value);
      LOG.debug('allOptions.current', allOptions.current);

      return filtered as IAutocompleteValues[];
    },
    getOptionLabel: (option: IAutocompleteValues) => {
      const { name, subText } = option;

      return subText && name ? `${subText} ${name}` : name || '';
    },
    onInputChange: (event: object, value: string) => {
      setInputValue(value);
      onInputChange && onInputChange(value);
    },
  });

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    allOptions.current = options;
  }, [options]);

  return (
    <div style={{ position: 'relative' }}>
      <div {...getRootProps()}>
        <div
          style={style}
          className={cx(className, styles.inputWrapper, {
            [styles.focused]: focused,
            [styles.emptyText]: value.length === 0 && !inputValue && !focused,
            [styles.error]: error,
          })}
          {...props}
          ref={setAnchorEl}
        >
          {value.map((option, index: number) => (
            <Tag
              isUpdateDisabled={option.updateDisabled}
              label={typeof option === 'string' ? option : option.name || option.subText}
              {...getTagProps({ index })}
            />
          ))}
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input
            {...getInputProps()}
            placeholder={value.length === 0 ? placeholder : ''}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
            maxLength={64}
          />
        </div>
      </div>
      {groupedOptions.length > 0 ? (
        <ul
          className={cx(styles.list, {
            [styles.listTop]: listPosition === AutocompleteListPosition.TOP,
          })}
          {...getListboxProps()}
        >
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
