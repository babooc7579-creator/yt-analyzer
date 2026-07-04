import CreatorAppLayout from './components/CreatorAppLayout';
import CreatorAppRoutes from './components/CreatorAppRoutes';
import { useCreatorAppController } from './hooks/useCreatorAppController';

export default function App() {
  const { layoutProps, routesProps } = useCreatorAppController();

  return (
    <CreatorAppLayout {...layoutProps}>
      <CreatorAppRoutes {...routesProps} />
    </CreatorAppLayout>
  );
}
