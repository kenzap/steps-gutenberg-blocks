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
    description: __( 'Morbi et nisl a sapien malesuada scelerisque. Suspendisse tempor turpis mattis', 'kenzap-steps' ),
    iconMediaId: '',
    iconMediaUrl: '',
};

export const defaultSubBlocks = JSON.stringify( [
    {
        title: __( 'Monitor Your Activity', 'kenzap-steps' ),
        description: __( 'Morbi et nisl a sapien malesuada scelerisque. Suspendisse tempor turpis mattis', 'kenzap-steps' ),
        iconMediaUrl: window.kenzap_steps_gutenberg_path + 'step-4/step-img-1.png',
        key: new Date().getTime() + 1,
    },
    {
        title: __( 'Analyze Your Results', 'kenzap-steps' ),
        description: __( 'Morbi et nisl a sapien malesuada scelerisque. Suspendisse tempor turpis mattis', 'kenzap-steps' ),
        iconMediaUrl: window.kenzap_steps_gutenberg_path + 'step-4/step-img-2.png',
        key: new Date().getTime() + 2,
    },
    {
        title: __( 'Get Better!', 'kenzap-steps' ),
        description: __( 'Morbi et nisl a sapien malesuada scelerisque. Suspendisse tempor turpis mattis', 'kenzap-steps' ),
        iconMediaUrl: window.kenzap_steps_gutenberg_path + 'step-4/step-img-3.png',
        key: new Date().getTime() + 3,
    },
] );

/**
 * Define typography defaults
 */
export const typographyArr = JSON.stringify([
    {
        'title': __( '- Title', 'kenzap-steps' ),
        'font-size': 24,
        'font-weight': 7,
        'line-height': 31,
        'margin-bottom': 15,
        'color': '#333333',
    },
    {
        'title': __( '- Description', 'kenzap-steps' ),
        'text-align':'',
        'font-size': 15,
        'font-weight': 4,
        'line-height': 25,
        'letter-spacing': 100,
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

    const imgStyles = {
        maxHeight: `${ attributes.iconSize }px`,
    };

    return {
        vars,
        kenzapContanerStyles,
        imgStyles,
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
registerBlockType( 'kenzap/steps-4', {
    title: __( 'Kenzap Steps 4', 'kenzap-steps' ),
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

        iconSize: {
            type: 'number',
            default: 134,
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

        const { vars, kenzapContanerStyles, imgStyles } = getStyles( props.attributes );

        return (
            <div className={ className ? className : '' } style={ vars }>
                <ContainerSave
                    className={ `kenzap-steps-4 block-${ attributes.blockUniqId }` }
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
                                            <div className="step-content">
                                                <img src={ item.iconMediaUrl } style={ imgStyles }
                                                    alt={ item.title.replace( /<(?:.|\n)*?>/gm, '' ) } />
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
