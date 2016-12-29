module.exports.remove_last_directory = function(file_path)
{
    var dir_array = file_path.split('/');
    dir_array.pop();
    return( dir_array.join('/') );
}
