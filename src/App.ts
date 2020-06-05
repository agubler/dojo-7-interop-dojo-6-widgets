import { v, w, create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import theme from '@dojo/framework/core/middleware/theme';
import TextArea from '@dojo/widgets/text-area';
import TextInput from '@dojo/widgets/text-input';
import ToolBar from '@dojo/widgets/toolbar';
import Button from '@dojo/widgets/button';
import Grid from '@dojo/widgets/grid';
import Snackbar from '@dojo/widgets/snackbar';
import Checkbox from '@dojo/widgets/checkbox';
import TitlePane from '@dojo/widgets/title-pane';
import Card from '@dojo/widgets/card';
import Listbox from '@dojo/widgets/listbox';
import { createFetcher } from '@dojo/widgets/grid/utils';
import dojo from '@dojo/themes/dojo';

const factory = create({ icache, theme });

const columnConfig = [
	{
		id: 'id',
		title: 'ID'
	},
	{
		id: 'firstName',
		title: 'First Name'
	},
	{
		id: 'lastName',
		title: 'Last Name'
	}
];

const fetcher = createFetcher([
	{ id: 1, firstName: 'Bob', lastName: 'Hope' },
	{ id: 2, firstName: 'Bobby', lastName: 'Hope' },
	{ id: 3, firstName: 'Robert', lastName: 'Hope' },
	{ id: 4, firstName: 'Rob', lastName: 'Hope' },
	{ id: 5, firstName: 'Robby', lastName: 'Hope' }
]);

interface CustomOption {
	disabled?: boolean;
	label?: string;
	selected?: boolean;
	value: string;
}

export default factory(function App({ middleware: { icache, theme } }) {
	const textAreaValue = icache.getOrSet('text-area', '');
	const textInputValue = icache.getOrSet('text-input', '');
	const listboxIndex = icache.getOrSet('listbox-index', 0);
	const checkboxChecked = icache.getOrSet('checkbox-checked', false);
	const listboxOptions = icache.getOrSet('listbox-options', [
		{
			disabled: false,
			label: 'Option 1',
			selected: false,
			value: 'option 1'
		},
		{
			disabled: true,
			label: 'Option 2',
			selected: false,
			value: 'option 2'
		},
		{
			disabled: false,
			selected: false,
			label: 'Option 3',
			value: 'option 3'
		}
	]);
	const snackbarOpen = icache.getOrSet('snackbar-open', false);
	const titlePaneOpen = icache.getOrSet('titlepane-open', false);
	if (!theme.get()) {
		theme.set(dojo);
	}
	return v('div', [
		w(ToolBar, { heading: 'Hello from the Dojo Toolbar', collapseWidth: 150 }, [
			v('div', { classes: ['link'] }, ['one']),
			v('div', { classes: ['link'] }, ['two']),
			v('div', { classes: ['link'] }, ['three'])
		]),
		w(Button, {}, ['button']),
		w(Checkbox, {
			checked: checkboxChecked,
			label: 'Dojo Checkbox',
			name: 'checkbox',
			onChange: (value: string, checked: boolean) => {
				icache.set('checkbox-checked', checked);
			}
		}),
		w(TextArea, {
			columns: 40,
			rows: 3,
			placeholder: 'I am a placeholder',
			label: 'Text Area Label',
			value: textAreaValue,
			onInput: (value: string) => {
				icache.set('text-area', value);
			}
		}),
		w(TextInput, {
			type: 'number',
			label: 'Text Input Label',
			disabled: false,
			readOnly: false,
			value: textInputValue,
			onChange: (v) => {
				icache.set('text-input', v);
			}
		}),
		w(Card, {}, [v('div', ['Card Header'])]),
		w(Grid, { fetcher, columnConfig, height: 200 }),
		w(
			Button,
			{
				onClick: () => {
					const currentOpen = icache.getOrSet('snackbar-open', false);
					!currentOpen &&
						icache.set('snackbar-open', () => {
							setTimeout(() => {
								icache.set('snackbar-open', false);
							}, 400);
							return true;
						});
				}
			},
			['Open Snackbar']
		),
		w(Snackbar, {
			open: snackbarOpen,
			leading: false,
			type: 'error',
			messageRenderer: () => 'Hello from snackbar'
		}),
		w(
			TitlePane,
			{
				title: 'Titlepane Title',
				open: titlePaneOpen,
				onRequestOpen: () => {
					icache.set('titlepane-open', true);
				},
				onRequestClose: () => {
					icache.set('titlepane-open', false);
				}
			},
			['I am an open title pane']
		),
		w(
			Listbox,
			{
				activeIndex: listboxIndex,
				optionData: listboxOptions,
				multiselect: false,
				getOptionLabel: (option: CustomOption) => option.label,
				getOptionDisabled: (option: CustomOption) => !!option.disabled,
				getOptionSelected: (option: CustomOption) => !!option.selected,
				onActiveIndexChange: (index: number) => {
					icache.set('listbox-index', index);
				},
				onOptionSelect: (option: any, index: number) => {
					const currentOptions = icache.get<any[]>('listbox-options') || [];
					currentOptions[index].selected = !currentOptions[index].selected;
					icache.set('listbox-options', [...currentOptions]);
				}
			},
			[]
		)
	]);
});
