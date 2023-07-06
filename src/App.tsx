import './App.css';
import { HomePage } from './layouts/HomePage/HomePage';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { Redirect, Route, Switch, useHistory } from 'react-router';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { oktaConfig } from './lib/oktaConfig';
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';
import { MessagesPage } from './layouts/MessagesPage/MessagesPage';
import { AdminPage } from './layouts/AdminPage/AdminPage';
import { PaymentPage } from './layouts/PaymentPage/PaymentPage';

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {
  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  const customAuthHandler = () => {
    history.push("/login");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler} >
        <Navbar />
        <div className="flex-grow-1">
          <Switch>
            <Route path="/" exact>
              <Redirect to="/home" />
            </Route>
            <Route path="/home">
              <HomePage />
            </Route>
            <Route path="/search" render={() => <SearchBooksPage />}>
            </Route>
            <Route path="/checkout/:bookId" component={BookCheckoutPage}>
            </Route>
            <Route path="/reviews/:bookId">
              <ReviewListPage />
            </Route>
            <Route path="/login">
              <LoginWidget config={oktaConfig} />  
            </Route>
            <Route path="/login/callback">
              <LoginCallback />
            </Route>
            <SecureRoute path="/shelf">
              <ShelfPage />
            </SecureRoute>
            <SecureRoute path="/messages">
              <MessagesPage />
            </SecureRoute>
            <SecureRoute path="/admin">
              <AdminPage />
            </SecureRoute>
            <SecureRoute path="/payment">
              <PaymentPage />
            </SecureRoute>
          </Switch>
        </div>
        <Footer />
      </Security>
    </div>
  );
}
