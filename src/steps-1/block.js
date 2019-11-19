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
        title: __( 'LEARN MASTER RESEARCH', 'kenzap-steps' ),
        description: __( 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna suprecent.', 'kenzap-steps' ),
        key: new Date().getTime() + 1,
    }, {
        title: __( 'FOCUS SKETCH DESIGN', 'kenzap-steps' ),
        description: __( 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna suprecent.', 'kenzap-steps' ),
        key: new Date().getTime() + 2,
    }, {
        title: __( 'CODE DEVELOP TEST', 'kenzap-steps' ),
        description: __( 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna suprecent.', 'kenzap-steps' ),
        key: new Date().getTime() + 3,
    },
] );

/**
 * Define typography defaults
 */
export const typographyArr = JSON.stringify([
    {
        'title': __( '- Title', 'kenzap-steps' ),
        'font-size': 30,
        'font-weight': 7,
        'line-height': 38,
        'margin-bottom': 10,
        'color': '#333333',
    },
    {
        'title': __( '- Description', 'kenzap-steps' ),
        'text-align':'',
        'font-size': 15,
        'font-weight': 4,
        'line-height': 25,
        'color': '#333333',
    },
]);

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
    };

    if(attributes.stepNumberColor){ vars['--stepNumberColor'] = attributes.stepNumberColor; }
    if(attributes.textColor2){ vars['--textColor2'] = attributes.textColor2; }

    return {
        vars,
        kenzapContanerStyles,
    };
};

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
registerBlockType( 'kenzap/steps-1', {
    title: __( 'Kenzap Steps 1', 'kenzap-steps' ),
    icon: 'networking',
    category: 'layout',
    keywords: [
        __( 'Steps', 'kenzap-steps' ),
        __( 'Features', 'kenzap-steps' ),
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
            default: 46,
        },

        descriptionSize: {
            type: 'number',
            default: 18,
        },

        textColor2: {
            type: 'string',
        },

        stepNumberColor: {
            type: 'string',
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
                textColor2: '#333',
                textColor3: '#333',
                textColor4: '#333',
                stepNumberColor: '#FFF',
                isFirstLoad: false,
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
                    className={ `kpst-1 block-${ attributes.blockUniqId }` }
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
                                        className="kenzap-col-4"
                                    >
                                        <div className="step-box">
                                            <div className="step-count" >
                                                <span style={ { fontSize: `${ attributes.descriptionSize }px`, lineHeight: `${ attributes.titleSize }px`, width: `${ attributes.titleSize }px`, height: `${ attributes.titleSize }px` } } >{ index + 1 }</span>
                                            </div>
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
