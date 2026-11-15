import { TaskProvider } from './context/TaskContext';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { Toast } from './components/Toast';

export function App() {
  return (
    <TaskProvider>
      <div className="app-container">
        <Header />
        <TaskForm />
        <TaskStats />
        <TaskFilters />
        <TaskList />
      </div>
      <Toast />
    </TaskProvider>
  );
}

export default App;