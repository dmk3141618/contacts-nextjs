import {
  combineReducers,
  configureStore,
  AnyAction,
  EnhancedStore,
  Reducer,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import logger from 'redux-logger';
import contactsReducer from '~/common/state/contacts';
import {createWrapper, HYDRATE, MakeStore} from 'next-redux-wrapper';
import {PersistPartial} from 'redux-persist/lib/persistReducer';
import {Persistor} from 'redux-persist/es/types';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

const makeHydrateReducer = (reducer: Reducer) => (state: any, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      return {
        ...state, // use previous state
        ...action.payload, // apply delta from hydration
      };
    default: {
      return reducer(state, action);
    }
  }
};

const makeConfiguredStore = (reducer: Reducer) =>
  configureStore({
    reducer: reducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(logger),
    devTools: process.env.NODE_ENV !== 'production',
  });

export type StoreType = EnhancedStore & {__persistor?: Persistor};
const setupStore = (context: any): StoreType => {
  // do not use redux-persis
  // const combinedReducer = combineReducers({
  //   contacts: contactsReducer,
  // });
  // const hydrateReducer = makeHydrateReducer(combinedReducer);
  // const store = makeConfiguredStore(hydrateReducer);
  // return store;

  // use redux-persist
  const isServer = typeof window === 'undefined';
  if (isServer) {
    const combinedReducer = combineReducers({
      contacts: contactsReducer,
    });
    const hydrateReducer = makeHydrateReducer(combinedReducer);
    const store = makeConfiguredStore(hydrateReducer);
    return store;
  } else {
    // we need it only on client side
    const {persistStore, persistReducer} = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;
    const contactsPersistConfig = {
      key: 'contacts',
      storage,
    };
    const persistedReducer = combineReducers({
      contacts: persistReducer(contactsPersistConfig, contactsReducer),
    });
    const hydrateReducer = makeHydrateReducer(persistedReducer);
    const store = makeConfiguredStore(hydrateReducer) as StoreType;
    store.__persistor = persistStore(store); // Nasty hack
    return store;
  }
};
const makeStore: MakeStore<any> = (context: any) => setupStore(context);
export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: process.env.NODE_ENV !== 'production',
});

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;

// export const someAction = (whatever: any): AppThunk => async dispatch => {
//   dispatch(
//     subjectSlice.actions.setWhatever({ whatever }),
//   );
// };
// export type RootState = typeof window === 'undefined' ? CombinedState<{contacts: EntityState<IContact>}> : CombinedState<{contacts: EntityState<IContact> & PersistPartial}>

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
