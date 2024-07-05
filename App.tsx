import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Switch } from 'react-native';
import { FIREBASE_DB } from './FirebaseConfig';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [buttonColor, setButtonColor] = useState('#d3d3d3');
  const [editMode, setEditMode] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');

  useEffect(() => {
    const tasksRef = collection(FIREBASE_DB, 'tasks');

    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (taskTitle.trim().length > 0) {
      const newTask = {
        title: taskTitle,
        done: false
      };

      await addDoc(collection(FIREBASE_DB, 'tasks'), newTask);

      setTaskTitle('');
      setButtonColor('#d3d3d3');
    }
  };

  const toggleTaskStatus = async (taskId, done) => {
    const taskRef = doc(FIREBASE_DB, 'tasks', taskId);
    await updateDoc(taskRef, { done: !done });
  };

  const deleteTask = async (taskId) => {
    const taskRef = doc(FIREBASE_DB, 'tasks', taskId);
    await deleteDoc(taskRef);
  };

  const handleInputChange = (text) => {
    setTaskTitle(text);
    setButtonColor(text.trim().length > 0 ? '#007bff' : '#d3d3d3');
  };

  const startEditing = (taskId, initialTitle) => {
    setEditMode(taskId);
    setEditTaskTitle(initialTitle);
  };

  const cancelEditing = () => {
    setEditMode(null);
    setEditTaskTitle('');
  };

  const saveTaskTitle = async (taskId, newTitle) => {
    const taskRef = doc(FIREBASE_DB, 'tasks', taskId);
    await updateDoc(taskRef, { title: newTitle });

    setEditMode(null);
    setEditTaskTitle('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ToDo App</Text>
      <TextInput 
        style={styles.input}
        placeholder="Task Title"
        value={taskTitle}
        onChangeText={handleInputChange}
      />
      <View style={styles.buttonContainer}>
        <Button title="Add Task" onPress={addTask} disabled={taskTitle.trim().length === 0} color={buttonColor}/>
      </View>
      <FlatList 
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.task}>
            {editMode === item.id ? (
              <TextInput
                style={styles.editInput}
                value={editTaskTitle}
                onChangeText={setEditTaskTitle}
                onBlur={() => saveTaskTitle(item.id, editTaskTitle)}
                autoFocus
              />
            ) : (
              <>
                <Text style={item.done ? styles.doneTaskText : styles.taskText}>{item.title}</Text>
                <Switch 
                  value={item.done}
                  onValueChange={() => toggleTaskStatus(item.id, item.done)}
                />
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                  <Ionicons name='trash-bin-outline' size={24} color='red' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => startEditing(item.id, item.title)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#ffe4e1',  
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',  
  },
  buttonContainer: {
    marginBottom: 10,
    backgroundColor: '#fff', 
    borderRadius: 5,  
  },
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    backgroundColor: '#fff',  
  },
  taskText: {
    flex: 1,
  },
  doneTaskText: {
    flex: 1,
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deleteText: {
    color: 'red',
    marginLeft: 10,
  },
  editText: {
    color: 'blue',
    marginLeft: 10,
  },
  editInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',  
  },
});
