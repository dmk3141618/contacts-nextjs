import React, {ReactElement, useCallback, useState} from 'react';
import styled, {css} from 'styled-components';
import Button from '~/common/component/Button';
import Dialog from '~/common/component/Dialog';
import Icon from '~/common/component/Icon';
import AppLayout from '~/common/component/AppLayout';

const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  min-height: 40rem;
`;

const AppBlock = styled.div`
  width: 512px;
  margin: 0 auto;
  margin-top: 4rem;
  border: 1px solid black;
  padding: 1rem;
`;

enum ButtonGroupWidth {
  Full,
  Half,
}
enum ButtonGroupDirection {
  Column,
  Row,
}
interface ButtonGroupType {
  groupWidth: ButtonGroupWidth;
  groupDirection: ButtonGroupDirection;
}
const ButtonGroup = styled.div<ButtonGroupType>`
  & + & {
    margin-top: 1rem;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-direction: row;
  ${props =>
    props.groupWidth === ButtonGroupWidth.Half
      ? css`
          width: 50%;
        `
      : null}
  ${props =>
    props.groupDirection === ButtonGroupDirection.Column
      ? css`
          flex-direction: column;
          height: 10rem;
        `
      : null}
`;

function PreviewComponents() {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const onClick = useCallback(() => {
    setShowDialog(true);
  }, []);
  const onConfirm = useCallback(() => {
    setShowDialog(false);
  }, []);
  const onCancel = useCallback(() => {
    setShowDialog(false);
  }, []);

  return (
    <PageWrap>
      <AppBlock>
        <ButtonGroup groupWidth={ButtonGroupWidth.Half} groupDirection={ButtonGroupDirection.Row}>
          <Button size="large">BUTTON</Button>
          <Button>BUTTON</Button>
          <Button size="small">BUTTON</Button>
        </ButtonGroup>
        <ButtonGroup groupWidth={ButtonGroupWidth.Half} groupDirection={ButtonGroupDirection.Row}>
          <Button color="deepPink" size="large">
            BUTTON
          </Button>
          <Button color="deepPink">BUTTON</Button>
          <Button color="deepPink" size="small">
            BUTTON
          </Button>
        </ButtonGroup>
        <ButtonGroup groupWidth={ButtonGroupWidth.Half} groupDirection={ButtonGroupDirection.Row}>
          <Button color="grayBase" size="large">
            BUTTON
          </Button>
          <Button color="grayBase">BUTTON</Button>
          <Button color="grayBase" size="small">
            BUTTON
          </Button>
        </ButtonGroup>
        <ButtonGroup groupWidth={ButtonGroupWidth.Half} groupDirection={ButtonGroupDirection.Row}>
          <Button size="large" outline>
            BUTTON
          </Button>
          <Button color="deepPink" outline>
            BUTTON
          </Button>
          <Button color="grayBase" size="small" outline>
            BUTTON
          </Button>
        </ButtonGroup>
        <ButtonGroup
          groupWidth={ButtonGroupWidth.Full}
          groupDirection={ButtonGroupDirection.Column}
        >
          <Button size="large" fullWidth onClick={onClick}>
            OPEN DIALOG
          </Button>
          <Button size="large" color="grayBase" fullWidth>
            BUTTON
          </Button>
          <Button size="large" color="deepPink" fullWidth>
            BUTTON
          </Button>
        </ButtonGroup>
      </AppBlock>
      <AppBlock>
        <Icon icon={'heartFill'} />
        <Icon icon={'heartBlank'} />
      </AppBlock>
      <Dialog
        title="Delete"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={onConfirm}
        onCancel={onCancel}
        visible={showDialog}
      >
        Are you sure to delete?
      </Dialog>
    </PageWrap>
  );
}

PreviewComponents.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default PreviewComponents;
