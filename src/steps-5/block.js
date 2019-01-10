/**
 * BLOCK: steps-5
 *
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText } = wp.editor;

import { blockProps, ContainerSave } from '../commonComponents/container/container';
import Edit from './edit';

/**
 * Provides the initial data for new block
 */
export const defaultItem = {
    title: __( 'New Step', 'kenzap-steps' ),
    description: __( 'Lorem Ipsum proin gravida nibivel velit auctor aenean velitsol licitu', 'kenzap-steps' ),
};

export const defaultSubBlocks = JSON.stringify( [
    {
        title: __( 'AWESOME COLLAGES', 'kenzap-steps' ),
        description: __( 'Lorem Ipsum proin gravida nibivel velit auctor aenean velitsol licitu', 'kenzap-steps' ),
        key: new Date().getTime() + 1,
    },
    {
        title: __( 'CREATIVE TEAM', 'kenzap-steps' ),
        description: __( 'Lorem Ipsum proin gravida nibivel velit auctor aenean velitsol licitu', 'kenzap-steps' ),
        key: new Date().getTime() + 2,
    },
    {
        title: __( 'CONCEPTUAL ART', 'kenzap-steps' ),
        description: __( 'Lorem Ipsum proin gravida nibivel velit auctor aenean velitsol licitu', 'kenzap-steps' ),
        key: new Date().getTime() + 3,
    },
    {
        title: __( 'PRINT & DIGITAL', 'kenzap-steps' ),
        description: __( 'Lorem Ipsum proin gravida nibivel velit auctor aenean velitsol licitu', 'kenzap-steps' ),
        key: new Date().getTime() + 4,
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
        '--paddingsMin': `${ attributes.containerPadding / 4 }`,
        '--paddingsMinPx': `${ attributes.containerPadding / 4 }px`,
        '--textColor': `${ attributes.textColor }`,
        '--stepStrokeNumberColor': `${ attributes.stepStrokeNumberColor }`,
    };

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
registerBlockType( 'kenzap/steps-5', {
    title: __( 'Kenzap Steps 5', 'kenzap-steps' ),
    icon: 'networking',
    category: 'layout',
    keywords: [
        __( 'Steps', 'kenzap-steps' ),
        __( 'Step', 'kenzap-steps' ),
    ],
    anchor: true,
    html: true,
    attributes: {
        ...blockProps,

        titleSize: {
            type: 'number',
            default: 24,
        },

        descriptionSize: {
            type: 'number',
            default: 15,
        },

        numberSize: {
            type: 'number',
            default: 140,
        },

        textColor: {
            type: 'string',
            default: '#333',
        },

        stepNumberColor: {
            type: 'string',
            default: '#fff',
        },

        stepStrokeNumberColor: {
            type: 'string',
            default: '#000',
        },

        items: {
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
            } );
            // TODO It is very bad solution to avoid low speed working of setAttributes function
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
                    className={ `kenzap-steps-5 block-${ attributes.blockUniqId }` }
                    attributes={ attributes }
                    style={ vars }
                    withBackground
                    withPadding
                >
                    <div className="kenzap-container" style={ kenzapContanerStyles }>
                        <div className="step-list">
                            <div className="kenzap-row">
                                { attributes.items && attributes.items.map( ( item, index ) => (
                                    <div
                                        key={ item.key }
                                        className="kenzap-col-3"
                                    >
                                        <div className="step-box">
                                            <div className="step-count">
                                                <span style={ {
                                                        fontSize: `${ attributes.numberSize }px`,
                                                        lineHeight: `${ attributes.numberSize }px`,
                                                        color: attributes.stepNumberColor,
                                                } }>
                                                    { `0${ index + 1 }` }
                                                </span>
                                            </div>
                                            <div className="step-content">
                                                <RichText.Content
                                                    tagName="h3"
                                                    value={ item.title }
                                                    style={ {
                                                        color: attributes.textColor,
                                                        fontSize: `${ attributes.titleSize }px`,
                                                        lineHeight: `${ attributes.titleSize * 1.3 }px`,
                                                    } }
                                                    />
                                                <RichText.Content
                                                    tagName="p"
                                                    value={ item.description }
                                                    style={ {
                                                        color: attributes.textColor,
                                                        fontSize: `${ attributes.descriptionSize }px`,
                                                        lineHeight: `${ attributes.descriptionSize * 1.7 }px`,
                                                    } }
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                ) ) }
                            </div>
                        </div>
                    </div>
                </ContainerSave>
            </div>
        );
    },
} );
