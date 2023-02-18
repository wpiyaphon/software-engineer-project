// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';

export default function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  )
}
