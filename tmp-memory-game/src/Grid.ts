export type GameObj = {
	displayHeight: number;
	displayWidth: number;
};

export type Props<T extends GameObj> = {
	gameObjectCreator: () => T;
	margin?: number;
	size?: number;
	x?: number;
	y?: number;
};

export class Grid<T extends GameObj> {
	margin: number;
	rows: T[][];
	size: number;
	x: number;
	y: number;

	constructor({
		gameObjectCreator,
		margin = 4,
		size = 3,
		x = 0,
		y = 0,
	}: Props<T>) {
		this.margin = margin;
		this.rows = [];
		this.size = size;
		this.x = x;
		this.y = y;

		for (let i = 0; i < this.size; i++) {
			const newRow: (typeof this.rows)[number] = [];

			for (let j = 0; j < this.size; j++) {
				const obj = gameObjectCreator();
				newRow.push(obj);
			}

			this.rows.push(newRow);
		}
	}

	getDisplayWidth() {
		return (
			this.rows[0][0].displayWidth * this.size + this.margin * (this.size - 1)
		);
	}

	getDisplayHeight() {
		return (
			this.rows[0][0].displayHeight * this.size + this.margin * (this.size - 1)
		);
	}

	forEachEl(
		fn: (el: T, rowIndex: number, columnIndex: number, index: number) => void,
	) {
		let index = 0;

		for (let i = 0; i < this.size; i++) {
			const currentRow = this.rows[i];

			for (let j = 0; j < this.size; j++) {
				fn(currentRow[j], i, j, index);
				index++;
			}
		}
	}

	getEls() {
		const els = [];

		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				els.push(this.rows[i][j]);
			}
		}

		return els;
	}
}
