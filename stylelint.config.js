module.exports = {
	extends: [],
	plugins: [
		// Bring in some extra rules for SCSS
		'stylelint-order',
		'stylelint-scss',
	],
	// add your custom config here
	// https://stylelint.io/user-guide/configuration
	rules: {
		'order/order': [
			[
				'dollar-variables',
				'custom-properties',
				'at-rules',
				'declarations',
				{
					type: 'at-rule',
					name: 'supports',
				},
				{
					type: 'at-rule',
					name: 'media',
				},
				'rules',
			],
			{ severity: 'warning' },
		],
		'order/properties-order': [
			[
				//
				'content',

				//
				'flex',
				'order',
				'flex-grow',
				'flex-shrink',
				'flex-basis',
				'align-self',
				'justify-self',
				'display',
				'justify-content',
				'justify-items',
				'align-content',
				'align-items',
				'flex-flow',
				'flex-direction',
				'flex-wrap',

				//
				'float',
				'clear',

				//
				'position',
				'top',
				'left',
				'bottom',
				'right',
				'z-index',
				'vertical-align',

				//
				'width',
				'min-width',
				'max-width',
				'height',
				'min-height',
				'max-height',
				'line-height',

				//
				'margin',
				'margin-top',
				'margin-left',
				'margin-bottom',
				'margin-right',
				'padding',
				'padding-top',
				'padding-left',
				'padding-bottom',
				'padding-right',

				//
				'border',
				'border-width',
				'border-style',
				'border-color',
				'border-spacing',
				'border-collapse',
				'border-top',
				'border-top-width',
				'border-top-style',
				'border-top-color',
				'border-left',
				'border-left-width',
				'border-left-style',
				'border-left-color',
				'border-bottom',
				'border-bottom-width',
				'border-bottom-style',
				'border-bottom-color',
				'border-right',
				'border-right-width',
				'border-right-style',
				'border-right-color',
				'border-radius',
				'border-top-left-radius',
				'border-top-right-radius',
				'border-bottom-left-radius',
				'border-bottom-right-radius',
				'border-image',
				'border-image-source',
				'border-image-slice',
				'border-image-width',
				'border-image-outset',
				'border-image-repeat',
				'border-top-image',
				'border-left-image',
				'border-bottom-image',
				'border-right-image',
				'border-corner-image',
				'border-top-left-image',
				'border-top-right-image',
				'border-bottom-left-image',
				'border-bottom-right-image',

				//
				'background',
				'background-color',
				'background-image',
				'background-attachment',
				'background-repeat',
				'background-position',
				'background-position-x',
				'background-position-y',
				'background-clip',
				'background-origin',
				'background-size',

				//
				'font',
				'font-size',
				'font-weight',
				'color',
				'letter-spacing',

				'font-variant',
				'font-size-adjust',
				'font-stretch',
				'font-family',
				'font-style',
				'src',
				'quotes',
				'counter-increment',
				'counter-reset',
				'-ms-writing-mode',

				'text-align',
				'text-align-last',
				'text-decoration',
				'text-emphasis',
				'text-emphasis-position',
				'text-emphasis-style',
				'text-emphasis-color',
				'text-justify',
				'text-outline',
				'text-transform',
				'text-wrap',
				'text-overflow',
				'text-overflow-ellipsis',
				'text-overflow-mode',
				'text-shadow',
				'white-space',
				'word-spacing',
				'word-wrap',
				'word-break',
				'overflow-wrap',
				'tab-size',
				'hyphens',
				'interpolation-mode',
				'text-indent',

				//
				'box-sizing',
				'box-decoration-break',
				'box-shadow',
				'outline',
				'outline-width',
				'outline-style',
				'outline-color',
				'outline-offset',
				'table-layout',
				'caption-side',
				'empty-cells',
				'list-style',
				'list-style-position',
				'list-style-type',
				'list-style-image',

				//
				'object-fit',
				'overflow',
				'overflow-x',
				'overflow-y',
				'overflow-scrolling',
				'clip',

				//
				'transition',
				'transition-delay',
				'transition-timing-function',
				'transition-duration',
				'transition-property',
				'transform',
				'transform-origin',
				'animation',
				'animation-name',
				'animation-duration',
				'animation-play-state',
				'animation-timing-function',
				'animation-delay',
				'animation-iteration-count',
				'animation-direction',
				'animation-fill-mode',

				//
				'opacity',
				'visibility',
				'cursor',

				//
				//
				//

				'filter',
				'resize',
				'pointer-events',
				'user-select',
				'zoom',
				'max-zoom',
				'min-zoom',
				'user-zoom',
				'orientation',
				'fill',
				'stroke',

				//
				// 여기 이후부터는 아직은 잘 안쓰는 속성이지만 사용하게 되면 추후에 수정할 것 같습니다.....
				//

				'grid',
				'grid-area',
				'grid-template',
				'grid-template-areas',
				'grid-template-rows',
				'grid-template-columns',
				'grid-row',
				'grid-row-start',
				'grid-row-end',
				'grid-column',
				'grid-column-start',
				'grid-column-end',
				'grid-auto-rows',
				'grid-auto-columns',
				'grid-auto-flow',
				'grid-gap',
				'grid-row-gap',
				'grid-column-gap',
				'gap',
				'row-gap',
				'column-gap',

				//
				'unicode-bidi',
				'direction',
				'columns',
				'column-span',
				'column-width',
				'column-count',
				'column-fill',
				'column-gap',
				'column-rule',
				'column-rule-width',
				'column-rule-style',
				'column-rule-color',
				'break-before',
				'break-inside',
				'break-after',
				'page-break-before',
				'page-break-inside',
				'page-break-after',
				'orphans',
				'widows',
			],
			{
				unspecified: 'bottom',
				severity: 'warning',
			},
		],

		// Base Rules

		// 들여쓰기 단위는 tab으로 사용
		indentation: 'tab',

		'color-no-invalid-hex': true,

		// 글꼴
		// 중복된 글꼴 패밀리 이름을 허용하지 않습니다.
		'font-family-no-duplicate-names': true,
		// 글꼴 패밀리 이름 목록에서 누락된 일반 패밀리를 허용하지 않습니다.
		'font-family-no-missing-generic-family-keyword': true,

		// 명명 된 격자 영역
		// 유효하지 않은 명명된 그리드 영역을 허용하지 않습니다.
		'named-grid-areas-no-invalid': true,

		// 기능
		// calc함수 내에서 공백이 없는 연산자를 허용하지 않습니다 .
		'function-calc-no-unspaced-operator': true,
		// 표준 구문linear-gradient() 에 따라 유효하지 않은 호출의 방향 값을 허용 하지 않습니다 .
		'function-linear-gradient-no-nonstandard-direction': true,

		// 문자열에서 (이스케이프 처리되지 않은) 개행을 허용하지 않습니다.
		'string-no-newline': true,

		// 알 수 없는 단위를 허용하지 않습니다.
		'unit-no-unknown': true,

		// 알 수 없는 속성을 허용하지 않습니다.
		'property-no-unknown': true,

		// Declaration block
		// 선언 블록 내에서 중복 사용자 정의 속성을 허용하지 않습니다.
		'declaration-block-no-duplicate-custom-properties': true,
		// 선언 블록 내에서 중복 속성을 허용하지 않습니다.
		'declaration-block-no-duplicate-properties': true,
		// 관련 장형 속성을 재정의하는 단축형 속성을 허용하지 않습니다.
		'declaration-block-no-shorthand-property-overrides': true,

		// Block 빈 블록을 허용하지 않습니다.
		'block-no-empty': true,

		// '{' 시작 시 항상 이전에 스페이스를 삽입
		'block-opening-brace-space-before': 'always',
		'block-opening-brace-space-after': 'always',

		// Selector​
		// 알 수 없는 의사 클래스 선택기를 허용하지 않습니다.
		'selector-pseudo-class-no-unknown': true,
		//  알 수 없는 의사 요소 선택기를 허용하지 않습니다.
		'selector-pseudo-element-no-unknown': null,
		// 알 수 없는 유형 선택자를 허용하지 않습니다.
		'selector-type-no-unknown': true,

		// Media feature​ 알 수 없는 미디어 기능 이름을 허용하지 않습니다.
		'media-feature-name-no-unknown': true,

		// At-rule​ 알 수 없는 at-규칙을 허용하지 않습니다.
		'at-rule-no-unknown': null,

		// 빈 댓글을 허용하지 않습니다.
		'comment-no-empty': true,

		// 특이도가 높은 선택자를 재정의한 후 특이성이 낮은 선택자가 오는 것을 허용하지 않습니다.
		'no-descending-specificity': null,
		// @import스타일시트 내에서 중복 규칙을 허용하지 않습니다 .
		'no-duplicate-at-import-rules': true,
		// 스타일시트 내에서 중복 선택자를 허용하지 않습니다.
		// 'no-duplicate-selectors': true,
		// 빈 소스를 허용하지 않습니다.
		'no-empty-source': true,
		// 추가 세미콜론을 허용하지 않습니다(자동 수정 가능).
		'no-extra-semicolons': true,
		// ...CSS에서 지원하지 않는 이중 슬래시 주석( )을 허용 하지 않습니다.
		'no-invalid-double-slash-comments': true,
		// @import스타일시트 내에서 잘못된 위치 규칙을 허용하지 않습니다 .
		'no-invalid-position-at-import-rule': [
			true,
			{
				ignoreAtRules: ['use'],
			},
		],

		// ### 제한 언어 기능
		// 알파 값에 대한 백분율 또는 숫자 표기법을 지정합니다(자동 수정 가능).
		'alpha-value-notation': 'number',
		// 각도 색조에 대한 숫자 또는 각도 표기법을 지정합니다(자동 수정 가능).
		'hue-degree-notation': 'angle',

		// 적용 가능한 색상 기능에 대한 최신 또는 레거시 표기법을 지정합니다(자동 수정 가능).
		'color-function-notation': 'modern',

		// 길이가 0인 단위를 허용하지 않습니다(자동 수정 가능).
		'length-zero-no-unit': true,

		// 스키마 기준 URL을 허용하지 않습니다.
		'function-url-no-scheme-relative': true,

		//  키프레임 이름의 패턴을 지정합니다.
		// 'keyframes-name-pattern': 'string',

		// 숫자에 허용되는 소수 자릿수를 제한합니다.
		'number-max-precision': 4,

		// 속기 속성에서 중복 값을 허용하지 않습니다(자동 수정 가능).
		'shorthand-property-no-redundant-values': true,

		// 값에 대한 공급업체 접두사를 허용하지 않습니다(자동 수정 가능).
		'value-no-vendor-prefix': null,
		// 속성에 대한 공급업체 접두사를 허용하지 않습니다(자동 수정 가능).
		'property-no-vendor-prefix': true,
		// 선택기에 대한 공급업체 접두사를 허용하지 않습니다(자동 수정 가능).
		'selector-no-vendor-prefix': true,

		// 적용 가능한 의사 요소에 대해 단일 또는 이중 콜론 표기법을 지정합니다(자동 수정 가능).
		// 'selector-pseudo-element-colon-notation': 'single',

		// 16진수 색상에 대해 소문자 또는 대문자를 지정합니다(자동 수정 가능).
		'color-hex-case': 'lower',
		// 16진수 색상에 대해 짧거나 긴 표기법을 지정합니다(자동 수정 가능).
		'color-hex-length': 'short',

		//  함수의 쉼표 앞, 뒤에 줄 바꿈이 필요하거나 공백을 허용하지 않습니다(자동 수정 가능).
		'function-comma-newline-after': 'never-multi-line',
		'function-comma-newline-before': 'never-multi-line',
		// 기능의 쉼표 앞, 뒤에 공백 하나를 요구하거나 공백을 허용하지 않습니다(자동 수정 가능).
		'function-comma-space-after': 'always',
		'function-comma-space-before': 'never',
		// 함수 내에서 인접한 빈 줄의 수를 제한합니다(자동 수정 가능).
		'function-max-empty-lines': 0,
		// 함수 이름에 소문자 또는 대문자를 지정합니다(자동 수정 가능).
		'function-name-case': 'lower',
		// 함수의 괄호 내부에 줄 바꿈을 요구하거나 공백을 허용하지 않습니다(자동 수정 가능).
		'function-parentheses-newline-inside': 'never-multi-line',
		// 함수 괄호 내부에 공백을 하나만 요구하거나 공백을 허용하지 않습니다(자동 수정 가능).
		'function-parentheses-space-inside': 'never',
		// URL에 대한 따옴표를 요구하거나 허용하지 않습니다.
		'function-url-quotes': 'always',
		// 함수 뒤에 공백을 요구하거나 허용하지 않습니다(자동 수정 가능).
		'function-whitespace-after': 'always',

		// 1보다 작은 분수에 대해 선행 0을 요구하거나 허용하지 않습니다(자동 수정 가능).
		'number-leading-zero': 'always',
		// 숫자에서 후행 0을 허용하지 않습니다(자동 수정 가능).
		'number-no-trailing-zeros': true,

		// 문자열 주위에 작은따옴표 또는 큰따옴표를 지정합니다(자동 수정 가능).
		'string-quotes': 'single',
		// 단위에 대해 소문자 또는 대문자를 지정합니다(자동 수정 가능).
		'unit-case': 'lower',
		// 키워드 값에 대해 소문자 또는 대문자를 지정합니다(자동 수정 가능).
		'value-keyword-case': 'lower',

		// 값 목록의 쉼표 앞, 뒤에 줄 바꿈이 필요하거나 공백이 허용되지 않습니다(자동 수정 가능).
		'value-list-comma-newline-after': 'never-multi-line',
		'value-list-comma-newline-before': 'never-multi-line',
		// 값 목록의 쉼표 앞, 뒤에 단일 공백이 필요하거나 공백을 허용하지 않습니다(자동 수정 가능).
		'value-list-comma-space-after': 'always-single-line',
		'value-list-comma-space-before': 'never',
		// 값 목록 내에서 인접한 빈 줄의 수를 제한합니다(자동 수정 가능).
		'value-list-max-empty-lines': 0,

		// 사용자 정의 속성 앞에 빈 줄을 요구하거나 허용하지 않습니다(자동 수정 가능).
		'custom-property-empty-line-before': 'always',

		// 속성에 대해 소문자 또는 대문자를 지정합니다(자동 수정 가능).
		'property-case': 'lower',

		// 선언 블록
		// 선언 블록의 세미콜론 뒤에 줄 바꿈이 필요하거나 공백을 허용하지 않습니다(자동 수정 가능).
		// 선언 앞에 단일 공백이 필요하거나 공백을 허용하지 않습니다(자동 수정 가능).
		'declaration-bang-space-after': 'never',
		'declaration-bang-space-before': 'always',
		// 단일 공백이 필요하거나 선언 콜론 뒤에 공백을 허용하지 않습니다(자동 수정 가능).
		'declaration-colon-space-after': 'always',
		'declaration-colon-space-before': 'never',
		// 'declaration-block-semicolon-newline-after': 'never-multi-line',

		'declaration-block-semicolon-space-after': 'always-single-line',
		'declaration-block-semicolon-space-before': 'never',
		// 선언 블록 내에서 후행 세미콜론을 요구하거나 허용하지 않습니다(자동 수정 가능).
		'declaration-block-trailing-semicolon': 'always',

		// 블록
		// 블록의 닫는 중괄호 앞에 빈 줄을 요구하거나 허용하지 않습니다(자동 수정 가능).
		'block-closing-brace-empty-line-before': 'never',
		// 블록의 닫는 중괄호 앞, 뒤에 줄 바꿈이 필요하거나 공백을 허용하지 않습니다(자동 수정 가능).
		'block-closing-brace-newline-after': 'always-multi-line',
		'block-closing-brace-newline-before': 'always-multi-line',
		// 블록의 닫는 중괄호 앞에 단일 공백이 필요하거나 공백을 허용하지 않습니다(자동 수정 가능).
		'block-closing-brace-space-before': 'always-single-line',

		// 속성 선택기 내의 대괄호 내부에 단일 공백이 필요하거나 공백을 허용하지 않습니다(자동 수정 가능).
		'selector-attribute-brackets-space-inside': 'never',
		// 속성 선택기 내에서 단일 공백이 필요하거나 연산자 앞, 뒤에 공백을 허용하지 않습니다(자동 수정 가능).
		'selector-attribute-operator-space-after': 'always',
		'selector-attribute-operator-space-before': 'always',
		// 선택기의 결합자 뒤에 단일 공백이 필요하거나 공백을 허용하지 않습니다(자동 수정 가능).
		'selector-combinator-space-after': 'always',
		'selector-combinator-space-before': 'always',
		// 선택자의 자손 결합자에 대해 공백이 아닌 문자를 허용하지 않습니다(자동 수정 가능).
		'selector-descendant-combinator-no-non-space': true,
		// 의사 클래스 선택기에 소문자 또는 대문자를 지정합니다(자동 수정 가능).
		'selector-pseudo-class-case': 'lower',
		// 의사 클래스 선택기(자동 수정 가능) 내에서 괄호 내부에 공백을 하나만 요구하거나 공백을 허용하지 않습니다.
		'selector-pseudo-class-parentheses-space-inside': 'never',
		// 의사 요소 선택기에 대해 소문자 또는 대문자를 지정합니다(자동 수정 가능).
		'selector-pseudo-element-case': 'lower',
		// 유형 선택기에 대해 소문자 또는 대문자를 지정합니다(자동 수정 가능).
		'selector-type-case': 'lower',

		// 택기 목록의 쉼표 앞, 뒤에 줄 바꿈이 필요하거나 공백이 허용되지 않습니다(자동 수정 가능).
		'selector-list-comma-newline-after': 'never-multi-line',
		'selector-list-comma-newline-before': 'never-multi-line',
		// 선택기 목록의 쉼표 뒤에 단일 공백이 필요하거나 공백을 허용하지 않습니다(자동 수정 가능).
		'selector-list-comma-space-after': 'always',
		'selector-list-comma-space-before': 'never',

		// 규칙 앞에 빈 줄을 요구하거나 허용하지 않습니다(자동 수정 가능).
		'rule-empty-line-before': [
			'always',
			{
				except: [
					'after-rule',
					'after-single-line-comment',
					// 'inside-block-and-after-rule',
					'inside-block',
					// 'first-nested',
				],
				// ignore: ['after-comment', 'first-nested', 'inside-block'],
			},
		],

		// 미디어 기능에서 콜론 뒤에 공백을 하나 입력해야 하거나 공백을 허용하지 않습니다(자동 수정 가능).
		'media-feature-colon-space-after': 'always',
		'media-feature-colon-space-before': 'never',
		// 미디어 기능 이름에 소문자 또는 대문자를 지정합니다(자동 수정 가능).
		'media-feature-name-case': 'lower',
		// 미디어 기능(자동 수정 가능) 내에서 괄호 안의 공백을 하나만 요구하거나 공백을 허용하지 않습니다.
		'media-feature-parentheses-space-inside': 'never',
		// 미디어 기능에서 범위 연산자 뒤에 단일 공백이 필요하거나 공백을 허용하지 않습니다(자동 수정 가능).
		'media-feature-range-operator-space-after': 'always',
		'media-feature-range-operator-space-before': 'always',

		// 미디어 쿼리 목록의 쉼표 뒤에 줄 바꿈이 필요하거나 공백이 허용되지 않습니다(자동 수정 가능).
		'media-query-list-comma-newline-after': 'never-multi-line',
		'media-query-list-comma-newline-before': 'never-multi-line',
		// 미디어 쿼리 목록의 쉼표 뒤에 공백 하나를 요구하거나 공백을 허용하지 않습니다(자동 수정 가능).
		'media-query-list-comma-space-after': 'always-single-line',
		'media-query-list-comma-space-before': 'never',

		// at-rules 이름에 소문자 또는 대문자를 지정합니다(자동 수정 가능).
		'at-rule-name-case': 'lower',
		// at-rule 이름 뒤에 공백 하나가 필요합니다(자동 수정 가능).
		'at-rule-name-space-after': 'always-single-line',

		// 주석 마커 내부에 공백을 요구하거나 허용하지 않습니다(자동 수정 가능).
		'comment-whitespace-inside': 'always',
		// 인접한 빈 줄의 수를 제한합니다(자동 수정 가능).
		'max-empty-lines': 2,
		// 줄 끝 공백을 허용하지 않습니다(자동 수정 가능).
		'no-eol-whitespace': true,
		// 불규칙한 공백을 허용하지 않습니다.
		// 'no-irregular-whitespace': true,

		// sssssssssssssssssss
		// 'at-rule-empty-line-before': 'always',

		// 'selector-max-empty-lines': 2,

		// ID 선택기의 패턴을 지정
		// 'selector-id-pattern': /^[a-z][a-zA-Z]*$/,

		// 'number-leading-zero': null,
		// 'number-max-precision': [
		// 	4,
		// 	{
		// 		severity: 'warning',
		// 	},
		// ],
		// 'unit-allowed-list': ['em', 'rem', 's', 'vh', 'px', '%'],

		// 'color-hex-case': 'lower',
		// 'declaration-colon-newline-after': null,
		// 'selector-pseudo-element-colon-notation': null,
		// 'no-descending-specificity': null,
		// 'value-list-comma-newline-after': null,
		// 'rule-empty-line-before': [
		// 	'always',
		// 	{
		// 		ignore: ['first-nested'],
		// 	},
		// ],

		// 'declaration-colon-space-after': 'always',

		// 'declaration-block-semicolon-space-after': 'always',
		// 'declaration-block-semicolon-space-after': 'never',
		// 'declaration-block-semicolon-space-after': 'always-single-line',
		// 'declaration-block-semicolon-space-after': 'never-single-line',

		// 'declaration-block-semicolon-space-after': 'always',

		// 'declaration-colon-space-before': 'never',
		// 'declaration-block-semicolon-space-before': 'always',
		// 'declaration-block-semicolon-newline-before': 'never-multi-line',
		// 'declaration-block-single-line-max-declarations': 1,
		// 'declaration-block-multi-line-min-declarations': 2,
		// 'selector-max-universal': 1,
		// // 'declaration-block-semicolon-newline-after': 'never-multi-line',
		// 'declaration-block-trailing-semicolon': 'always',
		// // 'declaration-block-semicolon-newline-after': 'always-multi-line',
		// // 'declaration-block-semicolon-newline-after': 'always',
		// 'selector-pseudo-element-no-unknown': null,
		// 'at-rule-no-unknown': null,
		// // 'at-rule-empty-line-before': 'always',
		// 'string-no-newline': null,

		'scss/at-extend-no-missing-placeholder': true,
		'scss/at-if-no-null': true,
		'scss/at-import-no-partial-leading-underscore': true,
		// 'scss/at-import-partial-extension': 'always',
		'scss/at-rule-no-unknown': true,
		'scss/comment-no-empty': true,
		'scss/declaration-nested-properties-no-divided-groups': true,
		'scss/dollar-variable-no-missing-interpolation': true,
		'scss/function-quote-no-quoted-strings-inside': true,
		'scss/function-unquote-no-unquoted-strings-inside': true,
		'scss/no-duplicate-mixins': true,
		'scss/no-global-function-names': true,
		'scss/operator-no-newline-after': true,
		'scss/operator-no-newline-before': true,
		'scss/operator-no-unspaced': true,

		'scss/dollar-variable-colon-space-after': 'always',
		'scss/dollar-variable-colon-space-before': 'never',
		'scss/dollar-variable-pattern': /^[a-z0-9_-]+$/,
		'scss/double-slash-comment-whitespace-inside': 'always',
		'scss/selector-no-redundant-nesting-selector': null,
		// // // Allow SCSS and CSS module keywords beginning with `@`
		// 'scss/at-rule-no-unknown': null,
		// 'no-descending-specificity': null,
		// 'selector-pseudo-element-no-unknown': null,
	},
};
