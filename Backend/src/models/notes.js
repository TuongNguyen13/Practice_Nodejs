import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './user.js';


const Note = sequelize.define('Note', {
    id: {  
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    noteid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {    
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING(1000), 
        allowNull: true,
    },
    ispublic: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'notes',     
    timestamps: false,       
    freezeTableName: true,  
});

User.hasMany(Note, { foreignKey: 'UserId', sourceKey: 'id' });
Note.belongsTo(User, { foreignKey: 'UserId', targetKey: 'id' });


export default Note;