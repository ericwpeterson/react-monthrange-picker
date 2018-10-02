import React from 'react';
import _ from 'lodash';
import { YearStart, YearEnd } from './year';
import PropTypes from 'proptypes';

class Calendar extends React.Component {
	constructor(props) {
		super(props);
		this.selectMonthFn = this.selectMonth.bind(this);

		let positionTop;

		try {
			positionTop = props.position.top;
		} catch (e) {
			positionTop = 0;
		}

		let positionLeft;

		try {
			positionLeft = props.position.left;
		} catch (e) {
			positionLeft = 0;
		}

		this.calStyle = {
			width: this.props.oneYear ? '350px' : '600px',
			top: `${positionTop}px`,
			left: `${positionLeft}px`,
			display: props.display ? 'block' : 'none'
		};

		this.arrowStyle = {};

		const { selectedDateRange, restrictionRange } = props;
		// using state here because on month selection
		// both yearstart and yearend gets re-rendered
		// rather than propagating to the App.
		// App component stores the current select so
		// that on apply it can just change the state
		// to the current stored selection.

		this.state = { selectedDateRange, restrictionRange };
	}
	componentDidMount() {
		this.setStyle(this.props);
	}
	componentWillReceiveProps(nextProps) {
		this.setStyle(nextProps);
		const { selectedDateRange, restrictionRange } = _.cloneDeep(nextProps);
		this.setState({ selectedDateRange, restrictionRange });
	}
	setStyle(props) {
		let positionTop;

		try {
			positionTop = props.position.top;
		} catch (e) {
			positionTop = 0;
		}

		let positionLeft;

		try {
			positionLeft = props.position.left;
		} catch (e) {
			positionLeft = 0;
		}

		const calStyle = _.cloneDeep(this.calStyle);
		const arrowStyle = _.cloneDeep(this.arrowStyle);

		const direction = this.props.direction;
		const adjustmentConstant = 10;

		let calDim;
		let pickerDim;

		pickerDim = {
			height: 34,
			width: 225
		};

		if (this.props.oneYear) {
			calDim = {
				height: 219,
				width: 348
			};
		} else {
			calDim = {
				height: 219,
				width: 698
			};
		}

		if (direction === 'left' || direction === 'right') {
			calStyle.top = positionTop ? `${calStyle.top}px` : `-${calDim.height / 2}px`;
			if (direction === 'left') {
				const leftWidth = calDim.width + adjustmentConstant;

				calStyle.left = positionLeft ? `${calStyle.left}px` : `-${leftWidth}px`;
			} else {
				const rightWidth = pickerDim.width + adjustmentConstant;
				calStyle.left = positionLeft ? `${calStyle.left}px` : `${rightWidth}px`;
			}

			const arrowTop = Math.abs(parseInt(calStyle.top, 10)) + pickerDim.height / 2;
			arrowStyle.top = `${arrowTop}px`;
		} else if (direction === 'top' || direction === 'bottom') {
			calStyle.left = positionLeft ? `${calStyle.left}px` : `-${(calDim.width - pickerDim.width) / 2}px`;

			if (direction === 'top') {
				const top = calDim.height + pickerDim.height;
				calStyle.top = positionTop ? `${calStyle.top}px` : `-${top}px`;
			} else {
				const top = pickerDim.height + adjustmentConstant;
				calStyle.top = positionTop ? `${calStyle.top}px` : `${top}px`;
			}
			let arrowLeft;
			if (this.props.oneYear) {
				arrowLeft = Math.abs(parseInt(calStyle.left, 10)) + pickerDim.width;
			} else {
				arrowLeft = Math.abs(parseInt(calStyle.left, 10)) + pickerDim.width / 2;
			}

			arrowStyle.left = `${arrowLeft}px`;
		}

		calStyle.display = props.display ? 'block' : 'none';

		this.calStyle = calStyle;
		this.arrowStyle = arrowStyle;
	}
	selectMonth(newDateRange) {
		const newDateRangeClone = newDateRange.clone();
		if (newDateRangeClone.start > newDateRangeClone.end) {
			newDateRangeClone.end.month(newDateRangeClone.start.month());
			newDateRangeClone.end.year(newDateRangeClone.start.year());
		}

		if (this.props.oneYear) {
			//our range is a single month
			newDateRangeClone.end = newDateRange.start;
		}

		if (this.props.onSelect) {
			this.props.onSelect(newDateRangeClone);
		}

		this.setState({ selectedDateRange: newDateRangeClone });
	}
	render() {
		const selectedRange = this.state.selectedDateRange.clone();
		const startDate = selectedRange.start;
		const endDate = selectedRange.end;
		const popOverClass = `${this.props.direction} popover`;

		let yearTwo;

		let yearOneClass = 'col-xs-12 year-start year';

		let modalButtons;

		if (!this.props.oneYear) {
			yearOneClass = 'col-xs-6 year-start year';

			modalButtons = (
				<div className={this.props.modalButtonsContainerClass || 'modal-buttons-container'}>
					<div className={this.props.modalButtonContainerApplyClass || 'modal-button-container apply'}>
						<button onClick={this.props.onApply}>Apply</button>
					</div>
					<div className={this.props.modalButtonContainerCancelClass || 'modal-button-container cancel'}>
						<button onClick={this.props.onCancel}>Cancel</button>
					</div>
				</div>
			);

			yearTwo = (
				<div className="col-xs-6 year-end year">
					<YearEnd
						restrictionRange={this.props.restrictionRange}
						onYearChange={this.props.onYearChange}
						onSelect={this.selectMonthFn}
						currYear={endDate.clone()}
						selectedDateRange={selectedRange}
					/>
				</div>
			);
		}

		return (
			<div ref={node => (this.node = node)} className={popOverClass} style={this.calStyle}>
				<div className="arrow" style={this.arrowStyle} />
				<div className="clearfix sec-wrap">
					<div className={'calendar col-xs-12'}>
						<div className="clearfix">
							<div className={yearOneClass}>
								<YearStart
									restrictionRange={this.props.restrictionRange}
									onYearChange={this.props.onYearChange}
									onSelect={this.selectMonthFn}
									currYear={startDate.clone()}
									selectedDateRange={selectedRange}
									oneYear={this.props.oneYear}
								/>
							</div>
							{yearTwo}
						</div>
					</div>
				</div>
				{modalButtons}
			</div>
		);
	}
}

Calendar.propTypes = {
	selectedDateRange: PropTypes.object,
	restrictionRange: PropTypes.object,
	direction: React.PropTypes.oneOf(['top', 'left', 'right', 'bottom']).isRequired,
	display: PropTypes.bool.isRequired,
	onSelect: PropTypes.func.isRequired,
	onApply: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	onYearChange: PropTypes.func,
	position: PropTypes.shape({
		top: PropTypes.number,
		left: PropTypes.number
	}),
	oneYear: PropTypes.bool,
	modalButtonsContainerClass: PropTypes.string
};

export default Calendar;
