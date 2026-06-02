import { MainPage } from '@pages'
import { PopupsProvider, QueryProvider } from '@providers'

const App = () => {
  return (
    <QueryProvider>
      <PopupsProvider>
        <MainPage />
      </PopupsProvider>
    </QueryProvider>
  )
}

export default App
