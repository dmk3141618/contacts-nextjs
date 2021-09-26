import Head from 'next/head';
import {ReactElement, useCallback, useEffect, useMemo, useReducer, useRef, useState} from 'react';
import AppLayout from '~/common/component/AppLayout';
import Button from '~/common/component/Button';
import Icon from '~/common/component/Icon';
import Dialog from '~/common/component/Dialog';
import DialogFull from '~/common/component/DialogFull';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import styled from 'styled-components';
import {v1 as uuidv1} from 'uuid';
import {IContact} from '~/typings/db';
import useLocalStorage from '~/common/hook/useLocalStorage';

const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  min-height: 40rem;
  min-width: 420px;
`;

const AppBlock = styled.div`
  margin-top: 4rem;
  border: 1px solid black;
  padding: 1rem;
  min-width: 400px;
`;

const Title = styled.div`
  height: 5rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  .title {
    margin-left: 2rem;
    font-size: 2rem;
    font-weight: 500;
    color: ${props => props.theme.color.deepBlue};
  }
`;

const Controls = styled.div`
  height: 5rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .controlInfosWrap {
    height: 100%;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .controlTotal {
      margin-left: 1.5rem;
      font-size: 1.3rem;
      label {
        color: ${props => props.theme.color.grayBase};
      }
      span {
        margin-left: 5px;
      }
    }

    .controlSortBy {
      margin-left: 1.5rem;
      font-size: 1.3rem;
      label {
        color: ${props => props.theme.color.grayBase};
      }
      span {
        margin-left: 5px;
      }
    }

    .controlFavorites {
      margin-left: 1.5rem;
      font-size: 1.3rem;
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      .iconWrap {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        .icon {
          width: 1.8rem;
          height: 1.8rem;
        }
      }
      .text {
        margin-left: 5px;
        color: ${props => props.theme.color.grayLight};
      }
      &.active {
        .text {
          color: ${props => props.theme.color.grayBlack};
        }
      }
      &:hover {
        .text {
          color: ${props => props.theme.color.grayBase};
        }
      }
    }
  }

  .controlBtnsWrap {
    height: 100%;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    & > * {
      margin-right: 1rem;
    }
  }
`;

const ContactListWrap = styled.div`
  width: 100%;
  margin-top: 2rem;
`;
const ContactList = styled.ul`
  width: 100%;
`;
const ContactListItem = styled.li`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  .listItemContent {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 10px;
    .listItemContentFieldsWrap {
      height: 100%;
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 5px;
      & > * + * {
        margin-left: 1.2rem;
      }

      ${props => props.theme.media.desktop} {
      }
      ${props => props.theme.media.tablet} {
      }
      ${props => props.theme.media.phone} {
        flex: 1 0 100%;
      }
      .listItemContentField {
        font-size: 1.5rem;
        > label {
          color: ${props => props.theme.color.grayBase};
        }
        > span {
          margin-left: 5px;
        }
      }
    }
    .listItemBtnsWrap {
      height: 100%;
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      padding: 5px;
      & > * + * {
        margin-left: 0.5rem;
      }
      .favorite {
        cursor: pointer;
      }
    }
  }
`;
const ContactListEmpty = styled.div`
  width: 100%;
  padding: 2rem;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .emptyTitle {
    font-size: 2.5rem;
    color: ${props => props.theme.color.grayDark};
  }
  .emptyText {
    font-size: 2rem;
    margin-top: 2rem;
    color: ${props => props.theme.color.grayLight};
  }
`;

const ContactForm = styled.div`
  padding: 1rem;
  .field {
    padding: 1rem;
    label {
      display: block;
      color: ${props => props.theme.color.grayBase};
    }
    input {
      display: block;
      padding: 7px 10px;
      width: 100%;
      max-width: 700px;
      margin-top: 5px;
    }
    .error {
      color: ${props => props.theme.color.error};
      margin-top: 5px;
    }
  }
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

interface ContactFormValuesType {
  name: string;
  email: string;
  phone?: string;
}
type Action =
  | {type: 'INIT'; contacts: IContact[]}
  | {type: 'CREATE'; contact: IContact}
  | {type: 'UPDATE'; contact: IContact}
  | {type: 'DELETE'; id: string}
  | {type: 'TOGGLE_FAVORITE'; id: string};
function contactsReducer(state: IContact[], action: Action): IContact[] {
  switch (action.type) {
    case 'INIT':
      return [...action.contacts];
    case 'CREATE':
      return state.concat(action.contact);
    case 'UPDATE':
      const foundIndex = state.findIndex(contact => contact.id === action.contact.id);
      if (foundIndex === -1) {
        return state;
      }
      return state
        .slice(0, foundIndex)
        .concat({
          id: state[foundIndex].id,
          name: action.contact.name,
          email: action.contact.email,
          phone: action.contact.phone,
          isFavorite: state[foundIndex].isFavorite,
        })
        .concat(state.slice(foundIndex + 1));
    case 'DELETE':
      return state.filter(contact => contact.id !== action.id);
    case 'TOGGLE_FAVORITE':
      return state.map(contact =>
        contact.id === action.id ? {...contact, isFavorite: !contact.isFavorite} : contact,
      );
    default:
      throw new Error('Unhandled action');
  }
}
function Home() {
  const [contactsState, dispatch] = useReducer(contactsReducer, []);
  const [storedValue, setValue] = useLocalStorage('contactsforjustcomponent', contactsState);

  const [contactFormTitle, setContactFormTitle] = useState<string>('Add a new contact');

  // filter
  const [isShowOnlyFavorites, setIsShowOnlyFavorites] = useState<boolean>(false);
  const onShowOnlyFavoritesToggle = useCallback(() => {
    setIsShowOnlyFavorites(prev => !prev);
  }, []);

  useEffect(() => {
    dispatch({
      type: 'INIT',
      contacts: storedValue ?? [],
    });
  }, []);

  useEffect(() => {
    setValue(contactsState);
  }, [contactsState, setValue]);

  const contacts = useMemo(() => {
    if (isShowOnlyFavorites) {
      return contactsState.filter(contact => contact.isFavorite);
    } else {
      return contactsState;
    }
  }, [contactsState, isShowOnlyFavorites]);

  // delete
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState<boolean>(false);
  const onClickDeleteConfirm = useCallback(
    (contact: IContact) => () => {
      setSelectedContact(contact);
      setShowDeleteConfirmDialog(true);
    },
    [],
  );
  const onConfirmDeleteConfirm = useCallback(() => {
    if (selectedContact) {
      dispatch({type: 'DELETE', id: selectedContact.id});
    }
    setSelectedContact(null);
    setShowDeleteConfirmDialog(false);
  }, [dispatch, selectedContact]);
  const onCancelDeleteConfirm = useCallback(() => {
    setSelectedContact(null);
    setShowDeleteConfirmDialog(false);
  }, []);

  // create
  const contactFormValidation = yup.object().shape({
    name: yup.string().required('Required'),
    email: yup.string().email('Invalid email address').required('Required'),
    phone: yup.lazy(value =>
      value === ''
        ? yup.string()
        : yup
            .number()
            .typeError('Numbers only')
            .test('len', 'At least 10 digit', val => !val || val.toString().length >= 10)
            .test('len', 'Max 20 digit', val => !val || val.toString().length <= 20),
    ),
  });
  const {
    register,
    formState: {errors},
    handleSubmit,
    reset: resetContactForm,
    setValue: setValueContactForm,
  } = useForm<ContactFormValuesType>({
    resolver: yupResolver(contactFormValidation),
    mode: 'onBlur',
  });
  const [showContactFormDialog, setShowContactFormDialog] = useState<boolean>(false);
  const onClickAddContactForm = useCallback(() => {
    setContactFormTitle('Add a new contact');
    setShowContactFormDialog(true);
  }, []);
  const onCancelContactForm = useCallback(() => {
    setShowContactFormDialog(false);
    setSelectedContact(null);
    resetContactForm();
  }, [resetContactForm]);
  const onSubmitContactForm = handleSubmit((data: ContactFormValuesType) => {
    if (selectedContact) {
      const contact: IContact = {
        id: selectedContact.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        isFavorite: selectedContact.isFavorite,
      };
      dispatch({type: 'UPDATE', contact});
    } else {
      const contact: IContact = {
        id: uuidv1(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        isFavorite: false,
      };
      dispatch({type: 'CREATE', contact});
    }
    setShowContactFormDialog(false);
    setSelectedContact(null);
    resetContactForm();
  });

  // edit
  const onClickEditContactForm = useCallback(
    (contact: IContact) => () => {
      setContactFormTitle('Edit a contact');
      setSelectedContact(contact);
      setValueContactForm('name', contact.name);
      setValueContactForm('email', contact.email);
      setValueContactForm('phone', contact.phone);
      setShowContactFormDialog(true);
    },
    [setValueContactForm],
  );

  // favorite
  const onContactFavoriteToggle = useCallback(
    (contact: IContact) => () => {
      dispatch({type: 'TOGGLE_FAVORITE', id: contact.id});
    },
    [dispatch],
  );

  return (
    <PageWrap>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBlock>
        <Title>
          <div className="title">Contacts</div>
        </Title>
        <Controls>
          <div className="controlInfosWrap">
            <div className="controlTotal">
              <label>Total</label>
              <span>{contacts.length}</span>
            </div>
            {/*<div className="controlSortBy">*/}
            {/*  <label>Sort By</label>*/}
            {/*  <span>created</span>*/}
            {/*</div>*/}
            {isShowOnlyFavorites && (
              <div className="controlFavorites active" onClick={onShowOnlyFavoritesToggle}>
                <div className="iconWrap">
                  <Icon className="icon" icon={'heartFill'} />
                </div>
                <div className="text">Show Only Favorites</div>
              </div>
            )}
            {!isShowOnlyFavorites && (
              <div className="controlFavorites" onClick={onShowOnlyFavoritesToggle}>
                <div className="iconWrap">
                  <Icon className="icon" icon={'heartBlank'} />
                </div>
                <div className="text">Show Only Favorites</div>
              </div>
            )}
          </div>
          <div className="controlBtnsWrap">
            <Button size={'medium'} onClick={onClickAddContactForm}>
              Add Contact
            </Button>
          </div>
        </Controls>
        <ContactListWrap>
          {!!contacts.length && (
            <ContactList>
              {contacts.map(item => (
                <ContactListItem key={item.id}>
                  <div className="listItemContent">
                    <div className="listItemContentFieldsWrap">
                      <div className="listItemContentField">
                        <label>name</label>
                        <span>{item.name}</span>
                      </div>
                      <div className="listItemContentField">
                        <label>email</label>
                        <span>{item.email}</span>
                      </div>
                      {!!item?.phone && (
                        <div className="listItemContentField">
                          <label>phone</label>
                          <span>{item.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="listItemBtnsWrap">
                      <Button size={'small'} outline={true} onClick={onClickEditContactForm(item)}>
                        Edit
                      </Button>
                      <Button size={'small'} outline={true} onClick={onClickDeleteConfirm(item)}>
                        Delete
                      </Button>
                      <div className="favorite">
                        {item.isFavorite ? (
                          <Icon icon={'heartFill'} onClick={onContactFavoriteToggle(item)} />
                        ) : (
                          <Icon icon={'heartBlank'} onClick={onContactFavoriteToggle(item)} />
                        )}
                      </div>
                    </div>
                  </div>
                </ContactListItem>
              ))}
            </ContactList>
          )}
          {!contacts.length && (
            <ContactListEmpty>
              <div className="emptyTitle">No Contact</div>
              <div className="emptyText">Will you add a new contact?</div>
            </ContactListEmpty>
          )}
        </ContactListWrap>
      </AppBlock>
      <Dialog
        title="Delete"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={onConfirmDeleteConfirm}
        onCancel={onCancelDeleteConfirm}
        visible={showDeleteConfirmDialog}
      >
        Are you sure to delete?
      </Dialog>
      <DialogFull title={contactFormTitle} visible={showContactFormDialog}>
        <ContactForm>
          <form onSubmit={onSubmitContactForm}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" {...register('name')} autoComplete="off" />
              <div className="error">{errors.name?.message}</div>
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" {...register('email')} autoComplete="off" />
              <div className="error">{errors.email?.message}</div>
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" {...register('phone')} autoComplete="off" />
              <div className="error">{errors.phone?.message}</div>
            </div>
            <ButtonGroup>
              <DialogButton color="grayBase" onClick={onCancelContactForm} size={'large'}>
                Cancel
              </DialogButton>
              <DialogButton color="deepPink" size={'large'} type="submit">
                Confirm
              </DialogButton>
            </ButtonGroup>
          </form>
        </ContactForm>
      </DialogFull>
    </PageWrap>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Home;
