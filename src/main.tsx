import renderer, { w } from '@dojo/framework/core/vdom';
import '@dojo/themes/dojo/index.css';

import App from './App';

const r = renderer(() => w(App, {}));
r.mount();
