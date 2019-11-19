//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText, InnerBlocks } = wp.editor;

import { blockProps, ContainerSave } from '../commonComponents/container/container';
import { getTypography } from '../commonComponents/typography/typography';
import Edit from './edit';

/**
 * Provides the initial data for new block
 */
export const defaultItem = {
    title: __( 'New Step', 'kenzap-steps' ),
    description: __( 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna suprecent.', 'kenzap-steps' ),
};

export const defaultSubBlocks = JSON.stringify( [
    {
        title: __( 'How much does the design cost?', 'kenzap-steps' ),
        description: __( 'The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way.\n' +
            '\n' +
            'When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane.', 'kenzap-steps' ),
        key: new Date().getTime() + 1,
    }, {
        title: __( 'How to make the right brief for the project?', 'kenzap-steps' ),
        description: __( 'Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.', 'kenzap-steps' ),
        key: new Date().getTime() + 2,
    }, {
        title: __( 'How to work with an account manager', 'kenzap-steps' ),
        description: __( 'She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane.', 'kenzap-steps' ),
        key: new Date().getTime() + 3,
    }, {
        title: __( 'How not to lose with the creative?', 'kenzap-steps' ),
        description: __( 'When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane.', 'kenzap-steps' ),
        key: new Date().getTime() + 4,
    }, {
        title: __( 'How to make the right brief for the project?', 'kenzap-steps' ),
        description: __( 'Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane.', 'kenzap-steps' ),
        key: new Date().getTime() + 5,
    },
] );

/**
 * Generate inline styles for custom settings of the block
 * @param {Object} attributes - of the block
 * @returns {Node} generated styles
 */
export const getStyles = attributes => {
    const kenzapContanerStyles = {
        maxWidth: `${ attributes.containerMaxWidth === '100%' ? '100%' : attributes.containerMaxWidth + 'px' }`,
        '--maxWidth': `${ attributes.containerMaxWidth === '100%' ? '100wh' : attributes.containerMaxWidth + ' ' } `,
    };

    const vars = {
        '--paddings': `${ attributes.containerPadding }`,
        '--paddings2': `${ attributes.containerSidePadding }px`,
        '--paddingsMin': `${ attributes.containerPadding / 4 }`,
        '--paddingsMinPx': `${ attributes.containerPadding / 4 }px`,
        '--iconMediaUrl': attributes.icon.iconMediaUrl,
    };

    return {
        vars,
        kenzapContanerStyles,
    };
};

/**
 * Define typography defaults
 */
export const typographyArr = JSON.stringify([
    {
        'title': __( '- Title', 'kenzap-steps' ),
        'font-size': 42,
        'font-weight': 7,
        'line-height': 56,
        'margin-bottom': 20,
        'color': '#333333',
    },
    {
        'title': __( '- Description', 'kenzap-steps' ),
        'text-align':'',
        'font-size': 16,
        'font-weight': 4,
        'line-height': 30,
        'margin-bottom': 20,
        'color': '#333333',
    },
]);

/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kenzap/steps-3', {
    title: __( 'Kenzap Steps 3', 'kenzap-steps' ),
    icon: 'networking',
    category: 'layout',
    keywords: [
        __( 'Steps', 'kenzap-steps' ),
        __( 'Step', 'kenzap-steps' ),
    ],
    anchor: true,
    html: true,
    supports: {
        align: [ 'full', 'wide' ],
    },
    attributes: {
        ...blockProps,

        titleSize: {
            type: 'number',
            default: 102,
        },

        stepNumberColor: {
            type: 'string',
            //default: '#000',
        },

        icon: {
            type: 'object',
            default: {
                iconMediaId: '',
                iconMediaUrl: `url(${ window.kenzap_steps_gutenberg_path + 'step-3/underline.svg' })`,
            },
        },

        items: {
            type: 'array',
            default: [],
        },

        typography: {
            type: 'array',
            default: [],
        },

        isFirstLoad: {
            type: 'boolean',
            default: true,
        },

        blockUniqId: {
            type: 'number',
            default: 0,
        },
    },

    edit: ( props ) => {

        if ( props.attributes.items.length === 0 && props.attributes.isFirstLoad ) {
            props.setAttributes( {
                items: [ ...JSON.parse( defaultSubBlocks ) ],
                isFirstLoad: false,
                stepNumberColor: '#000',
            } );

            props.attributes.items = JSON.parse( defaultSubBlocks );
            if ( ! props.attributes.blockUniqId ) {
                props.setAttributes( {
                    blockUniqId: new Date().getTime(),
                } );
            }
        }

        return ( <Edit { ...props } /> );
    },

    /**
     * The save function defines the way in which the different attributes should be combined
     * into the final markup, which is then serialized by Gutenberg into post_content.
     *
     * The "save" property must be specified and must be a valid function.
     * @param {Object} props - attributes
     * @returns {Node} rendered component
     */
    save: function( props ) {
        const {
            className,
            attributes,
        } = props;

        const { vars, kenzapContanerStyles } = getStyles( props.attributes );

        return (
            <div className={ className ? className : '' } style={ vars }>
                <ContainerSave
                    className={ `kenzap-steps-3 block-${ attributes.blockUniqId }` }
                    attributes={ attributes }
                    style={ vars }
                    withBackground
                    withPadding
                >
                    <div className="kenzap-container" style={ kenzapContanerStyles }>
                        { attributes.nestedBlocks == 'top' && <InnerBlocks.Content /> }
                        <div className="step-list">
                            <div className="kenzap-row">
                                { attributes.items && attributes.items.map( ( item, index ) => (
                                    <div
                                        key={ item.key }
                                        className="step-box"
                                    >
                                        <div className="kenzap-col-2">
                                            <div className="step-count" >
                                                <span style={ { fontSize: `${ attributes.titleSize }px`, color: attributes.stepNumberColor } }>{ index + 1 }</span>
                                            </div>
                                        </div>
                                        <div className="kenzap-col-10">
                                            <div className="step-content">
                                                <RichText.Content
                                                    tagName="h3"
                                                    value={ item.title }
                                                    style={ getTypography( attributes, 0 ) }
                                                />
                                                <RichText.Content
                                                    tagName="p"
                                                    value={ item.description }
                                                    style={ getTypography( attributes, 1 ) }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) ) }
                            </div>
                        </div>
                        { attributes.nestedBlocks == 'bottom' && <InnerBlocks.Content /> }
                    </div>
                </ContainerSave>
            </div>
        );
    },
} );
