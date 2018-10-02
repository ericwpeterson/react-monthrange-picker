import React from 'react';
import PropTypes from 'proptypes';

const Picker = function Picker(props) {
	const startDate = props.selectedDateRange.start;
	const endDate = props.selectedDateRange.end;

	let text;

	if (props.oneYear) {
		text = (
			<span className="date-str">
				<strong className="date">{startDate.format('MMM, YYYY')}</strong>
			</span>
		);
	} else {
		text = (
			<span className="date-str">
				<strong className="date">{startDate.format('MMM, YYYY')}</strong>-
				<strong className="date">{endDate.format('MMM, YYYY')}</strong>
			</span>
		);
	}

	return (
		<div className="picker">
			<button onClick={props.onClick} className="btn btn-default" id="date-range">
				<i className="fa fa-calendar glyphicon glyphicon-calendar" />
				<i className="fa fa-angle-down" />
				{text}
			</button>
		</div>
	);
};

Picker.propTypes = {
	selectedDateRange: PropTypes.object,
	onClick: PropTypes.func.isRequired
};

export default Picker;
