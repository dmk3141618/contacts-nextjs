import React, {useState, useEffect, PropsWithChildren} from 'react';
import styled, {keyframes, css} from 'styled-components';
import Button from '~/common/component/Button';

const fadeIn = keyframes`
  from {
    opacity: 0
  }
  to {
    opacity: 1
  }
`;
const fadeOut = keyframes`
  from {
    opacity: 1
  }
  to {
    opacity: 0
  }
`;
const slideUp = keyframes`
  from {
    transform: translateY(200px);
  }
  to {
    transform: translateY(0px);
  }
`;
const slideDown = keyframes`
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(200px);
  }
`;

const DarkBackground = styled.div<{disappear: boolean}>`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);

  animation-duration: 0.25s;
  animation-timing-function: ease-out;
  animation-name: ${fadeIn};
  animation-fill-mode: forwards;

  ${props =>
    props.disappear &&
    css`
      animation-name: ${fadeOut};
    `}
`;

const DialogBlock = styled.div<{disappear: boolean}>`
  width: 98%;
  min-width: 420px;
  height: 98%;
  padding: 1.5rem;
  background: white;
  border-radius: 2px;
  h3 {
    margin: 0;
    font-size: 2rem;
  }
  .content {
    margin-top: 1rem;
    font-size: 1.5rem;
    color: ${({theme}) => theme.color.grayDeep};
  }

  animation-duration: 0.25s;
  animation-timing-function: ease-out;
  animation-name: ${slideUp};
  animation-fill-mode: forwards;

  ${props =>
    props.disappear &&
    css`
      animation-name: ${slideDown};
    `}
`;

const ButtonGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-start;
`;

const DialogButton = styled(Button)`
  font-size: 1.5rem;
  & + & {
    margin-left: 0.5rem;
  }
`;

interface DialogProps {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  visible?: boolean;
}
type Props = PropsWithChildren<DialogProps>;
function Dialog({
  children,
  title,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {},
  visible = false,
}: Props) {
  const [animate, setAnimate] = useState(false);
  const [localVisible, setLocalVisible] = useState(visible);

  useEffect(() => {
    // visible 값이 true -> false 가 되는 것을 감지
    if (localVisible && !visible) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 250);
    }
    setLocalVisible(visible);
  }, [localVisible, visible]);

  if (!animate && !localVisible) return null;
  return (
    <DarkBackground disappear={!visible}>
      <DialogBlock disappear={!visible}>
        <h3>{title}</h3>
        <div className="content">{children}</div>
        <ButtonGroup>
          <DialogButton color="grayBase" onClick={onCancel} size={'large'}>
            {cancelText}
          </DialogButton>
          <DialogButton color="deepPink" onClick={onConfirm} size={'large'}>
            {confirmText}
          </DialogButton>
        </ButtonGroup>
      </DialogBlock>
    </DarkBackground>
  );
}

export default Dialog;
