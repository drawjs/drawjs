export default ({
	properties: {
		activePanelId: {
			type: 'string',
		},
		panels: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					id: {
						type: 'string'
					},
					name: {
						type: 'string'
					},
					elements: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								id: {
									type: 'string'
								},
								type: {
									type: 'string'
								},
								top: {
									type: 'number'
								},
								left: {
									type: 'number'
								},
								width: {
									type: 'number'
								},
								height: {
									type: 'number'
								},
								fill: {
									type: 'string'
								},
								angle: {
									type: 'number'
								},
								draggable: {
									type: 'boolean'
								},
							},
							required: [
								'id',
								// 'type',
								'top',
								'left',
								'width',
								'height',
								// 'fill',
								// 'angle',
								// 'draggable',
							]
						}
					}
				},
				required: [ 'id', 'name', 'elements' ]
			}
		}
	}
})
