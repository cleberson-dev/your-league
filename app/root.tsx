import {
  Outlet,
  Meta,
  Links,
  ScrollRestoration,
  Scripts,
  LiveReload,
  useCatch,
  useLocation,
} from "@remix-run/react";
import {
  LinksFunction,
  MetaFunction,
} from "@remix-run/react/dist/routeModules";
import * as React from "react";

import globalStylesUrl from "~/styles/global.css";
import { ModalContextProvider } from "./contexts/Modal.context";
import { ThemeContextProvider, useTheme } from "./contexts/Theme.context";
import Menu from "./components/menu";
import ToastContextProvider from "./contexts/Toast.context";
import cls from "classnames";
import Header from "./components/header";

const MENU_BLACKLIST = ["/login", "/register", "/"];

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: globalStylesUrl },
    { rel: "manifest", href: "/manifest.json" },
  ];
};

// CHANGE HERE
// And in /public/manifest.json too
export const meta: MetaFunction = () => {
  return {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "Your League",
    "apple-mobile-web-app-title": "Your League",
    "theme-color": "#000000",
    "msapplication-navbutton-color": "#000000",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-starturl": "/",
  };
};

export default function App() {
  return (
    <ThemeContextProvider>
      <Document>
        <ToastContextProvider>
          <ModalContextProvider>
            <Layout>
              <Outlet />
            </Layout>
          </ModalContextProvider>
        </ToastContextProvider>
      </Document>
    </ThemeContextProvider>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const { theme } = useTheme();

  return (
    <html lang="en" className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,shrink-to-fit=no"
        />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="bg-light dark:bg-darker dark:text-white">
        {children}
        <RouteChangeAnnouncement />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children }: React.PropsWithChildren) {
  const { pathname } = useLocation();

  const shouldShowMenu = !MENU_BLACKLIST.includes(pathname);

  return (
    <div
      className={cls("remix-app", {
        "p-2 pt-16 lg:p-20 lg:pb-12 lg:pr-8": shouldShowMenu,
      })}
    >
      {shouldShowMenu && (
        <>
          <Header />
          <Menu />
        </>
      )}
      {children}
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}

/**
 * Provides an alert for screen reader users when the route changes.
 */
const RouteChangeAnnouncement = React.memo(() => {
  const [hydrated, setHydrated] = React.useState(false);
  const [innerHtml, setInnerHtml] = React.useState("");
  const location = useLocation();

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  const firstRenderRef = React.useRef(true);
  React.useEffect(() => {
    // Skip the first render because we don't want an announcement on the
    // initial page load.
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    const pageTitle = location.pathname === "/" ? "Home page" : document.title;
    setInnerHtml(`Navigated to ${pageTitle}`);
  }, [location.pathname]);

  // Render nothing on the server. The live region provides no value unless
  // scripts are loaded and the browser takes over normal routing.
  if (!hydrated) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      aria-atomic
      id="route-change-region"
      style={{
        border: "0",
        clipPath: "inset(100%)",
        clip: "rect(0 0 0 0)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: "0",
        position: "absolute",
        width: "1px",
        whiteSpace: "nowrap",
        wordWrap: "normal",
      }}
    >
      {innerHtml}
    </div>
  );
});

RouteChangeAnnouncement.displayName = "RouteChangeAnnouncement";
