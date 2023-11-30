import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { Icon, IconVariant, Text, TextColor, TextSize, Tooltip } from '@writerai/ui-atoms';

import styles from './styles.module.css';
import ThreeDotsLoader from '../ThreeDotsLoader';
import { truncate } from 'lodash/fp';

interface IFileBoxProps {
  status?: string;
  entityName?: string;
  entityMetaInfo?: string;
  entityType: string;
  isLoading: boolean;
  onDelete?: () => void;
  onClick?: () => void;
  className?: string;
  charLimit?: number;
  animate?: boolean;
}

const getEntityIcon = type => {
  switch (type) {
    case 'pdf':
    case 'docx':
    case 'txt':
      return <Icon className={styles.icon} name={IconVariant.DOCUMENT_EXTENDED} height={32} width={32} />;
    case 'ppt':
    case 'csv':
    case 'xlsx':
      return <Icon className={styles.icon} name={IconVariant.SPREADSHEET_EXTENDED} height={32} width={32} />;
    case 'srt':
    case 'pastedText':
      return <Icon className={styles.icon} name={IconVariant.DRAFT_EXTENDED} height={32} width={32} />;
    case 'url':
      return <Icon className={styles.icon} name={IconVariant.GLOBE_MONOLINE} height={32} width={32} />;
    default:
      return <Icon className={styles.icon} name={IconVariant.DOCUMENT_EXTENDED} height={32} width={32} />;
  }
};

export const FileBox: React.FC<IFileBoxProps> = ({
  entityName,
  entityMetaInfo,
  entityType,
  isLoading,
  className,
  animate,
  status,
  onDelete,
  onClick,
  charLimit,
}) => {
  const [showFile, setFileVisibility] = useState(false);
  const elRef = useRef(null);

  useEffect(() => {
    setFileVisibility(true);
  }, []);

  const isAnalyzing = status === 'queued' || status === 'processing';
  const withError = status === 'error';

  const isAnalyzingTooltipTitle =
    'Hang tight! Your file is being anlayzed. Once it’s done, Ask Writer will start including it as context in responses.';
  const withErrorTooltipTitle = 'Whoops, looks like we couldn’t analyze this file. Remove it and try a different file.';

  let tooltipTitle = '';

  if (isAnalyzing) {
    tooltipTitle = isAnalyzingTooltipTitle;
  } else if (withError) {
    tooltipTitle = withErrorTooltipTitle;
  } else if (entityName) {
    if (charLimit && entityName.length > charLimit) {
      tooltipTitle = entityName;
    }
  }

  return (
    <CSSTransition
      in={showFile}
      nodeRef={elRef}
      timeout={300}
      classNames={
        animate && {
          enter: styles.enter,
          enterActive: styles.enterActive,
          exit: styles.exit,
          exitDone: styles.exitDone,
        }
      }
    >
      <Tooltip
        title={<div className={styles.tooltipWrapper}>{tooltipTitle}</div>}
        disabled={!tooltipTitle || !showFile}
        placement={!isAnalyzing && !withError ? 'top' : 'right'}
      >
        <div
          className={cx(styles.container, className, {
            [styles.analyzingContainer]: isAnalyzing,
            [styles.errorContainer]: withError,
          })}
          ref={elRef}
          onClick={onClick}
        >
          {isAnalyzing && (
            <Text className={styles.status} color={TextColor.BLACK} variant={TextSize.XXS} caps>
              Analyzing
              <ThreeDotsLoader className={styles.loader} />
            </Text>
          )}
          {withError && (
            <Text className={cx(styles.status, styles.statusError)} color={TextColor.BLACK} variant={TextSize.XXS} caps>
              File error
            </Text>
          )}
          {getEntityIcon(entityType)}
          <div className={styles.textContainer}>
            {isLoading ? (
              <>
                <div className={cx(styles.skeleton, styles.nameSkeleton)} />
                <div className={cx(styles.skeleton, styles.metaInfoSkeleton)} />
              </>
            ) : (
              <>
                <Text className={styles.fileName} variant={TextSize.M} color={TextColor.BLACK}>
                  {charLimit && entityName ? truncate({ length: charLimit }, entityName) : entityName}
                </Text>
                {!withError && !isAnalyzing && (
                  <Text variant={TextSize.XS} color={TextColor.GREY2}>
                    {entityMetaInfo}
                  </Text>
                )}
              </>
            )}
          </div>
          {onDelete && (
            <div
              className={styles.deleteButton}
              onClick={() => {
                setFileVisibility(false);
                setTimeout(() => onDelete(), 300);
              }}
            >
              <Icon name={IconVariant.CLOSE} width={18} height={18} />
            </div>
          )}
        </div>
      </Tooltip>
    </CSSTransition>
  );
};

export default FileBox;
