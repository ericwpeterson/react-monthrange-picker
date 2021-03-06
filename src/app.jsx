import React from 'react';
import Picker from './picker';
import Calendar from './calendar';
import PropTypes from 'proptypes';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import './css/react-month-picker.css';

const moment = extendMoment(Moment);

class App extends React.Component {
	constructor(props) {
		super(props);
		this.handleClickFn = this.handleClick.bind(this);
		this.onSelectFn = this.onSelect.bind(this);
		this.onApplyFn = this.onApply.bind(this);
		this.onCancelFn = this.onCancel.bind(this);

		const { selectedDateRange, restrictionRange, display } = props;
		this.state = { selectedDateRange, restrictionRange, display };
		this.selectedDateRange = selectedDateRange.clone();
	}
	componentDidMount() {
		if (this.props.onRender) {
			this.props.onRender();
		}
	}
	componentWillReceiveProps(nextProps) {
		const localState = Object.assign({}, this.state, nextProps);
		this.setState(localState);
	}
	onSelect(newDateRange) {
		// so that if the user clicks cancel it doesn't change.
		this.selectedDateRange = newDateRange.clone();

		if (this.props.onSelect) {
			this.props.onSelect(this.selectedDateRange);
		}

		if (this.props.oneYear) {
			this.onApplyFn();
		}
	}
	onApply() {
		if (this.props.onApply) {
			if (this.props.oneYear) {
				this.props.onApply(this.selectedDateRange.start);
			} else {
				this.props.onApply(this.selectedDateRange);
			}
		}

		// what ever was selected currently gets applied
		this.setState({ display: false, selectedDateRange: this.selectedDateRange });
	}
	onCancel() {
		if (this.props.onCancel) {
			this.props.onCancel();
		}
		this.setState({ display: false });
	}
	handleClick(e) {
		e.preventDefault();
		e.stopPropagation();
		if (this.state.display) {
			return;
		}
		this.setState({ display: true });
	}
	render() {
		return (
			<div className="month-picker">
				<Picker
					oneYear={this.props.oneYear}
					selectedDateRange={this.state.selectedDateRange.clone()}
					onClick={this.handleClickFn}
				/>
				<Calendar
					selectedDateRange={this.state.selectedDateRange.clone()}
					restrictionRange={this.state.restrictionRange.clone()}
					display={this.state.display}
					onSelect={this.onSelectFn}
					onApply={this.onApplyFn}
					onCancel={this.onCancelFn}
					direction={this.props.direction}
					onYearChange={this.props.onYearChange}
					position={this.props.position}
					oneYear={this.props.oneYear}
					modalButtonsContainerClass={this.props.modalButtonsContainerClass}
					modalButtonContainerCancelClass={this.props.modalButtonContainerCancelClass}
					modalButtonContainerApplyClass={this.props.modalButtonContainerApplyClass}
				/>
			</div>
		);
	}
}

App.propTypes = {
	selectedDateRange: PropTypes.object,
	restrictionRange: PropTypes.object,
	onYearChange: PropTypes.func,
	onRender: PropTypes.func,
	onSelect: PropTypes.func,
	onApply: PropTypes.func,
	onCancel: PropTypes.func,
	display: PropTypes.bool,
	direction: PropTypes.oneOf(['top', 'left', 'right', 'bottom']),
	position: PropTypes.shape({
		top: PropTypes.number,
		left: PropTypes.number
	}),
	oneYear: PropTypes.bool,
	modalButtonsContainerClass: PropTypes.string,
	modalButtonContainerCancelClass: PropTypes.string,
	modalButtonContainerApplyClass: PropTypes.string
};

const date = new Date();
const startDate = new Date(date.getFullYear(), 0, 1);
const endDate = startDate;

const minDate = new Date(2000, 0, 1);
const maxDate = new Date(date.getFullYear() + 4, 11, 31);

App.defaultProps = {
	selectedDateRange: moment.range(startDate, endDate),
	restrictionRange: moment.range(minDate, maxDate),
	display: false,
	direction: 'bottom',
	oneYear: true
};

export default App;
