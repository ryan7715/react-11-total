import {useState, type SubmitEvent, type ChangeEvent} from "react";
import {useNavigate} from "react-router";
import styled from "styled-components";

type TodoItem = {
    id: number;
    text: string;
    completed: boolean;
};

const Main = styled.main`
    flex: 1;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 50px 24px;
`;

const Title = styled.h1`
    margin-bottom: 10px;
    color: ${({theme}) => theme.color.text};
`;

const Description = styled.p`
    margin-bottom: 35px;
    color: ${({theme}) => theme.color.textSecondary};
`;

const Card = styled.section`
    padding: 25px;
    background: ${({theme}) => theme.color.card};
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: 12px;
`;

const Heading = styled.h2`
    margin-bottom: 15px;
    color: ${({theme}) => theme.color.text};
`;

const Count = styled.p`
    margin-bottom: 20px;
    color: ${({theme}) => theme.color.textSecondary};
    font-size: 14px;
`;

const Form = styled.form`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    @media (max-width: 500px) {
        flex-direction: column;
    }
`;

const Input = styled.input`
    flex: 1;
    min-width: 0;
    padding: 13px;
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: 8px;
    background: ${({theme}) => theme.color.background};
    color: ${({theme}) => theme.color.text};

    &:focus {
        outline: 1px solid ${({theme}) => theme.color.primary};
    }
`;

const Button = styled.button`
    padding: 10px 18px;
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: 7px;
    background: ${({theme}) => theme.color.muted};
    color: ${({theme}) => theme.color.text};
    cursor: pointer;

    &:hover {
        border-color: ${({theme}) => theme.color.primary};
    }
`;

const BackButton = styled(Button)`
    margin-bottom: 20px;
`;

const AddButton = styled(Button)`
    background: ${({theme}) => theme.color.primary};
    color: white;
    border: none;
`;

const DeleteButton = styled(Button)`
    color: #EF4444;
`;

const List = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 12px;
    list-style: none;
`;

const Item = styled.li`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px;
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: 8px;
`;

const TodoText = styled.span<{ $completed: boolean }>`
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
    color: ${({theme}) => theme.color.text};
    text-decoration: ${({$completed}) =>
            $completed ? "line-through" : "none"};
    opacity: ${({$completed}) => ($completed ? 0.5 : 1)};
`;

const EmptyMessage = styled.p`
    padding: 25px;
    text-align: center;
    color: ${({theme}) => theme.color.textSecondary};
`;

function Todo() {
    const navigate = useNavigate();
    const [todoList, setTodoList] = useState<TodoItem[]>([]);
    const [todoValue, setTodoValue] = useState("");
    const handleGoBack = () => {
        navigate("/");
    };


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTodoValue(event.target.value);
    };

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newText = todoValue.trim();

        if (newText === "") return;

        const newTodo: TodoItem = {
            id: Date.now(),
            text: newText,
            completed: false,
        };

        setTodoList((prev) => [...prev, newTodo]);
        setTodoValue("");
    };

    const handleDelete = (id: number) => {
        const newList = todoList.filter((item) => item.id !== id);
        setTodoList(newList);
    };

    const handleToggle = (id: number) => {
        const newList = todoList.map((item) => {
            if (item.id === id) {
                return {...item, completed: !item.completed};
            }

            return item;
        });

        setTodoList(newList);
    };

    const filteredList = todoList.filter((item) =>
        item.text.toLowerCase().includes(todoValue.trim().toLowerCase())
    );

    const completedCount = todoList.filter(
        (item) => item.completed
    ).length;

    return (
        <Main>
            <BackButton type="button" onClick={handleGoBack}>
                뒤로가기
            </BackButton>

            <Title>Todo List</Title>

            <Description>
                오늘 해야 할 일을 기록하세요...
            </Description>

            <Card>
                <Heading>My ToDo</Heading>
                <Count>
                    전체 {todoList.length}개 / 완료 {completedCount}개
                </Count>

                <Form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="검색하세요."
                        value={todoValue}
                        onChange={handleChange}
                    />

                    <AddButton type="submit">
                        Add
                    </AddButton>
                </Form>

                <List>
                    {filteredList.length === 0 ? (
                        <EmptyMessage>
                            등록된 일이 없습니다.
                        </EmptyMessage>
                    ) : (
                        filteredList.map((item) => (
                            <Item key={item.id}>
                                <TodoText $completed={item.completed}>
                                    {item.text}
                                </TodoText>

                                <Button
                                    type="button"
                                    onClick={() => handleToggle(item.id)}
                                >
                                    {item.completed ? "취소" : "완료"}
                                </Button>

                                <DeleteButton
                                    type="button"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    삭제
                                </DeleteButton>
                            </Item>
                        ))
                    )}
                </List>
            </Card>
        </Main>
    );
}

export default Todo;
