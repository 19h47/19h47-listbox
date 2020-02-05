# @19h47/list

## Installation

```
yarn add @19h47/list
```

## Usage

```javascript
const $list = document.querySelector('.js-list');

const $box = $list.querySelector('.js-list-box');
const $button = $list.querySelector('.js-list-button');

// Init box.
const box = new List.Box($box);
box.init();

// Init button.
const button = new List.Button($button, box);
button.init();
```

```html
<div class="js-list">
	<h2 id="title">Choose an monster:</h2>
	<button id="button" aria-labelledby="title button" type="button">
		Bat
	</button>
	<ul class="js-list-box hidden" tabindex="-1" role="listbox" aria-labelledby="title">
		<li id="monster-bat" role="option">Bat</li>
		<li id="monster-bear" role="option">Bear</li>
		<li id="monster-behir" role="option">Behir</li>
		<li id="monster-beholder" role="option">Beholder
		</li>
		<li id="monster-boar" role="option">Boar</li>
		<li id="monster-bookworm" role="option">Bookworm</li>
		<li id="monster-brownie" role="option">Brownie</li>
		<li id="monster-bugbear" role="option">Bugbear</li>
		<li id="monster-carrion" role="option">Carrion
			crawler</li>
		<li id="monster-catoblepas" role="option">Catoblepas
		</li>
		<li id="monster-cats-great" role="option">Cats, great
		</li>
		<li id="monster-cave-fisher" role="option">Cave fisher
		</li>
		<li id="monster-centaur-sylvan" role="option">Centaur,
			sylvan</li>
		<li id="monster-centipede" role="option">
			Centipede</li>
		<li id="monster-chimera" role="option">Chimera</li>
		<li id="monster-cockatrice" role="option">Cockatrice
		</li>
		<li id="monster-coualt" role="option">Couatl</li>
		<li id="monster-dragon-turtle" role="option">
			Dragon turtle</li>
		<li id="monster-hydra" role="option">Hydra</li>
		<li id="monster-minotaur" role="option">Minotaur
		</li>
		<li id="monster-ogre" role="option">Ogre</li>
		<li id="monster-vampire" role="option">Vampire</li>
		<li id="monster-wyver" role="option">Wyvern</li>
		<li id="monster-yeti" role="option">Yeti</li>
		<li id="monster-yuan-ti" role="option">Yuan-ti</li>
		<li id="monster-zombie" role="option">Zombie</li>
	</ul>
</div>
```

## Keyboard Support

The list box implements the following keyboard interface.

Key    | Function
------ | -------
Enter  | - If the focus is on the button, expands the listbox and places focus on the currently selected option in the list.<br>- If focus is in the listbox , collapses the listbox and keeps the currently selected option as the button label.
Escape |	If the listbox is displayed, collapses the listbox and moves focus to the button.
Down Arrow | - Moves focus to and selects the next option.<br>- If the listbox is collapsed, also expands the list.
Up Arrow | - Moves focus to and selects the previous option.<br>- If the listbox is collapsed, also expands the list.
Home | If the listbox is displayed, moves focus to and selects the first option.
Printable Characters | 	- Type a character: focus moves to the next item with a name that starts with the typed character.<br>- Type multiple characters in rapid succession: focus moves to the next item with a name that starts with the string of characters typed.

## Event

```
Button.change
```

## Options

```
delay
```

## Example

An example is located right [here](https://19h47.github.io/19h47-list/), see [sources](/docs/index.html).

## Acknowledgments

- [Example of Tabs with Manual Activation](https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-collapsible.html)
- [Keycode](https://keycode.info/) by [Wes Bos](https://wesbos.com/)
