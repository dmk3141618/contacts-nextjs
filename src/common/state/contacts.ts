import {createSlice, createEntityAdapter, createSelector} from '@reduxjs/toolkit';
import {IContact} from '~/typings/db';
import {RootState} from '~/common/store';

export const contactsAdapter = createEntityAdapter<IContact>();
const initialState = contactsAdapter.getInitialState();

export const {
  selectById: selectContactById,
  selectIds: selectContactIds,
  selectEntities: selectContactEntities,
  selectAll: selectAllContacts,
  selectTotal: selectTotalContacts,
} = contactsAdapter.getSelectors((state: RootState) => state.contacts);

export const selectFavoriteContacts = createSelector([selectAllContacts], items =>
  items.filter(item => item.isFavorite),
);

export const selectAllOrFavoriteContacts = createSelector(
  [selectAllContacts, (state: RootState, isFavoritesOnly: boolean) => isFavoritesOnly],
  (items, isFavoritesOnly) => {
    if (isFavoritesOnly) {
      return items.filter(item => item.isFavorite);
    } else {
      return items;
    }
  },
);

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addOneContact: contactsAdapter.addOne,
    addManyContacts: contactsAdapter.addMany,
    setAllContacts: contactsAdapter.setAll,
    removeOneContact: contactsAdapter.removeOne,
    removeManyContacts: contactsAdapter.removeMany,
    updateOneContact: contactsAdapter.upsertOne,
    updateManyContacts: contactsAdapter.updateMany,
    upsertOneContact: contactsAdapter.upsertOne,
    upsertManyContacts: contactsAdapter.upsertMany,
  },
});

export const {
  addOneContact,
  addManyContacts,
  setAllContacts,
  removeOneContact,
  removeManyContacts,
  updateOneContact,
  updateManyContacts,
  upsertOneContact,
  upsertManyContacts,
} = contactsSlice.actions;

export default contactsSlice.reducer;
