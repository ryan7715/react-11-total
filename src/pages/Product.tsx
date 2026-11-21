import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import styled from "styled-components";

type Product = {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    description: string;
    category: string;
    rating: number;
};

type ApiResponse = {
    products: Product[];
};

const Container = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 24px;
    color: ${({theme}) => theme.color.text};
`;

const Title = styled.h1`
    font-size: 30px;
    margin-bottom: 12px;
`;

const Description = styled.p`
    color: ${({theme}) => theme.color.textSecondary};
    margin-bottom: 30px;
`;

const ActionButton = styled.button`
    padding: 10px 20px;
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: 8px;
    background-color: ${({theme}) => theme.color.card};
    color: ${({theme}) => theme.color.text};

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`;

const BackButton = styled(ActionButton)`
    margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
    font-size: 22px;
    margin-bottom: 24px;
`;

const ProductList = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;

    @media (max-width: 900px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 650px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 400px) {
        grid-template-columns: 1fr;
    }
`;

const ProductCard = styled.button`
    width: 100%;
    padding: 0;
    overflow: hidden;
    text-align: left;
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: 12px;
    background-color: ${({theme}) => theme.color.card};
    color: ${({theme}) => theme.color.text};
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-4px);
    }
`;

const Thumbnail = styled.img`
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: contain;
    background-color: ${({theme}) => theme.color.muted};
`;

const ProductInfo = styled.div`
    padding: 16px;
`;

const ProductName = styled.h3`
    font-size: 16px;
    margin-bottom: 10px;
`;

const Price = styled.p`
    font-size: 17px;
    font-weight: bold;
    color: ${({theme}) => theme.color.primary};
`;

const DetailWrap = styled.div`
    display: flex;
    align-items: center;
    gap: 40px;

    @media (max-width: 700px) {
        flex-direction: column;
    }
`;

const DetailImage = styled.img`
    width: 45%;
    max-height: 450px;
    object-fit: contain;
    border-radius: 12px;
    background-color: ${({theme}) => theme.color.card};

    @media (max-width: 700px) {
        width: 100%;
    }
`;

const DetailInfo = styled.div`
    flex: 1;

    h1 {
        margin-bottom: 20px;
    }

    p {
        margin-bottom: 16px;
        line-height: 1.6;
    }
`;

const QuantityWrap = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 24px 0;
`;

const QuantityText = styled.span`
    font-size: 18px;
    font-weight: bold;
`;

const TotalPrice = styled.h2`
    margin-top: 20px;
    color: ${({theme}) => theme.color.primary};
`;

function Product() {
    const navigate = useNavigate();
    const [list, setList] = useState<Product[]>([]);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetch("https://dummyjson.com/products?limit=100")
            .then(res => {
                if (!res.ok) {
                    throw new Error("상품을 불러오지 못했습니다.");
                }

                return res.json();
            })
            .then((json: ApiResponse) => {
                const randomProducts = [...json.products]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 20);

                setList(randomProducts);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedId === null) {
            return;
        }

        fetch(`https://dummyjson.com/products/${selectedId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("상품 정보를 불러오지 못했습니다.");
                }

                return res.json();
            })
            .then((json: Product) => {
                setProduct(json);
            })
            .catch(err => {
                console.log(err);
                setProduct(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedId]);

    if (loading) {
        return <Container>LOADING...</Container>;
    }

    if (selectedId !== null) {
        return (
            <Container>
                <BackButton
                    onClick={() => {
                        setSelectedId(null);
                        setProduct(null);
                        setQuantity(1);
                    }}
                >
                    뒤로가기
                </BackButton>

                {!product ? (
                    <p>상품 정보를 불러오지 못했습니다.</p>
                ) : (
                    <DetailWrap>
                        <DetailImage
                            src={product.thumbnail}
                            alt={product.title}
                        />

                        <DetailInfo>
                            <h1>{product.title}</h1>

                            <p>{product.description}</p>

                            <p>카테고리: {product.category}</p>

                            <p>평점: {product.rating}</p>

                            <Price>${product.price}</Price>

                            <QuantityWrap>
                                <ActionButton
                                    disabled={quantity <= 1}
                                    onClick={() => {
                                        if (quantity > 1) {
                                            setQuantity(quantity - 1);
                                        }
                                    }}
                                >
                                    -
                                </ActionButton>

                                <QuantityText>{quantity}</QuantityText>

                                <ActionButton
                                    onClick={() => {
                                        setQuantity(quantity + 1);
                                    }}
                                >
                                    +
                                </ActionButton>
                            </QuantityWrap>

                            <TotalPrice>
                                총 가격: ${(product.price * quantity).toFixed(2)}
                            </TotalPrice>
                        </DetailInfo>
                    </DetailWrap>
                )}
            </Container>
        );
    }

    return (
        <Container>
            <BackButton onClick={() => navigate("/")}>
                뒤로가기
            </BackButton>

            <Title>Product</Title>

            <Description>
                다양한 상품을 검색하고 자세한 정보를 확인해 보세요.
            </Description>

            <SectionTitle>오늘의 추천 상품</SectionTitle>

            {list.length === 0 ? (
                <p>검색 결과가 없습니다.</p>
            ) : (
                <ProductList>
                    {list.map(item => (
                        <ProductCard
                            key={item.id}
                            onClick={() => {
                                setLoading(true);
                                setProduct(null);
                                setQuantity(1);
                                setSelectedId(item.id);
                            }}
                        >
                            <Thumbnail
                                src={item.thumbnail}
                                alt={item.title}
                            />

                            <ProductInfo>
                                <ProductName>{item.title}</ProductName>
                                <Price>${item.price.toFixed(2)}</Price>
                            </ProductInfo>
                        </ProductCard>
                    ))}
                </ProductList>
            )}
        </Container>
    );
}

export default Product;
