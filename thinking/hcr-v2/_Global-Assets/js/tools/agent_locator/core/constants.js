define({

	LICENSES_MAP: {

		'aflac':  ['Voluntary'],
		'uhc':['Medical', 'Dental', 'Vision'],
		'kaiser': ['Medical'],
		'delta': ['Dental','Pediatric'],
		'vsp':  ['Vision'],
		'rsli':  ['Life', 'Long Term Disability'],
		'gohealth':  ['Medical'],
		'dentegra':  ['Dental']
	},

	API_ENDPOINT:'/api/genericservice/Agents',
	MIN_ZOOM:0,
	MAX_ZOOM:21,

	DEFAULT_RADIUS:15,
	EXTENDED_RADIUS:50,

	VIEW_STATE_HOME:'home',
	VIEW_STATE_LIST:'list',
	VIEW_STATE_DETAIL:'detail',

	ERROR_COPY_API:'Something went wrong, please try again later.'
});