import $attributeValue from '../../xml/sanitizeAttributeValue.js'
import getXlsxColorForHexColor from './getXlsxColorForHexColor.js'

export default function getBorderXml({
	borderColor,
	borderStyle,
	leftBorderColor,
	leftBorderStyle,
	rightBorderColor,
	rightBorderStyle,
	topBorderColor,
	topBorderStyle,
	bottomBorderColor,
	bottomBorderStyle
}) {
	const left = {
		style: leftBorderStyle || borderStyle,
		color: leftBorderColor || borderColor
	}

	const right = {
		style: rightBorderStyle || borderStyle,
		color: rightBorderColor || borderColor
	}

	const top = {
		style: topBorderStyle || borderStyle,
		color: topBorderColor || borderColor
	}

	const bottom = {
		style: bottomBorderStyle || borderStyle,
		color: bottomBorderColor || borderColor
	}

	let xml = '<border>'
	xml += getSideBorderXml('left', left)
	xml += getSideBorderXml('right', right)
	xml += getSideBorderXml('top', top)
	xml += getSideBorderXml('bottom', bottom)
	xml += '<diagonal/>'
	xml += '</border>'

	return xml
}

function getSideBorderXml(side, { style, color }) {
	if (color && !style) {
		style = 'thin'
	}
	const hasChildren = Boolean(color)
	return `<${side}` +
		(style ? ` style="${$attributeValue(style)}"` : '') +
		(hasChildren ? '>' : '/>') +
		(color ? `<color rgb="${$attributeValue(getXlsxColorForHexColor(color))}"/>` : '') +
		(hasChildren ? `</${side}>` : '')
}